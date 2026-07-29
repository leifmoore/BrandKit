@props(['pressed' => false, 'variant' => 'default', 'size' => 'default', 'name' => null, 'value' => '1'])
@php
    $sizes = ['default' => 'h-9 min-w-9 px-2', 'sm' => 'h-8 min-w-8 px-1.5', 'lg' => 'h-10 min-w-10 px-2.5'];
    $variantClass = $variant === 'outline' ? 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground' : 'bg-transparent';
@endphp
<span x-data="uiToggle(@js((bool)$pressed), 'toggle')" class="contents"><button type="button" role="button" data-slot="toggle" x-on:click="toggle()" x-bind:aria-pressed="on" x-bind:data-state="on ? 'on' : 'off'" {{ $attributes->class(['inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,box-shadow] hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4', $variantClass, $sizes[$size] ?? $sizes['default']]) }}>{{ $slot }}</button>@if($name)<input type="hidden" name="{{ $name }}" x-bind:value="on ? @js($value) : ''">@endif</span>
