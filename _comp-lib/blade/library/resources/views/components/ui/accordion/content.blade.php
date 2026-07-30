@props(['value'])
<div data-slot="accordion-content" x-cloak x-show="isOpen(@js($value))" x-collapse {{ $attributes->class('overflow-hidden text-sm') }}><div class="pb-4 pt-0">{{ $slot }}</div></div>
