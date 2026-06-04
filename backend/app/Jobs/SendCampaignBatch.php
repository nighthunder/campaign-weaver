<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\Subscriber;
use App\Mail\CampaignMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendCampaignBatch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;
    public $timeout = 120;
    public $backoff = [10, 30, 60, 120, 300]; // segundos

    public $campaignId;
    public $subscribers;

    public function __construct(int $campaignId, array $subscribers)
    {
        $this->onQueue('mails');
        $this->campaignId = $campaignId;
        $this->subscribers = $subscribers;
    }

    public function handle(): void
    {
        $campaign = Campaign::find($this->campaignId);
        if (!$campaign) {
            Log::warning("Campaign {$this->campaignId} not found");
            return;
        }

        $campaign->update(['status' => 'sending']);

        foreach ($this->subscribers as $sub) {
            try {
                $subscriber = Subscriber::find($sub['id']);
                if (!$subscriber || $subscriber->status !== 'subscribed') {
                    continue;
                }

                $mailable = new CampaignMail(
                    $campaign->subject ?? 'No Subject',
                    $campaign->html_body ?? '',
                    $campaign->from_name ?? config('mail.from.name'),
                    $campaign->from_email ?? config('mail.from.address'),
                    $subscriber
                );

                Mail::to($sub['email'])->send($mailable);

                $campaign->increment('sent_count');

                // Log event
                $campaign->emailEvents()->create([
                    'email' => $sub['email'],
                    'event' => 'sent',
                    'payload' => ['subscriber_id' => $subscriber->id]
                ]);

                Log::info("Email sent to {$sub['email']} for campaign {$campaign->id}");

            } catch (\Exception $e) {
                $campaign->increment('failed_count');
                Log::error("Failed to send campaign email", [
                    'email' => $sub['email'] ?? 'unknown',
                    'campaign_id' => $campaign->id,
                    'error' => $e->getMessage()
                ]);

                // Se muitos falhos, relança a exception
                if ($this->attempts() >= $this->tries) {
                    $campaign->update(['status' => 'failed']);
                    $this->fail($e);
                }
            }
        }

        $campaign->update(['status' => 'sent', 'sent_at' => Carbon::now()]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::critical("Campaign batch job failed permanently", [
            'campaign_id' => $this->campaignId,
            'error' => $exception->getMessage()
        ]);

        $campaign = Campaign::find($this->campaignId);
        if ($campaign) {
            $campaign->update(['status' => 'failed']);
        }
    }
}
