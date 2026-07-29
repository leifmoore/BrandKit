@props(['value'])
<section role="tabpanel" data-slot="tabs-content" x-cloak x-show="active === @js($value)" {{ $attributes->class('flex-1 outline-none') }}>{{ $slot }}</section>
