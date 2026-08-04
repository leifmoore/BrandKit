@props(['orientation' => 'vertical'])
<div data-slot="scroll-area" tabindex="0" data-orientation="{{ $orientation }}" {{ $attributes->class('relative overflow-auto rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50') }}>{{ $slot }}</div>
