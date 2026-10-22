<?php

declare(strict_types=1);

return [
    'name' => 'Scudamores Pattern Validation',
    'env' => env('APP_ENV', 'testing'),
    'debug' => (bool) env('APP_DEBUG', true),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'UTC',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'faker_locale' => 'en_GB',
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY', 'base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='),
    'previous_keys' => [],
    'maintenance' => [
        'driver' => 'file',
        'store' => 'array',
    ],
];

