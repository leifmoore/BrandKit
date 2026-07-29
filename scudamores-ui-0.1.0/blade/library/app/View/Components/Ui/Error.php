<?php

namespace App\View\Components\Ui;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Error extends Component
{
    public string $id;
    public string $field;

    public function __construct(
        public string $for,
        public ?string $value = null,
        public string $bag = 'default',
    ) {
        $this->id = str_replace(['[', ']', '.'], ['-', '', '-'], $for).'-error';
        $this->field = FormControl::sessionPath($for);
    }

    public function render(): View
    {
        return view('components.ui.error');
    }
}
