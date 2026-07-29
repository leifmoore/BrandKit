@props(['open' => false, 'placement' => 'bottom-start'])
<div data-slot="popover" x-data="uiFloating(@js((bool)$open), @js($placement), 'popover')" x-on:keydown.escape.window="close()" {{ $attributes->class('contents') }}>{{ $slot }}</div>
