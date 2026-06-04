<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'subject', 'from_name', 'from_email',
        'html_body', 'plain_text', 'status', 'recipients_count', 'batch_id'
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function emailEvents(): HasMany
    {
        return $this->hasMany(EmailEvent::class);
    }

    public function campaignJobs(): HasMany
    {
        return $this->hasMany(CampaignJob::class);
    }

    public function generateBatchId(): string
    {
        return $this->batch_id = 'batch_' . Str::random(16);
    }

    public function getOpenRate(): float
    {
        if ($this->sent_count === 0) return 0;
        return round(($this->opened_count / $this->sent_count) * 100, 2);
    }

    public function getClickRate(): float
    {
        if ($this->sent_count === 0) return 0;
        return round(($this->clicked_count / $this->sent_count) * 100, 2);
    }
}
