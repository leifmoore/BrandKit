<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\ViewErrorBag;
use Illuminate\View\ComponentAttributeBag;
use Symfony\Component\Console\Output\BufferedOutput;

const EXPECTED_PATTERN_COUNT = 25;

$patternRoot = dirname(__DIR__, 2);
$validationRoot = $patternRoot.'/validation';
$fixtureRoot = $validationRoot.'/blade-fixture';
$autoload = $validationRoot.'/vendor/autoload.php';
$reportPath = $validationRoot.'/reports/blade-render.json';
$sourceDateEpoch = getenv('SOURCE_DATE_EPOCH');
$generatedAtEpoch = is_string($sourceDateEpoch) && ctype_digit($sourceDateEpoch)
    ? (int) $sourceDateEpoch
    : 1785801600;

if (! is_file($autoload)) {
    fail('Missing validation dependencies. Run composer install in _pattern-lib/validation first.');
}

require $autoload;

/** @var Application $app */
$app = require $fixtureRoot.'/bootstrap/app.php';

/** @var ConsoleKernel $kernel */
$kernel = $app->make(ConsoleKernel::class);
$kernel->bootstrap();

$cacheChecks = [];
foreach (['view:clear', 'view:cache'] as $command) {
    $output = new BufferedOutput;
    $exitCode = $kernel->call($command, [], $output);
    $cacheChecks[] = [
        'command' => $command,
        'exitCode' => $exitCode,
        'output' => trim($output->fetch()),
    ];
}

$request = Request::create('/', 'GET');
$session = $app->make('session')->driver();
$session->start();
$request->setLaravelSession($session);
$app->instance('request', $request);
$app->make('view')->share('errors', new ViewErrorBag);

$manifestPaths = glob($patternRoot.'/catalog/recipes/*.json') ?: [];
sort($manifestPaths);

$records = [];
$failures = [];
$recipeIds = [];
$primaryRenderCount = 0;

foreach ($manifestPaths as $manifestPath) {
    try {
        $manifest = decodeJsonFile($manifestPath);
        $patternId = requireString($manifest, 'id', $manifestPath);
        $recipeIds[] = $patternId;

        $bladeFiles = $manifest['blade']['files'] ?? [];
        if (! is_array($bladeFiles) || count($bladeFiles) !== 1 || ! is_string($bladeFiles[0])) {
            throw new RuntimeException('Expected exactly one primary Blade file.');
        }

        $templateRelative = $bladeFiles[0];
        $templatePath = $patternRoot.'/'.$templateRelative;
        if (! is_file($templatePath)) {
            throw new RuntimeException('Missing Blade template: '.$templateRelative);
        }

        $scenarioFixtures = [];
        $primaryFixture = $manifest['blade']['exampleData'] ?? $manifest['fixture'] ?? null;
        if (! is_string($primaryFixture)) {
            throw new RuntimeException('Missing primary Blade fixture path.');
        }
        $scenarioFixtures['primary'] = $primaryFixture;

        foreach (($manifest['scenarios'] ?? []) as $scenario) {
            if (! is_array($scenario) || ! isset($scenario['id'], $scenario['fixture'])) {
                throw new RuntimeException('Each scenario must provide id and fixture.');
            }
            $scenarioFixtures[(string) $scenario['id']] = (string) $scenario['fixture'];
        }

        $seenFixtures = [];
        foreach ($scenarioFixtures as $scenarioId => $fixtureRelative) {
            if (isset($seenFixtures[$fixtureRelative])) {
                continue;
            }
            $seenFixtures[$fixtureRelative] = true;

            $fixturePath = $patternRoot.'/'.$fixtureRelative;
            if (! is_file($fixturePath)) {
                throw new RuntimeException('Missing fixture: '.$fixtureRelative);
            }

            $data = decodeJsonFile($fixturePath);
            $data['attributes'] = new ComponentAttributeBag;

            $html = $app->make('view')->file($templatePath, $data)->render();
            $unresolvedComponents = preg_match_all('/<x-[a-z0-9_.:-]+/i', $html, $matches);

            if ($unresolvedComponents !== false && $unresolvedComponents > 0) {
                throw new RuntimeException('Rendered output contains unresolved Blade components: '.implode(', ', array_unique($matches[0])));
            }

            if ($scenarioId === 'primary') {
                $primaryRenderCount++;
            }

            $records[] = [
                'patternId' => $patternId,
                'scenarioId' => $scenarioId,
                'template' => $templateRelative,
                'fixture' => $fixtureRelative,
                'htmlBytes' => strlen($html),
                'htmlSha256' => hash('sha256', $html),
                'resolvedComponentTags' => true,
                'containsPatternMarker' => str_contains($html, 'data-pattern="'.$patternId.'"'),
            ];
        }
    } catch (Throwable $error) {
        $failures[] = [
            'manifest' => relativeToPatternRoot($manifestPath, $patternRoot),
            'message' => $error->getMessage(),
        ];
    }
}

