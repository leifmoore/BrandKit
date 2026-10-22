@props([
    'title',
    'caption',
    'dimensionLabel',
    'columns',
    'groups',
    'total' => null,
    'emptyMessage' => 'No breakdown data for the selected filters',
])

<div class="space-y-4">
    @isset($visualisation)
        <section aria-label="{{ $title }} visualisation" class="rounded-lg border bg-card p-4">
            {{ $visualisation }}
        </section>
    @endisset

    <x-ui.card>
        <x-ui.card.header><x-ui.card.title class="text-sm">{{ $title }}</x-ui.card.title></x-ui.card.header>
        <x-ui.card.content>
            <x-ui.table>
                <caption class="sr-only">{{ $caption }}</caption>
                <x-ui.table.header>
                    <x-ui.table.row>
                        <x-ui.table.head>{{ $dimensionLabel }}</x-ui.table.head>
                        @foreach ($columns as $column)
                            <x-ui.table.head @class(['text-right' => ($column['align'] ?? 'left') === 'right'])>{{ $column['label'] }}</x-ui.table.head>
                        @endforeach
                    </x-ui.table.row>
                </x-ui.table.header>
                @forelse ($groups as $group)
                    <x-ui.table.body>
                        <x-ui.table.row class="bg-muted/50 font-semibold">
                            <th scope="rowgroup" class="h-10 px-2 text-left align-middle font-semibold text-foreground">{{ $group['label'] }}</th>
                            @foreach ($columns as $column)
                                <x-ui.table.cell @class(['text-right tabular-nums' => ($column['align'] ?? 'left') === 'right'])>{{ $group['values'][$column['id']]['displayValue'] ?? '' }}</x-ui.table.cell>
                            @endforeach
                        </x-ui.table.row>
                        @foreach ($group['items'] as $item)
                            <x-ui.table.row>
                                <th scope="row" class="h-10 px-2 pl-6 text-left align-middle font-normal text-foreground">{{ $item['label'] }}</th>
                                @foreach ($columns as $column)
                                    <x-ui.table.cell @class(['text-right tabular-nums' => ($column['align'] ?? 'left') === 'right'])>{{ $item['values'][$column['id']]['displayValue'] ?? '' }}</x-ui.table.cell>
                                @endforeach
                            </x-ui.table.row>
                        @endforeach
                    </x-ui.table.body>
                @empty
                    <x-ui.table.body><x-ui.table.row><x-ui.table.cell :colspan="count($columns) + 1" class="py-8 text-center text-muted-foreground">{{ $emptyMessage }}</x-ui.table.cell></x-ui.table.row></x-ui.table.body>
                @endforelse
                @if (count($groups) > 0 && $total)
                    <x-ui.table.footer>
                        <x-ui.table.row>
                            <th scope="row" class="h-10 px-2 text-left align-middle font-medium text-foreground">Total ({{ collect($groups)->sum(fn ($group) => count($group['items'])) }})</th>
                            @foreach ($columns as $column)
                                <x-ui.table.cell @class(['text-right tabular-nums' => ($column['align'] ?? 'left') === 'right'])>{{ $total[$column['id']]['displayValue'] ?? '' }}</x-ui.table.cell>
                            @endforeach
                        </x-ui.table.row>
                    </x-ui.table.footer>
                @endif
            </x-ui.table>
        </x-ui.card.content>
    </x-ui.card>
</div>
