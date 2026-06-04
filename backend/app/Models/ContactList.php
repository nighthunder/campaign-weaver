<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ContactList extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'description', 'subscriber_count', 'status'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscribers(): HasMany
    {
        return $this->hasMany(Subscriber::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function subscriptionCount(): int
    {
        return $this->subscribers()->where('status', 'subscribed')->count();
    }
}