$compiledViews = glob($fixtureRoot.'/storage/framework/views/*.php') ?: [];
$uniqueRecipeIds = array_values(array_unique($recipeIds));
sort($uniqueRecipeIds);

if (count($manifestPaths) !== EXPECTED_PATTERN_COUNT) {
    $failures[] = [
        'manifest' => 'catalog/recipes',
        'message' => sprintf('Expected %d manifests, found %d.', EXPECTED_PATTERN_COUNT, count($manifestPaths)),
    ];
}

if (count($uniqueRecipeIds) !== EXPECTED_PATTERN_COUNT) {
    $failures[] = [
        'manifest' => 'catalog/recipes',
        'message' => sprintf('Expected %d unique pattern IDs, found %d.', EXPECTED_PATTERN_COUNT, count($uniqueRecipeIds)),
    ];
}

if ($primaryRenderCount !== EXPECTED_PATTERN_COUNT) {
    $failures[] = [
        'manifest' => 'catalog/recipes',
        'message' => sprintf('Expected %d primary renders, completed %d.', EXPECTED_PATTERN_COUNT, $primaryRenderCount),
    ];
}

foreach ($cacheChecks as $check) {
    if ($check['exitCode'] !== 0) {
        $failures[] = [
            'manifest' => 'validation/blade-fixture',
            'message' => $check['command'].' failed: '.$check['output'],
        ];
    }
}

$report = [
    'schemaVersion' => '1.0.0',
    'generatedAt' => gmdate('Y-m-d\\TH:i:s\\Z', $generatedAtEpoch),
    'status' => $failures === [] ? 'passed' : 'failed',
    'framework' => [
        'laravel' => $app->version(),
        'php' => PHP_VERSION,
        'fixture' => 'validation/blade-fixture',
    ],
    'viewCache' => [
        'checks' => $cacheChecks,
        'compiledFileCount' => count($compiledViews),
    ],
    'coverage' => [
        'expectedPatterns' => EXPECTED_PATTERN_COUNT,
        'discoveredManifests' => count($manifestPaths),
        'uniquePatternIds' => count($uniqueRecipeIds),
        'primaryRenders' => $primaryRenderCount,
        'scenarioRenders' => count($records),
    ],
    'records' => $records,
    'failures' => $failures,
    'limitations' => [
        'Phosphor components render through a local SVG stub; production icon path geometry is not compared here.',
        'This check proves PHP execution, Blade component resolution, fixture compatibility, and view caching. Alpine, focus, keyboard, Floating UI, and browser layout behaviour require the interaction and visual test tracks.',
        'No production routes, persistence, authentication, authorization, payment, or business services are booted.',
    ],
];

$reportDirectory = dirname($reportPath);
if (! is_dir($reportDirectory) && ! mkdir($reportDirectory, 0777, true) && ! is_dir($reportDirectory)) {
    fail('Unable to create report directory: '.$reportDirectory);
}

file_put_contents(
    $reportPath,
    json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n"
);

if ($failures !== []) {
    foreach ($failures as $failure) {
        fwrite(STDERR, $failure['manifest'].': '.$failure['message']."\n");
    }
    exit(1);
}

fwrite(
    STDOUT,
    sprintf(
        "Blade render validation passed: %d patterns, %d fixture scenarios, %d cached views.\n",
        $primaryRenderCount,
        count($records),
        count($compiledViews),
    )
);

/** @return array<string, mixed> */
function decodeJsonFile(string $path): array
{
    $decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

    if (! is_array($decoded)) {
        throw new RuntimeException('Expected a JSON object: '.$path);
    }

    return $decoded;
}

/** @param array<string, mixed> $value */
function requireString(array $value, string $key, string $path): string
{
    if (! isset($value[$key]) || ! is_string($value[$key]) || $value[$key] === '') {
        throw new RuntimeException('Missing string '.$key.' in '.$path);
    }

    return $value[$key];
}

function relativeToPatternRoot(string $path, string $patternRoot): string
{
    $prefix = rtrim($patternRoot, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;

    return str_starts_with($path, $prefix) ? substr($path, strlen($prefix)) : $path;
}

function fail(string $message): never
{
    fwrite(STDERR, $message."\n");
    exit(1);
}
