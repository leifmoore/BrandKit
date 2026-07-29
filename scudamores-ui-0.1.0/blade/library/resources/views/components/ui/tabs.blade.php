@props(['defaultValue'])
<div data-slot="tabs" x-data="uiTabs(@js($defaultValue))" {{ $attributes->class('flex flex-col gap-2') }}>{{ $slot }}</div>
