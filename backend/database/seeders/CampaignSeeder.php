<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\User;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (! $user) return;

        Campaign::updateOrCreate(
            ['user_id' => $user->id, 'name' => 'Campanha de Boas Vindas'],
            [
                'subject' => 'Bem-vindo à nossa lista',
                'from_name' => 'Campaign Weaver',
                'from_email' => config('mail.from.address'),
                'html_body' => '<h1>Bem-vindo!</h1><p>Obrigado por se inscrever.</p>',
                'plain_text' => 'Bem-vindo! Obrigado por se inscrever.',
                'status' => 'draft',
                'recipients_count' => 0
            ]
        );
    }
}
