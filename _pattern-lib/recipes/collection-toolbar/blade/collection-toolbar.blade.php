@props([
    'search' => '',
    'filters' => [],
    'sort' => null,
    'layout' => null,
    'searchLabel' => 'Search collection',
    'searchPlaceholder' => 'Search…',
    'resultCount' => null,
    'resultLabel' => 'results',
    'showReset' => true,
])

<div
    class="rounded-lg border bg-card p-3 text-card-foreground"
    role="search"
    aria-label="Collection controls"
    x-data='{ search: @json($search), layout: @json($layout) }'
>
    <div class="flex flex-wrap items-center gap-2">
        <div class="relative min-w-52 flex-1">
            <x-phosphor-magnifying-glass aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <x-ui.input
                name="collection_search"
                type="search"
                x-model="search"
                x-on:input.debounce.200ms="$dispatch('ui:collection-toolbar:change', { field: 'search', value: search })"
                :placeholder="$searchPlaceholder"
                :aria-label="$searchLabel"
                class="pl-9"
            />
        </div>

        @foreach ($filters as $filter)
            <x-ui.select
                :name="'collection_filter_'.$filter['id']"
                :value="$filter['value']"
                :options="collect($filter['options'])->pluck('label', 'value')->all()"
                :aria-label="$filter['label']"
                class="w-full sm:w-40"
                x-on:change="$dispatch('ui:collection-toolbar:change', { field: @js($filter['id']), value: $event.target.value })"
            />
        @endforeach

        @if ($sort)
            <x-ui.select
                name="collection_sort"
                :value="$sort['value']"
                :options="collect($sort['options'])->pluck('label', 'value')->all()"
                aria-label="Sort by"
                class="w-full sm:w-36"
                x-on:change="$dispatch('ui:collection-toolbar:change', { field: 'sort', value: $event.target.value, direction: @js($sort['direction']) })"
            />
            <x-ui.button
                variant="outline"
                size="icon"
                aria-label="Sort {{ $sort['direction'] === 'asc' ? 'descending' : 'ascending' }}"
                x-on:click="$dispatch('ui:collection-toolbar:change', { field: 'sort-direction', value: @js($sort['direction'] === 'asc' ? 'desc' : 'asc') })"
            >
                @if ($sort['direction'] === 'asc')<x-phosphor-arrow-up aria-hidden="true" />@else<x-phosphor-arrow-down aria-hidden="true" />@endif
            </x-ui.button>
        @endif

        @if ($layout)
            <div class="flex items-center rounded-md border p-0.5" aria-label="Collection layout">
                <x-ui.button variant="ghost" size="icon" aria-label="List view" x-bind:aria-pressed="layout === 'list'" x-bind:class="layout === 'list' && 'bg-secondary text-secondary-foreground'" x-on:click="layout = 'list'; $dispatch('ui:collection-toolbar:change', { field: 'layout', value: layout })"><x-phosphor-list aria-hidden="true" /></x-ui.button>
                <x-ui.button variant="ghost" size="icon" aria-label="Grid view" x-bind:aria-pressed="layout === 'grid'" x-bind:class="layout === 'grid' && 'bg-secondary text-secondary-foreground'" x-on:click="layout = 'grid'; $dispatch('ui:collection-toolbar:change', { field: 'layout', value: layout })"><x-phosphor-squares-four aria-hidden="true" /></x-ui.button>
            </div>
        @endif

        @if ($showReset)
            <x-ui.button variant="ghost" size="sm" x-on:click="search = ''; $dispatch('ui:collection-toolbar:action', { action: 'reset' })">
                <x-phosphor-arrow-counter-clockwise aria-hidden="true" />Reset
            </x-ui.button>
        @endif

        {{ $actions ?? '' }}
    </div>

    @if (is_int($resultCount))
        <p class="mt-2 text-xs text-muted-foreground" aria-live="polite">{{ number_format($resultCount) }} {{ $resultLabel }}</p>
    @endif
</div>
