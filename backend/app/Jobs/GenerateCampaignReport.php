<?php

namespace App\Jobs;

use App\Models\Campaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateCampaignReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 300; // 5 minutos
    
    public $campaignId;

    public function __construct(int $campaignId)
    {
        $this->onQueue('reports');
        $this->campaignId = $campaignId;
    }

    public function handle(): void
    {
        $campaign = Campaign::find($this->campaignId);
        if (!$campaign) return;

        Log::info("Generating report for campaign {$campaign->id}");

        // Simular análise pesada
        $openedCount = $campaign->emailEvents()->where('event', 'opened')->distinct('email')->count();
        $clickedCount = $campaign->emailEvents()->where('event', 'clicked')->distinct('email')->count();
        $bouncedCount = $campaign->emailEvents()->where('event', 'bounced')->count();

        $campaign->update([
            'opened_count' => $openedCount,
            'clicked_count' => $clickedCount,
            'bounced_count' => $bouncedCount,
            'finished_at' => now()
        ]);

        Log::info("Report generated: Opens={$openedCount}, Clicks={$clickedCount}, Bounces={$bouncedCount}");
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Report generation failed for campaign {$this->campaignId}", [
            'error' => $exception->getMessage()
        ]);
    }
}