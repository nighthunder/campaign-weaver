<?php

namespace App\Events;

use App\Models\Campaign;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CampaignQueued implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $campaign;

    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    public function broadcastOn()
    {
        return new Channel('campaigns.' . $this->campaign->user_id);
    }

    public function broadcastAs()
    {
        return 'campaign.queued';
    }
}
