@props([
    'title',
    'caption',
    'columns',
    'views',
    'initialGroupBy' => 'none',
    'groupOptions' => [],
    'grandTotal' => null,
    'emptyMessage' => 'No results in the selected range',
])

<x-ui.card x-data="{
    groupBy: @js($initialGroupBy),
    views: @js($views),
    groups() { return this.views[this.groupBy] || []; },
    count() { return this.groups().reduce((total, group) => total + group.rows.length, 0); },
    changed() { this.$dispatch('ui:grouped-results-table:change', { groupBy: this.groupBy }); },
}">
    <x-ui.card.header class="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
        <x-ui.card.title class="text-sm">{{ $title }}</x-ui.card.title>
        <div class="flex items-center gap-2">
            <x-ui.label for="report-group-by" class="text-xs text-muted-foreground">Group by</x-ui.label>
            <select id="report-group-by" x-model="groupBy" x-on:change="changed()" class="h-7 w-40 rounded-lg border border-input bg-input-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring">
                @foreach ($groupOptions as $option)
                    <option value="{{ $option['id'] }}">{{ $option['label'] }}</option>
                @endforeach
            </select>
        </div>
    </x-ui.card.header>
    <x-ui.card.content>
        <div class="relative w-full overflow-x-auto">
            <table class="w-full caption-bottom text-sm">
                <caption class="sr-only">{{ $caption }}</caption>
                <thead class="[&_tr]:border-b">
                    <tr class="border-b transition-colors">
                        @foreach ($columns as $column)
                            <th scope="col" @class(['h-10 px-2 text-left align-middle font-medium text-muted-foreground', 'text-right' => ($column['align'] ?? 'left') === 'right'])>{{ $column['label'] }}</th>
                        @endforeach
                    </tr>
                </thead>
                <template x-for="group in groups()" :key="group.id">
                    <tbody class="[&_tr:last-child]:border-0">
                        <tr x-show="group.label" class="border-b bg-muted/50">
                            <th scope="rowgroup" colspan="{{ count($columns) }}" class="h-10 px-2 py-1.5 text-left align-middle font-semibold text-foreground">
                                <span x-text="group.label"></span>
                                <span class="font-normal text-muted-foreground" x-text="`(${group.rows.length})`"></span>
                            </th>
                        </tr>
                        <template x-for="row in group.rows" :key="row.id">
                            <tr class="border-b transition-colors hover:bg-muted/50">
                                @foreach ($columns as $index => $column)
                                    @if ($index === 0)
                                        <th scope="row" class="h-10 p-2 text-left align-middle font-medium text-foreground" x-text="row.cells[@js($column['id'])]?.displayValue || ''"></th>
                                    @else
                                        <td @class(['p-2 align-middle', 'text-right' => ($column['align'] ?? 'left') === 'right'])>
                                            <template x-if="row.cells[@js($column['id'])]?.tone === 'badge'">
                                                <span class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium" x-text="row.cells[@js($column['id'])]?.displayValue"></span>
                                            </template>
                                            <template x-if="row.cells[@js($column['id'])]?.tone !== 'badge'">
                                                <span
                                                    x-bind:class="row.cells[@js($column['id'])]?.tone === 'destructive' ? 'text-destructive' : (row.cells[@js($column['id'])]?.tone === 'muted' ? 'text-muted-foreground' : '')"
                                                    x-text="row.cells[@js($column['id'])]?.displayValue || ''"
                                                ></span>
                                            </template>
                                        </td>
                                    @endif
                                @endforeach
                            </tr>
                        </template>
                        <tr x-show="group.label && group.subtotal" class="border-b bg-muted/30 font-semibold">
                            @foreach ($columns as $index => $column)
                                @if ($index === 0)
                                    <th scope="row" class="h-10 p-2 text-left align-middle font-semibold text-foreground" x-text="`Subtotal (${group.rows.length})`"></th>
                                @else
                                    <td @class(['p-2 align-middle', 'text-right' => ($column['align'] ?? 'left') === 'right'])>
                                        <span x-text="group.subtotal?.[@js($column['id'])]?.displayValue || ''"></span>
                                    </td>
                                @endif
                            @endforeach
                        </tr>
                    </tbody>
                </template>
                <tbody x-show="count() === 0">
                    <tr><td colspan="{{ count($columns) }}" class="p-2 py-8 text-center text-muted-foreground">{{ $emptyMessage }}</td></tr>
                </tbody>
                @if ($grandTotal)
                    <tfoot x-show="count() > 0" class="border-t bg-muted/50 font-medium">
                        <tr>
                            @foreach ($columns as $index => $column)
                                @if ($index === 0)
                                    <th scope="row" class="h-10 p-2 text-left align-middle font-semibold text-foreground" x-text="`Grand total (${count()})`"></th>
                                @else
                                    <td @class(['p-2 align-middle', 'text-right' => ($column['align'] ?? 'left') === 'right'])>
                                        {{ $grandTotal[$column['id']]['displayValue'] ?? '' }}
                                    </td>
                                @endif
                            @endforeach
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-ui.card.content>
</x-ui.card>
