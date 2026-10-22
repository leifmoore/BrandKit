@props([
    'items' => [],
    'activeId' => '',
    'overflowItems' => [],
    'moreLabel' => 'More',
    'ariaLabel' => 'Primary navigation',
    'actionDockActive' => false,
    'hideForFinePointer' => true,
])

@unless ($actionDockActive)
<x-ui.sheet>
    <nav aria-label="{{ $ariaLabel }}" @class([
        'fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar text-sidebar-foreground',
        '[@media(pointer:fine)]:hidden' => $hideForFinePointer,
    ])>
        <div class="mx-auto flex max-w-lg items-stretch px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
            @foreach ($items as $item)
                @php($current = $item['id'] === $activeId)
                <x-ui.button
                    variant="ghost"
                    class="h-auto min-h-12 min-w-0 flex-1 flex-col gap-1 px-1 py-2"
                    :aria-current="$current ? 'page' : null"
                    :disabled="$item['disabled'] ?? false"
                    x-on:click="$dispatch('ui:mobile-bottom-navigation:change', { id: @js($item['id']) })"
                >
                    <span @class(['relative', 'text-primary' => $current, 'text-muted-foreground' => !$current])>
                        @if (!empty($item['icon']))
                            <x-dynamic-component :component="'phosphor-'.$item['icon']" aria-hidden="true" class="size-5" />
                        @endif
                        @if (!empty($item['badge']))
                            <x-ui.badge class="absolute -right-3 -top-3 min-w-5 px-1 py-0 text-[10px]" aria-label="{{ $item['badge'] }} notifications">{{ $item['badge'] }}</x-ui.badge>
                        @endif
                    </span>
                    <span class="max-w-full truncate text-xs">{{ $item['label'] }}</span>
                </x-ui.button>
            @endforeach

            @if (count($overflowItems) > 0)
                @php($overflowActive = collect($overflowItems)->contains(fn ($item) => $item['id'] === $activeId))
                <x-ui.sheet.trigger
                    class="inline-flex h-auto min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    :aria-current="$overflowActive ? 'page' : null"
                >
                    <x-phosphor-dots-three aria-hidden="true" @class(['size-5', 'text-primary' => $overflowActive, 'text-muted-foreground' => !$overflowActive]) />
                    <span class="max-w-full truncate text-xs">{{ $moreLabel }}</span>
                </x-ui.sheet.trigger>
            @endif
        </div>
    </nav>

    @if (count($overflowItems) > 0)
        <x-ui.sheet.content side="bottom" class="rounded-t-xl pb-[env(safe-area-inset-bottom)]">
            <x-ui.sheet.header>
                <x-ui.sheet.title>{{ $moreLabel }}</x-ui.sheet.title>
                <x-ui.sheet.description>Additional destinations</x-ui.sheet.description>
            </x-ui.sheet.header>
            <div class="grid gap-1 px-4 pb-4">
                @foreach ($overflowItems as $item)
                    @php($current = $item['id'] === $activeId)
                    <x-ui.button
                        :variant="$current ? 'secondary' : 'ghost'"
                        class="justify-start"
                        :aria-current="$current ? 'page' : null"
                        :disabled="$item['disabled'] ?? false"
                        x-on:click="$dispatch('ui:mobile-bottom-navigation:change', { id: @js($item['id']) }); hide()"
                    >
                        @if (!empty($item['icon']))
                            <x-dynamic-component :component="'phosphor-'.$item['icon']" aria-hidden="true" class="size-4" />
                        @endif
                        {{ $item['label'] }}
                    </x-ui.button>
                @endforeach
            </div>
        </x-ui.sheet.content>
    @endif
</x-ui.sheet>
@endunless
