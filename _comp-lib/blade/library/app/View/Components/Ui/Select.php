<?php

namespace App\View\Components\Ui;

use BackedEnum;
use Illuminate\Contracts\View\View;
use UnitEnum;

class Select extends FormControl
{
    public array $options;

    public function __construct(
        string $name,
        ?string $id = null,
        mixed $value = '',
        string $label = '',
        string $bag = 'default',
        array|string $options = [],
        public bool $multiple = false,
        public string $placeholder = '',
    ) {
        parent::__construct($name, $id, $value, $label, $bag);
        $this->options = $this->normaliseOptions($options);
        if ($multiple && ! str_ends_with($name, '[]')) {
            $this->formControlAttributes->offsetSet('name', $name.'[]');
        }
    }

    private function normaliseOptions(array|string $options): array
    {
        if (! is_string($options) || ! enum_exists($options)) {
            return is_array($options) ? $options : [];
        }

        return collect($options::cases())->mapWithKeys(function (UnitEnum $case): array {
            $key = $case instanceof BackedEnum ? $case->value : $case->name;
            $label = method_exists($case, 'label') ? $case->label() : str($case->name)->headline()->toString();

            return [$key => $label];
        })->all();
    }

    public function isSelected(string|int $option): bool
    {
        $selected = is_array($this->value) ? $this->value : [$this->value];

        return in_array((string) $option, array_map('strval', $selected), true);
    }

    public function render(): View
    {
        return view('components.ui.select');
    }
}
