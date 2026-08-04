@props(['variant' => 'default'])
@php $classes = ['relative grid w-full grid-cols-[0_1fr] items-start gap-x-3 gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] [&>svg]:size-4 [&>svg]:translate-y-0.5', $variant === 'destructive' ? 'bg-card text-destructive' : 'bg-card text-card-foreground']; @endphp
<div role="alert" data-slot="alert" {{ $attributes->class($classes) }}>{{ $slot }}</div>
