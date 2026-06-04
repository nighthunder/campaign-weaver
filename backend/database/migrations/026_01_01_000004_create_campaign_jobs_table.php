<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('campaign_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->cascadeOnDelete();
            $table->string('job_batch_id', 255)->nullable()->index();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->unsignedInteger('batch_size')->default(0);
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('failed_count')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_jobs');
    }
};
