@props(['open' => false])
<div data-slot="dialog" x-data="uiOverlay(@js((bool)$open), 'dialog')" x-on:keydown.escape.window="hide()" {{ $attributes }}>{{ $slot }}</div>
