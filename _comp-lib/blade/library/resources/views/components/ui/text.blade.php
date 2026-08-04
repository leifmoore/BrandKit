@props(['size' => 'base'])
@php $sizes = ['xs' => 'text-xs', 'sm' => 'text-sm', 'base' => 'text-base', 'lg' => 'text-lg']; @endphp
<p {{ $attributes->class(['text-foreground', $sizes[$size] ?? $sizes['base']]) }}>{{ $slot }}</p>
