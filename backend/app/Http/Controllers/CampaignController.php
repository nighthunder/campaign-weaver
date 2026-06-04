<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\ContactList;
use App\Jobs\SendCampaignBatch;
use App\Jobs\GenerateCampaignReport;
use App\Events\CampaignQueued;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = $request->user()
            ->campaigns()
            ->latest()
            ->paginate(20);

        return response()->json($campaigns);
    }

    public function show(Campaign $campaign)
    {
        $this->authorize('view', $campaign);

        $campaign->load('emailEvents');
        return response()->json($campaign);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'from_name' => 'nullable|string',
            'from_email' => 'nullable|email',
            'html_body' => 'nullable|string',
            'plain_text' => 'nullable|string',
        ]);

        $data['user_id'] = $request->user()->id;
        $campaign = Campaign::create($data);

        return response()->json($campaign, 201);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $this->authorize('update', $campaign);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255',
            'from_name' => 'sometimes|string',
            'from_email' => 'sometimes|email',
            'html_body' => 'sometimes|string',
            'plain_text' => 'sometimes|string',
        ]);

        $campaign->update($data);
        return response()->json($campaign);
    }

    public function destroy(Campaign $campaign)
    {
        $this->authorize('delete', $campaign);
        $campaign->delete();
        return response()->json(['deleted' => true]);
    }

    /**
     * Queue campaign to send emails
     * Usa Bus::batch para processar múltiplos jobs
     */
    public function queue(Request $request, Campaign $campaign)
    {
        $this->authorize('update', $campaign);

        $payload = $request->validate([
            'contact_list_id' => 'required|exists:contact_lists,id',
            'batch_size' => 'nullable|integer|min:10|max:1000',
        ]);

        $contactList = ContactList::findOrFail($payload['contact_list_id']);
        $batchSize = $payload['batch_size'] ?? 100;

        // Generate batch ID
        $campaign->generateBatchId();
        $campaign->update(['status' => 'queued']);

        $subscribers = $contactList->subscribers()
            ->where('status', 'subscribed')
            ->pluck(['id', 'email', 'first_name', 'last_name'])
            ->toArray();

        $campaign->update(['recipients_count' => count($subscribers)]);

        // Criar batch de jobs
        $jobs = [];
        foreach (array_chunk($subscribers, $batchSize) as $chunk) {
            $jobs[] = new SendCampaignBatch($campaign->id, $chunk);
        }

        // Usar Bus::batch para controlar todos os jobs
        $batch = Bus::batch($jobs)
            ->then(function () use ($campaign) {
                // Quando todos os jobs forem completados
                GenerateCampaignReport::dispatch($campaign->id);
            })
            ->catch(function () use ($campaign) {
                $campaign->update(['status' => 'failed']);
            })
            ->finally(function () use ($campaign) {
                \Log::info("Campaign batch {$campaign->batch_id} completed");
            })
            ->dispatch();

        event(new CampaignQueued($campaign));

        return response()->json([
            'queued' => true,
            'batch_id' => $campaign->batch_id,
            'jobs_count' => count($jobs),
            'total_recipients' => count($subscribers)
        ]);
    }

    /**
     * Get campaign metrics with Redis caching
     */
    public function metrics(Campaign $campaign)
    {
        $this->authorize('view', $campaign);

        $cacheKey = "campaign.{$campaign->id}.metrics";
        $metrics = \Cache::remember($cacheKey, 3600, function () use ($campaign) {
            return [
                'sent' => $campaign->sent_count,
                'opened' => $campaign->opened_count,
                'clicked' => $campaign->clicked_count,
                'bounced' => $campaign->bounced_count,
                'failed' => $campaign->failed_count,
                'open_rate' => $campaign->getOpenRate(),
                'click_rate' => $campaign->getClickRate(),
                'events' => $campaign->emailEvents()
                    ->select('event', \DB::raw('count(*) as count'))
                    ->groupBy('event')
                    ->pluck('count', 'event')
                    ->toArray()
            ];
        });

        return response()->json($metrics);
    }
}
