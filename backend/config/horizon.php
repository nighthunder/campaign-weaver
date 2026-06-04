<?php

return [
    'name' => env('APP_NAME', 'Laravel'),
    'use_dashboard' => env('HORIZON_ENABLE_DASHBOARD', true),
    'prefix' => env('HORIZON_PREFIX', 'horizon:'),

    'waits' => [
        'redis:default' => 60,
        'redis:mails' => 30,
        'redis:reports' => 120,
    ],

    'environments' => [
        'production' => [
            'supervisor-1' => [
                'maxProcesses' => 10,
                'balanceMaxShift' => '1',
                'balanceUnshift' => false,
                'maxTime' => 0,
                'sleep' => 3,
                'maxTries' => 3,
                'timeout' => 60,
            ],
        ],

        'local' => [
            'supervisor-1' => [
                'maxProcesses' => 3,
                'sleep' => 3,
                'timeout' => 60,
            ],
        ],
    ],

    'fast_termination' => false,

    'memory_limit' => 64,

    'cache' => 'redis',
];
