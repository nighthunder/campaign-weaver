<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignJob extends Model
{
    use HasFactory;

    protected $table = 'campaign_jobs';
    protected $fillable = ['campaign_id', 'job_batch_id', 'status', 'batch_size', 'sent_count', 'failed_count', 'error_message', 'started_at', 'completed_at'];
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
