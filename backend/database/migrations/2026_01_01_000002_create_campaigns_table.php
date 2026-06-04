<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 255);
            $table->string('subject', 255)->nullable();
            $table->string('from_name')->nullable();
            $table->string('from_email')->nullable();
            $table->longText('html_body')->nullable();
            $table->text('plain_text')->nullable();
            $table->enum('status', ['draft', 'queued', 'sending', 'sent', 'paused', 'failed'])->default('draft');

            // Metrics
            $table->unsignedInteger('recipients_count')->default(0);
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('opened_count')->default(0);
            $table->unsignedInteger('clicked_count')->default(0);
            $table->unsignedInteger('bounced_count')->default(0);
            $table->unsignedInteger('failed_count')->default(0);

            $table->timestamp('sent_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->string('batch_id')->nullable()->index();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('batch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
