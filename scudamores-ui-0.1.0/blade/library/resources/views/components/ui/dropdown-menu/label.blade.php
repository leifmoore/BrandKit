@props(['inset' => false])
<div data-slot="dropdown-menu-label" {{ $attributes->class(['px-2 py-1.5 text-sm font-medium', $inset ? 'pl-8' : '']) }}>{{ $slot }}</div>
