<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactList;
use App\Models\User;

class ContactListSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first(); // assume pelo menos 1 usuário existe

        if (! $user) {
            return;
        }

        ContactList::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Clientes Ativos'],
            ['description' => 'Lista inicial de clientes', 'subscriber_count' => 0]
        );

        ContactList::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Newsletter'],
            ['description' => 'Assinantes da newsletter', 'subscriber_count' => 0]
        );
    }
}
