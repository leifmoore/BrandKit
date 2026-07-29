@props(['variant' => 'default', 'duration' => 5000, 'title' => null])
@php $classes = $variant === 'destructive' ? 'border-destructive/40 text-destructive' : 'text-foreground'; @endphp
<article role="status" x-data="{ show: true }" x-init="if (@js((int)$duration) > 0) setTimeout(() => { show = false; $dispatch('ui:toast:change', { value: false }) }, @js((int)$duration))" x-cloak x-show="show" x-transition data-slot="toast" {{ $attributes->class(['pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg', $classes]) }}>
    <div class="min-w-0 flex-1">@if($title)<p class="font-medium">{{ $title }}</p>@endif<div class="text-muted-foreground">{{ $slot }}</div></div>
    <button type="button" x-on:click="show = false; $dispatch('ui:toast:change', { value: false })" class="shrink-0 rounded-md opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"><x-phosphor-x aria-hidden="true" class="size-4" /><span class="sr-only">Dismiss</span></button>
</article>
