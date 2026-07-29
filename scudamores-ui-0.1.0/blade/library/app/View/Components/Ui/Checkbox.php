<?php

namespace App\View\Components\Ui;

use Illuminate\Contracts\View\View;

class Checkbox extends FormControl
{
    public bool $isChecked;

    public function __construct(
        string $name,
        ?string $id = null,
        mixed $value = '1',
        string $label = '',
        string $bag = 'default',
        bool $checked = false,
    ) {
        parent::__construct($name, $id, $value, $label, $bag);
        $old = old(self::sessionPath($name));
        $this->value = $value;
        $this->isChecked = is_array($old)
            ? in_array((string) $value, array_map('strval', $old), true)
            : ($old !== null ? (string) $old === (string) $value : $checked);
    }

    public function render(): View
    {
        return view('components.ui.checkbox');
    }
}
