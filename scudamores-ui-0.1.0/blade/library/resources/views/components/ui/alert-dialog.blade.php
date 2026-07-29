@props(['open' => false])
<div data-slot="alert-dialog" x-data="uiOverlay(@js((bool)$open), 'alert-dialog')" x-on:keydown.escape.window="hide()" {{ $attributes }}>{{ $slot }}</div>
