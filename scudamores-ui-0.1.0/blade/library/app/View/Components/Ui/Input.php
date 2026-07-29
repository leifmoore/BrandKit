<?php

namespace App\View\Components\Ui;

use Illuminate\Contracts\View\View;

class Input extends FormControl
{
    public function __construct(
        string $name,
        ?string $id = null,
        mixed $value = '',
        string $label = '',
        string $bag = 'default',
        public string $type = 'text',
    ) {
        parent::__construct($name, $id, $value, $label, $bag);
        $this->formControlAttributes = $this->formControlAttributes->merge(['type' => $type]);
    }

    public function render(): View
    {
        return view('components.ui.input');
    }
}
