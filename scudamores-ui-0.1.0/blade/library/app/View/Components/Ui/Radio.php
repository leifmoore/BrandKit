<?php

namespace App\View\Components\Ui;

use Illuminate\Contracts\View\View;

class Radio extends FormControl
{
    public bool $isChecked;

    public function __construct(
        string $name,
        ?string $id = null,
        mixed $value = '',
        string $label = '',
        string $bag = 'default',
        bool $checked = false,
    ) {
        parent::__construct($name, $id, $value, $label, $bag);
        $selected = old(self::sessionPath($name));
        $this->value = $value;
        $this->isChecked = $selected !== null ? (string) $selected === (string) $value : $checked;
    }

    public function render(): View
    {
        return view('components.ui.radio');
    }
}
