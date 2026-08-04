@props([
    'state',
    'title' => null,
    'description' => null,
    'actionLabel' => null,
])

@php
    $defaults = [
        'empty' => ['title' => 'Nothing here yet', 'description' => 'Records will appear here when they are available.'],
        'error' => ['title' => 'We could not load this collection', 'description' => 'Try again or contact support if the problem continues.'],
        'restricted' => ['title' => 'Access restricted', 'description' => 'Your account does not have access to this information.'],
    ];
    $copy = $defaults[$state] ?? $defaults['empty'];
@endphp

@if ($state === 'loading')
    <x-ui.card aria-busy="true" :aria-label="$title ?? 'Loading collection'">
        <x-ui.card.content class="space-y-3 p-6" role="status">
            <span class="sr-only">{{ $description ?? 'Loading…' }}</span>
            <x-ui.skeleton class="h-5 w-40" />
            <x-ui.skeleton class="h-4 w-full" />
            <x-ui.skeleton class="h-4 w-4/5" />
            <div class="grid gap-3 pt-3 sm:grid-cols-3"><x-ui.skeleton class="h-20" /><x-ui.skeleton class="h-20" /><x-ui.skeleton class="h-20" /></div>
        </x-ui.card.content>
    </x-ui.card>
@else
    <x-ui.card>
        <x-ui.card.content class="flex flex-col items-center px-6 py-10 text-center" :role="$state === 'error' ? 'alert' : 'status'">
            <span class="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                @if ($state === 'restricted')
                    <x-phosphor-lock-key aria-hidden="true" class="size-5" />
                @elseif ($state === 'error')
                    <x-phosphor-warning-circle aria-hidden="true" class="size-5" />
                @else
                    <x-phosphor-tray aria-hidden="true" class="size-5" />
                @endif
            </span>
            <h3 class="font-semibold">{{ $title ?? $copy['title'] }}</h3>
            <p class="mt-1 max-w-md text-sm text-muted-foreground">{{ $description ?? $copy['description'] }}</p>
            @if ($actionLabel)
                <x-ui.button :variant="$state === 'error' ? 'default' : 'outline'" class="mt-5" x-on:click="$dispatch('ui:collection-state-panel:action', { action: @js($state === 'error' ? 'retry' : 'primary') })">
                    @if ($state === 'error')<x-phosphor-arrow-counter-clockwise aria-hidden="true" />@endif
                    {{ $actionLabel }}
                </x-ui.button>
            @endif
        </x-ui.card.content>
    </x-ui.card>
@endif
