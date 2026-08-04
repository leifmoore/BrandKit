<?php

declare(strict_types=1);

namespace PatternValidation\BladeFixture\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

final class PhosphorIcon extends Component
{
    public function render(): View
    {
        return view('components.phosphor-icon');
    }
}

