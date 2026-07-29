@props(['value'])
<section data-slot="accordion-item" data-value="{{ $value }}" {{ $attributes->class('border-b last:border-b-0') }}>{{ $slot }}</section>
