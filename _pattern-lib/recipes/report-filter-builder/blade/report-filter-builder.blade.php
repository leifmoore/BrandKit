@props([
    'value',
    'presets' => [],
    'filters' => [],
    'matchCount' => null,
    'stale' => false,
    'locale' => 'en-GB',
])

<x-ui.card
    x-data="{
        draft: @js($value),
        dirty: @js($stale),
        toggle(filter, option) {
            const selected = this.draft.selections[filter] || [];
            this.draft.selections[filter] = selected.includes(option)
                ? selected.filter((id) => id !== option)
                : [...selected, option];
            this.changed(filter);
        },
        changed(filter = null) {
            this.dirty = true;
            this.$dispatch('ui:report-filter-builder:change', { value: this.draft, filter });
        },
        clear() {
            @foreach ($filters as $filter)
                this.draft.selections[@js($filter['id'])] = [];
            @endforeach
            this.changed();
            this.$dispatch('ui:report-filter-builder:action', { action: 'clear', value: this.draft });
        },
        apply() {
            this.dirty = false;
            this.$dispatch('ui:report-filter-builder:action', { action: 'apply', value: this.draft });
        },
    }"
>
    <x-ui.card.content class="space-y-3 p-4">
        <div class="flex flex-wrap gap-1.5" aria-label="Quick date ranges">
            @foreach ($presets as $preset)
                <button
                    type="button"
                    class="inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    x-bind:class="draft.from === @js($preset['from']) && draft.to === @js($preset['to']) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:bg-accent'"
                    x-bind:aria-pressed="draft.from === @js($preset['from']) && draft.to === @js($preset['to'])"
                    x-on:click="draft.from = @js($preset['from']); draft.to = @js($preset['to']); changed()"
                >{{ $preset['label'] }}</button>
            @endforeach
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <fieldset class="min-w-0">
                <legend class="mb-1 text-xs font-medium">Date range</legend>
                <x-ui.popover>
                    <x-ui.popover.trigger class="inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <x-phosphor-calendar-blank aria-hidden="true" class="size-3.5 shrink-0 opacity-60" />
                        <span x-text="`${new Date(`${draft.from}T12:00:00`).toLocaleDateString(@js($locale), { day: '2-digit', month: 'short', year: 'numeric' })} – ${new Date(`${draft.to}T12:00:00`).toLocaleDateString(@js($locale), { day: '2-digit', month: 'short', year: 'numeric' })}`"></span>
                    </x-ui.popover.trigger>
                    <x-ui.popover.content class="w-auto p-0">
                        <div class="flex flex-col sm:flex-row">
                            <div>
                                <p class="px-3 pt-3 text-xs font-medium text-muted-foreground">From</p>
                                <x-ui.calendar name="report-filter-from" :value="$value['from']" :max="$value['to']" label="Choose the start date" x-effect="if (value !== draft.from) { value = draft.from; cursor = new Date(`${draft.from}T12:00:00`) } max = new Date(`${draft.to}T12:00:00`)" x-on:ui:calendar:change.stop="draft.from = $event.detail.value; changed()" />
                            </div>
                            <div class="border-t sm:border-l sm:border-t-0">
                                <p class="px-3 pt-3 text-xs font-medium text-muted-foreground">To</p>
                                <x-ui.calendar name="report-filter-to" :value="$value['to']" :min="$value['from']" label="Choose the end date" x-effect="if (value !== draft.to) { value = draft.to; cursor = new Date(`${draft.to}T12:00:00`) } min = new Date(`${draft.from}T12:00:00`)" x-on:ui:calendar:change.stop="draft.to = $event.detail.value; changed()" />
                            </div>
                        </div>
                    </x-ui.popover.content>
                </x-ui.popover>
            </fieldset>

            @foreach ($filters as $filter)
                <fieldset class="min-w-0">
                    <legend class="mb-1 flex w-full items-center gap-2 text-xs font-medium">
                        <span>{{ $filter['label'] }}</span>
                        <span class="font-normal text-muted-foreground" x-text="(draft.selections[@js($filter['id'])] || []).length > 0 ? `${draft.selections[@js($filter['id'])].length} selected` : @js($filter['emptySelectionBehavior'] === 'include-all' ? 'All included' : 'None included')"></span>
                    </legend>
                    <div class="flex flex-wrap gap-1">
                        @foreach ($filter['options'] as $option)
                            <button
                                type="button"
                                class="rounded-full border px-2 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                x-bind:class="(draft.selections[@js($filter['id'])] || []).includes(@js($option['id'])) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:border-primary/50'"
                                x-bind:aria-pressed="(draft.selections[@js($filter['id'])] || []).includes(@js($option['id']))"
                                @if (isset($option['description'])) title="{{ $option['description'] }}" @endif
                                x-on:click="toggle(@js($filter['id']), @js($option['id']))"
                            >{{ $option['label'] }}</button>
                        @endforeach
                    </div>
                </fieldset>
            @endforeach
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
                @if (is_int($matchCount))
                    <span>{{ number_format($matchCount) }} {{ $matchCount === 1 ? 'result' : 'results' }} matched</span>
                @endif
                <x-ui.button type="button" variant="link" size="sm" class="h-auto p-0 text-xs" x-show="Object.values(draft.selections).flat().length > 0" x-on:click="clear()">Clear filters</x-ui.button>
                <x-ui.badge variant="warning" x-show="dirty">Filters changed</x-ui.badge>
            </div>
            <x-ui.button type="button" size="sm" class="h-7 px-2.5 text-xs" x-on:click="apply()">
                <x-phosphor-arrows-clockwise aria-hidden="true" class="size-3.5" />
                Generate report
            </x-ui.button>
        </div>
    </x-ui.card.content>
</x-ui.card>
