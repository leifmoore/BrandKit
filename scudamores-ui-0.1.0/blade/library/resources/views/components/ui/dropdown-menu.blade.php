@props(['open' => false, 'placement' => 'bottom-start'])
<div data-slot="dropdown-menu" x-data="uiFloating(@js((bool)$open), @js($placement), 'dropdown-menu')" x-on:keydown.escape.window="close()" {{ $attributes->class('contents') }}>{{ $slot }}</div>
