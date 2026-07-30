@props(['items' => []])
@php($tints = ['bg-info/10 ring-info/20', 'bg-status-success/10 ring-status-success/20', 'bg-status-warning/10 ring-status-warning/20'])

@if (count($items) > 0)
<x-ui.card>
    <x-ui.card.header>
        <x-ui.card.title>Quick launch</x-ui.card.title>
        <x-ui.card.description>Open a frequently used sales channel.</x-ui.card.description>
    </x-ui.card.header>
    <x-ui.card.content class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        @foreach ($items as $item)
            <button type="button" class="flex items-center justify-between gap-3 rounded-xl border border-transparent p-4 text-left ring-1 ring-inset transition-shadow hover:shadow-md {{ $tints[$loop->index % count($tints)] }}" x-on:click="$dispatch('quick-launch', @js($item))">
                <span class="min-w-0">
                    <span class="block truncate text-sm font-semibold text-foreground">{{ $item['name'] }}</span>
                    <span class="mt-1 block truncate text-xs text-muted-foreground">{{ $item['subtitle'] }}</span>
                </span>
                <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/60"><x-phosphor-rocket aria-hidden="true" class="size-4" /></span>
            </button>
        @endforeach
    </x-ui.card.content>
</x-ui.card>
@endif
