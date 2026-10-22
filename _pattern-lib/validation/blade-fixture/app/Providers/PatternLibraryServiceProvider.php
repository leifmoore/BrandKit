<?php

declare(strict_types=1);

namespace PatternValidation\BladeFixture\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use PatternValidation\BladeFixture\View\Components\PhosphorIcon;
use RuntimeException;

final class PatternLibraryServiceProvider extends ServiceProvider
{
    /** @var list<string> */
    private const FORM_COMPONENTS = [
        'FormControl.php',
        'Input.php',
        'Checkbox.php',
        'Radio.php',
        'Select.php',
        'Textarea.php',
        'Error.php',
    ];

    /** @var array<string, class-string> */
    private const CLASS_COMPONENT_ALIASES = [
        'ui.input' => \App\View\Components\Ui\Input::class,
        'ui.checkbox' => \App\View\Components\Ui\Checkbox::class,
        'ui.radio' => \App\View\Components\Ui\Radio::class,
        'ui.select' => \App\View\Components\Ui\Select::class,
        'ui.textarea' => \App\View\Components\Ui\Textarea::class,
        'ui.error' => \App\View\Components\Ui\Error::class,
    ];

    /** @var list<string> */
    private const PHOSPHOR_ALIASES = [
        'phosphor-arrow-counter-clockwise',
        'phosphor-arrow-down',
        'phosphor-arrow-left',
        'phosphor-arrow-up',
        'phosphor-arrows-clockwise',
        'phosphor-calendar-blank',
        'phosphor-caret-down',
        'phosphor-caret-left',
        'phosphor-caret-right',
        'phosphor-chart-bar',
        'phosphor-check',
        'phosphor-check-circle',
        'phosphor-circle',
        'phosphor-copy',
        'phosphor-currency-dollar',
        'phosphor-dots-three',
        'phosphor-eye',
        'phosphor-floppy-disk',
        'phosphor-gear',
        'phosphor-house',
        'phosphor-list',
        'phosphor-lock-key',
        'phosphor-magnifying-glass',
        'phosphor-minus',
        'phosphor-paper-plane-tilt',
        'phosphor-pencil',
        'phosphor-plus',
        'phosphor-receipt',
        'phosphor-shopping-cart',
        'phosphor-squares-four',
        'phosphor-tag',
        'phosphor-ticket',
        'phosphor-trash',
        'phosphor-tray',
        'phosphor-trend-up',
        'phosphor-user',
        'phosphor-users',
        'phosphor-warning',
        'phosphor-warning-circle',
        'phosphor-x',
    ];

    public function register(): void
    {
        $componentClassRoot = $this->componentLibraryRoot().'/blade/library/app/View/Components/Ui';

        foreach (self::FORM_COMPONENTS as $classFile) {
            $path = $componentClassRoot.'/'.$classFile;

            if (! is_file($path)) {
                throw new RuntimeException('Missing canonical Blade component class: '.$path);
            }

            require_once $path;
        }
    }

    public function boot(BladeCompiler $blade): void
    {
        $componentViews = $this->componentLibraryRoot().'/blade/library/resources/views/components';

        if (! is_dir($componentViews)) {
            throw new RuntimeException('Missing canonical anonymous Blade components: '.$componentViews);
        }

        $blade->anonymousComponentPath($componentViews);

        foreach (self::CLASS_COMPONENT_ALIASES as $alias => $componentClass) {
            $blade->component($componentClass, $alias);
        }

        foreach (self::PHOSPHOR_ALIASES as $alias) {
            $blade->component(PhosphorIcon::class, $alias);
        }
    }

    private function componentLibraryRoot(): string
    {
        $patternRoot = dirname($this->app->basePath(), 2);

        return dirname($patternRoot).'/_comp-lib';
    }
}
