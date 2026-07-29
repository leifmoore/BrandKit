@props(['id' => 'content'])
<span id="tooltip-{{ $id }}" role="tooltip" data-slot="tooltip-content" x-ref="panel" x-cloak x-show="open" x-transition {{ $attributes->except('id')->class('fixed z-50 w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground') }}>{{ $slot }}</span>
