<?php

namespace App\View\Components\Ui;

use Illuminate\Contracts\View\View;

class Textarea extends FormControl
{
    public function render(): View
    {
        return view('components.ui.textarea');
    }
}
