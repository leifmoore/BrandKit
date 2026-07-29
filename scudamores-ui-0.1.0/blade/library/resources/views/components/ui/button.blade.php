@props([
    'variant' => 'default',
    'size' => 'default',
    'href' => null,
    'type' => 'button',
    'disabled' => false,
])

@php
    $variant = match ($variant) {
        'primary', 'base' => 'default',
        'danger' => 'destructive',
        'secondary' => 'outline',
        default => $variant,
    };
    $base = "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:opacity-75 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
    $variants = [
        'default' => 'bg-primary text-primary-foreground hover:bg-primary/90',
        'destructive' => 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20',
        'outline' => 'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        'ghost' => 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        'link' => 'text-primary underline-offset-4 hover:underline',
    ];
    $sizes = [
        'default' => 'h-9 px-4 py-2 has-[>svg]:px-3',
        'sm' => 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        'lg' => 'h-10 rounded-lg px-6 has-[>svg]:px-4',
        'icon' => 'size-9 p-0',
    ];
    $classes = [$base, $variants[$variant] ?? $variants['default'], $sizes[$size] ?? $sizes['default']];
@endphp

@if ($href)
    <a href="{{ $disabled ? null : $href }}" @if($disabled) aria-disabled="true" tabindex="-1" @endif {{ $attributes->class($classes) }}>{{ $slot }}</a>
@else
    <button type="{{ $type }}" @disabled($disabled) {{ $attributes->class($classes) }}>{{ $slot }}</button>
@endif
