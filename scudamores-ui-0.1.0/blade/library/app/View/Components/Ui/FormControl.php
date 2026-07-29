<?php

namespace App\View\Components\Ui;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ViewErrorBag;
use Illuminate\View\Component;
use Illuminate\View\ComponentAttributeBag;

abstract class FormControl extends Component
{
    public string $id;
    public mixed $value;
    public string $label;
    public string $bag;
    public ComponentAttributeBag $formControlAttributes;

    public function __construct(
        public string $name,
        ?string $id = null,
        mixed $value = '',
        string $label = '',
        string $bag = 'default',
    ) {
        $path = self::sessionPath($name);
        $this->value = old($path, $value);
        $this->label = $label;
        $this->bag = $bag;
        $this->id = $id ?: str_replace(['[', ']', '.'], ['-', '', '-'], $name);
        $this->formControlAttributes = $this->newAttributeBag([
            'name' => $name,
            'id' => $this->id,
        ])->when($this->errorBag($bag)->has($path), function (ComponentAttributeBag $attributes) use ($name): void {
            $attributes->offsetSet('aria-invalid', 'true');
            $attributes->offsetSet('aria-describedby', $this->errorId($name));
        });
    }

    public function errorBag(string $name = 'default')
    {
        $bags = View::shared('errors', fn () => Session::get('errors', new ViewErrorBag));

        return $bags->getBag($name);
    }

    public function errorId(?string $name = null): string
    {
        return str_replace(['[', ']', '.'], ['-', '', '-'], $name ?: $this->name).'-error';
    }

    public static function sessionPath(string $name): string
    {
        return trim(str_replace(['[', ']'], ['.', ''], $name), '.');
    }
}
