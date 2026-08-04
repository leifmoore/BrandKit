<?php

declare(strict_types=1);

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use PatternValidation\BladeFixture\Providers\PatternLibraryServiceProvider;

$fixtureRoot = dirname(__DIR__);

foreach ([
    $fixtureRoot.'/bootstrap/cache',
    $fixtureRoot.'/storage/framework/cache/data',
    $fixtureRoot.'/storage/framework/sessions',
    $fixtureRoot.'/storage/framework/testing',
    $fixtureRoot.'/storage/framework/views',
    $fixtureRoot.'/storage/logs',
] as $runtimeDirectory) {
    if (! is_dir($runtimeDirectory) && ! mkdir($runtimeDirectory, 0777, true) && ! is_dir($runtimeDirectory)) {
        throw new RuntimeException('Unable to create Laravel runtime directory: '.$runtimeDirectory);
    }
}

require_once $fixtureRoot.'/app/View/Components/PhosphorIcon.php';
require_once $fixtureRoot.'/app/Providers/PatternLibraryServiceProvider.php';

return Application::configure(basePath: $fixtureRoot)
    ->withRouting(
        web: $fixtureRoot.'/routes/web.php',
        commands: $fixtureRoot.'/routes/console.php',
        health: '/up',
    )
    ->withProviders([
        PatternLibraryServiceProvider::class,
    ])
    ->withExceptions(static function (Exceptions $exceptions): void {
        // Default Laravel exception handling is sufficient for this disposable fixture.
    })
    ->create();
