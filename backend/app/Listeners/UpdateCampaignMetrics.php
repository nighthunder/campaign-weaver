<?php

namespace App\Listeners;

use App\Events\CampaignQueued;
use Illuminate\Support\Facades\Cache;

class UpdateCampaignMetrics
{
    public function handle(CampaignQueued $event): void
    {
        $cacheKey = "campaign.{$event->campaign->id}.metrics";
        Cache::put($cacheKey, [
            'sent' => $event->campaign->sent_count,
            'opened' => $event->campaign->opened_count,
            'clicked' => $event->campaign->clicked_count,
            'failed' => $event->campaign->failed_count,
        ], now()->addHours(24));
    }
}
