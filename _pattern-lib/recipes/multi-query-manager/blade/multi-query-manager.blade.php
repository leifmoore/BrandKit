@props([
    'queries' => [],
    'selectedQueryId' => null,
    'maxQueries' => 5,
])

<div
    {{ $attributes->class('flex items-center gap-2 overflow-x-auto pb-2') }}
    aria-label="Manage booking queries"
    x-data="{
        queries: @js(array_values($queries)),
        selectedQueryId: @js($selectedQueryId),
        select(id) {
            this.selectedQueryId = id;
            this.$dispatch('ui:multi-query-manager:change', { selectedQueryId: id });
        },
        remove(id) {
            this.queries = this.queries.filter((query) => query.id !== id);
            if (this.selectedQueryId === id) this.selectedQueryId = this.queries[0]?.id ?? null;
            this.$dispatch('ui:multi-query-manager:action', { action: 'delete', queryId: id, selectedQueryId: this.selectedQueryId });
        },
        move(event, index) {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || this.queries.length === 0) return;
            event.preventDefault();
            const nextIndex = event.key === 'Home' ? 0 : (event.key === 'End' ? this.queries.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + this.queries.length) % this.queries.length);
            this.select(this.queries[nextIndex].id);
            this.$nextTick(() => this.$root.querySelectorAll('[data-query-select]')[nextIndex]?.focus());
        }
    }"
>
    <div role="toolbar" aria-label="Booking queries" class="flex shrink-0 items-center gap-2">
        <template x-for="(query, index) in queries" x-bind:key="query.id">
            <div
                class="flex min-h-10 shrink-0 items-center rounded-full px-1 pl-3 text-sm font-medium transition-colors"
                x-bind:class="query.id === selectedQueryId ? 'bg-epos-accent text-epos-accent-foreground' : 'bg-muted text-foreground hover:bg-accent dark:text-white'"
            >
                <button
                    type="button"
                    data-query-select
                    class="rounded-full py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    x-bind:aria-pressed="query.id === selectedQueryId"
                    x-bind:tabindex="query.id === selectedQueryId || (!selectedQueryId && index === 0) ? 0 : -1"
                    x-on:click="select(query.id)"
                    x-on:keydown="move($event, index)"
                    x-text="`${query.partyLabel} · ${query.dateLabel}`"
                ></button>
                <button
                    type="button"
                    class="ml-1 rounded-full p-1.5 transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    x-on:click="remove(query.id)"
                    x-bind:aria-label="`Delete ${query.partyLabel} on ${query.dateLabel}`"
                >
                    <x-phosphor-x aria-hidden="true" class="size-3" />
                </button>
            </div>
        </template>
    </div>

    <x-ui.button
        type="button"
        variant="outline"
        size="icon"
        class="size-8 shrink-0 rounded-full"
        x-show="queries.length < {{ (int) $maxQueries }}"
        x-on:click="$dispatch('ui:multi-query-manager:action', { action: 'add' })"
        aria-label="Add another query"
    >
        <x-phosphor-plus aria-hidden="true" class="size-4" />
    </x-ui.button>

    <x-ui.alert-dialog>
        <x-ui.alert-dialog.trigger x-show="queries.length > 0" class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
            <x-phosphor-trash aria-hidden="true" class="size-3.5" />
            Clear
        </x-ui.alert-dialog.trigger>
        <x-ui.alert-dialog.content>
            <x-ui.alert-dialog.header>
                <x-ui.alert-dialog.title>Clear all queries?</x-ui.alert-dialog.title>
                <x-ui.alert-dialog.description>The host decides where the journey returns after the draft queries are removed.</x-ui.alert-dialog.description>
            </x-ui.alert-dialog.header>
            <x-ui.alert-dialog.footer>
                <x-ui.alert-dialog.cancel>Cancel</x-ui.alert-dialog.cancel>
                <x-ui.alert-dialog.action x-on:click="queries = []; selectedQueryId = null; $dispatch('ui:multi-query-manager:action', { action: 'clear' }); hide()">Clear all</x-ui.alert-dialog.action>
            </x-ui.alert-dialog.footer>
        </x-ui.alert-dialog.content>
    </x-ui.alert-dialog>
</div>
