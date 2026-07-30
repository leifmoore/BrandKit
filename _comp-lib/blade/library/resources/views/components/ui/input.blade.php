@props(['size' => 'default'])
@php
    $classes = [
        'flex w-full min-w-0 rounded-lg border border-input bg-input-background px-3 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 md:text-sm',
        match($size) { 'sm' => 'h-8 py-1', 'xs' => 'h-6 py-0.5 text-xs', default => 'h-9 py-1' },
    ];
@endphp
@if($label)<x-ui.field><x-ui.label :for="$id" :value="$label" />@endif
<input value="{{ is_scalar($value) ? $value : '' }}" {{ $formControlAttributes }} {{ $attributes->class($classes) }}>
@if($label)<x-ui.error :for="$name" :bag="$bag" /></x-ui.field>@endif
