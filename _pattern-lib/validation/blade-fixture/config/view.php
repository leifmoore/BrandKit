<?php

declare(strict_types=1);

$patternRoot = dirname(__DIR__, 3);
$componentLibraryRoot = dirname($patternRoot).'/_comp-lib';

return [
    'paths' => [
        resource_path('views'),
        $patternRoot.'/recipes',
        $componentLibraryRoot.'/blade/library/resources/views',
    ],
    'compiled' => storage_path('framework/views'),
];

