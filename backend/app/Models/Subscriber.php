<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = ['contact_list_id', 'email', 'first_name', 'last_name', 'metadata', 'status'];

    protected $casts = [
        'metadata' => 'array'
    ];

    public function contactList(): BelongsTo
    {
        return $this->belongsTo(ContactList::class);
    }
}
