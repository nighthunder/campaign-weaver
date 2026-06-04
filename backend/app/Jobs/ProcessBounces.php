<?php

namespace App\Jobs;

use App\Models\EmailEvent;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessBounces implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 180;

    public function __construct()
    {
        $this->onQueue('default');
    }

    public function handle(): void
    {
        $bounceEvents = EmailEvent::where('event', 'bounced')
            ->where('created_at', '>=', now()->subHours(24))
            ->get();

        foreach ($bounceEvents as $event) {
            $subscriber = Subscriber::where('email', $event->email)->first();
            if ($subscriber) {
                $subscriber->update(['status' => 'bounced']);
            }
        }
    }
}