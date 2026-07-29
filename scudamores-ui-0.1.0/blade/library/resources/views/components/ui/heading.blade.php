@props(['level' => 2, 'size' => 'lg'])
@php $tag = 'h'.max(1, min(6, (int)$level)); $sizes = ['xs' => 'text-sm', 'sm' => 'text-base', 'base' => 'text-lg', 'lg' => 'text-xl', 'xl' => 'text-2xl', '2xl' => 'text-3xl']; @endphp
<{{ $tag }} {{ $attributes->class(['font-medium tracking-tight text-foreground', $sizes[$size] ?? $sizes['lg']]) }}>{{ $slot }}</{{ $tag }}>
