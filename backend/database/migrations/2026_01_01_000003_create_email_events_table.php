<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('email_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->string('email', 255)->index();
            $table->enum('event', ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'])->index();
            $table->json('payload')->nullable();
            $table->string('message_id')->nullable()->index();
            $table->timestamps();

            $table->index(['campaign_id', 'email']);
            $table->index(['campaign_id', 'event']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_events');
    }
};
