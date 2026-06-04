<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactList;
use App\Models\Subscriber;

class SubscriberSeeder extends Seeder
{
    public function run(): void
    {
        $list = ContactList::first();
        if (! $list) return;

        $subs = [
            ['email' => 'alice@example.com', 'first_name' => 'Alice', 'last_name' => 'Santos'],
            ['email' => 'bruno@example.com', 'first_name' => 'Bruno', 'last_name' => 'Oliveira'],
            ['email' => 'carla@example.com', 'first_name' => 'Carla', 'last_name' => 'Silva'],
        ];

        $imported = 0;
        foreach ($subs as $s) {
            Subscriber::updateOrCreate(
                ['contact_list_id' => $list->id, 'email' => $s['email']],
                [
                    'first_name' => $s['first_name'],
                    'last_name' => $s['last_name'],
                    'metadata' => null,
                    'status' => 'subscribed',
                ]
            );
            $imported++;
        }

        // atualizar contador básico (opcional)
        $list->increment('subscriber_count', $imported);
    }
}
