<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_list_id')->constrained('contact_lists')->cascadeOnDelete();
            $table->string('email', 255)->index();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->json('metadata')->nullable();
            $table->enum('status', ['subscribed', 'unsubscribed', 'bounced'])->default('subscribed');
            $table->timestamps();

            $table->unique(['contact_list_id', 'email']);
            $table->index(['contact_list_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscribers');
    }
};
