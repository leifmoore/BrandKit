@props(['ratio' => '16 / 9'])
<div data-slot="aspect-ratio" style="aspect-ratio: {{ $ratio }}" {{ $attributes->class('relative w-full overflow-hidden') }}>{{ $slot }}</div>
