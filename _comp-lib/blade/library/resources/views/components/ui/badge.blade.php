@props(['variant' => 'default', 'dot' => false, 'href' => null])
@php
    $variants = [
        'default' => 'border-transparent bg-primary text-primary-foreground',
        'secondary' => 'border-transparent bg-secondary text-secondary-foreground',
        'destructive' => 'border-transparent bg-status-danger/15 text-status-danger-foreground',
        'outline' => 'text-foreground',
        'success' => 'border-transparent bg-status-success/15 text-status-success-foreground',
        'warning' => 'border-transparent bg-status-warning/15 text-status-warning-foreground',
        'tint' => 'border-transparent ring-1 ring-inset',
    ];
    $dots = [
        'default' => 'bg-primary-foreground', 'secondary' => 'bg-secondary-foreground',
        'destructive' => 'bg-status-danger', 'outline' => 'bg-foreground',
        'success' => 'bg-status-success', 'warning' => 'bg-status-warning', 'tint' => 'bg-current',
    ];
    $classes = ['inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2 py-1 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50', $variants[$variant] ?? $variants['default']];
@endphp
@if($href)<a href="{{ $href }}" {{ $attributes->class($classes) }}>@else<span {{ $attributes->class($classes) }}>@endif
    @if($dot)<span aria-hidden="true" class="size-2 shrink-0 rounded-full {{ $dots[$variant] ?? $dots['default'] }}"></span>@endif
    {{ $slot }}
@if($href)</a>@else</span>@endif
