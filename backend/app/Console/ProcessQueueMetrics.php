<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class ProcessQueueMetrics extends Command
{
    protected $signature = 'queue:metrics';
    protected $description = 'Show queue metrics from Redis';

    public function handle()
    {
        $redis = Redis::connection();

        $this->info('Queue Metrics:');
        $this->table(
            ['Queue', 'Jobs', 'Size'],
            [
                ['mails', $redis->llen('queues:mails'), $redis->dbsize()],
                ['default', $redis->llen('queues:default'), $redis->dbsize()],
                ['reports', $redis->llen('queues:reports'), $redis->dbsize()],
            ]
        );
    }
}
