@props(['open' => false])
<div data-slot="sheet" x-data="uiOverlay(@js((bool)$open), 'sheet')" x-on:keydown.escape.window="hide()" {{ $attributes }}>{{ $slot }}</div>
