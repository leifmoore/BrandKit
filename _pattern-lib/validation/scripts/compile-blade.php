<?php

declare(strict_types=1);

use Illuminate\Filesystem\Filesystem;
use Illuminate\Contracts\View\Factory as ViewFactoryContract;
use Illuminate\Events\Dispatcher;
use Illuminate\Foundation\Application;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\View\Engines\EngineResolver;
use Illuminate\View\Factory;
use Illuminate\View\FileViewFinder;
use Illuminate\View\DynamicComponent;

$root = dirname(__DIR__, 2);
require $root.'/validation/vendor/autoload.php';

$cache = $root.'/validation/tmp/blade-cache';
if (! is_dir($cache)) {
    mkdir($cache, 0777, true);
}

$filesystem = new Filesystem;
$applicationRoot = $root.'/validation/tmp/laravel';
if (! is_dir($applicationRoot.'/app')) {
    mkdir($applicationRoot.'/app', 0777, true);
}
file_put_contents($applicationRoot.'/composer.json', '{"autoload":{"psr-4":{"App\\\\":"app/"}}}');
$container = new Application($applicationRoot);
$viewRoot = $root.'/validation/tmp/views';
if (! is_dir($viewRoot.'/validation')) {
    mkdir($viewRoot.'/validation', 0777, true);
}
file_put_contents($viewRoot.'/validation/icon.blade.php', '<span {{ $attributes }}></span>');

$viewFactory = new Factory(
    new EngineResolver,
    new FileViewFinder($filesystem, [$viewRoot]),
    new Dispatcher($container),
);
$viewFactory->setContainer($container);
$container->instance(ViewFactoryContract::class, $viewFactory);
$container->instance(Factory::class, $viewFactory);
$container->instance('view', $viewFactory);

$compiler = new BladeCompiler($filesystem, $cache);
$compiler->component(DynamicComponent::class, 'dynamic-component');
$compiler->anonymousComponentPath($root.'/../_comp-lib/blade/library/resources/views/components');
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root.'/recipes'));
$files = [];
foreach ($iterator as $file) {
    if ($file->isFile() && str_ends_with($file->getFilename(), '.blade.php')) {
        $files[] = $file->getPathname();
    }
}
sort($files);

$records = [];
foreach ($files as $index => $path) {
    $source = file_get_contents($path);
    preg_match_all('/<x-(phosphor-[a-z0-9-]+)/', $source, $iconMatches);
    foreach (array_unique($iconMatches[1] ?? []) as $icon) {
        $compiler->component('validation.icon', $icon);
    }
    try {
        $compiled = $compiler->compileString($source);
    } catch (Throwable $error) {
        fwrite(STDERR, substr($path, strlen($root) + 1).': '.$error->getMessage()."\n");
        exit(1);
    }
    $compiledPath = $cache.'/'.str_pad((string) $index, 3, '0', STR_PAD_LEFT).'.php';
    file_put_contents($compiledPath, $compiled);
    exec('php -l '.escapeshellarg($compiledPath).' 2>&1', $output, $exitCode);
    if ($exitCode !== 0) {
        fwrite(STDERR, implode("\n", $output)."\n");
        exit(1);
    }
    $records[] = [
        'path' => substr($path, strlen($root) + 1),
        'compiledBytes' => strlen($compiled),
    ];
}

file_put_contents(
    $root.'/validation/reports/blade-compile.json',
    json_encode([
        'schemaVersion' => '1.0.0',
        'generatedAt' => '2026-08-04',
        'framework' => 'Laravel 12.64.0',
        'compiledFiles' => count($records),
        'records' => $records,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n"
);

fwrite(STDOUT, 'Blade compilation passed: '.count($records)." files compiled and linted.\n");
