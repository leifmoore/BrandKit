@props([
    'tabs',
    'initialValue',
    'ariaLabel' => 'Report views',
])

<x-ui.tabs :default-value="$initialValue" data-pattern="report-workspace-tabs">
    <div class="max-w-full overflow-x-auto">
        <x-ui.tabs.list :aria-label="$ariaLabel" class="h-auto min-w-max justify-start gap-0">
            @foreach ($tabs as $tab)
                <x-ui.tabs.trigger
                    :value="$tab['id']"
                    :disabled="$tab['disabled'] ?? false"
                    class="shrink-0 px-2 py-1.5 text-xs text-foreground/80 data-[state=active]:text-foreground sm:px-3 sm:text-sm"
                    x-on:click="$dispatch('ui:report-workspace-tabs:change', { value: @js($tab['id']) })"
                >
                    {{ $tab['label'] }}
                    @if (isset($tab['status']))
                        <x-ui.badge :variant="$tab['status']['variant'] ?? 'secondary'" class="ml-1 px-1.5 py-0 text-[10px] text-foreground">
                            {{ $tab['status']['label'] }}
                        </x-ui.badge>
                    @endif
                </x-ui.tabs.trigger>
            @endforeach
        </x-ui.tabs.list>
    </div>

    @foreach ($tabs as $tab)
        <x-ui.tabs.content :value="$tab['id']" class="mt-2" tabindex="0">
            <section class="rounded-lg border bg-card p-6" aria-label="{{ $tab['label'] }} preview">
                <h3 class="font-semibold">{{ $tab['label'] }}</h3>
                <p class="mt-1 text-sm text-muted-foreground">{{ $tab['content'] ?? $tab['description'] ?? '' }}</p>
            </section>
        </x-ui.tabs.content>
    @endforeach
</x-ui.tabs>
