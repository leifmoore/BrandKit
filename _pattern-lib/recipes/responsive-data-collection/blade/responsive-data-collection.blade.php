@props([
    'caption' => 'Records',
    'columns' => [],
    'items' => [],
    'primaryColumnId',
    'secondaryColumnId' => null,
    'actionLabel' => 'View',
    'showAction' => true,
    'emptyMessage' => 'No records found.',
])

@php
    $badgeVariants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'tint'];
    $renderCell = function ($cell) use ($badgeVariants) {
        if (!$cell) return null;
        return $cell;
    };
@endphp

@if (count($items) === 0)
    <p class="rounded-lg border bg-card px-6 py-10 text-center text-sm text-muted-foreground">{{ $emptyMessage }}</p>
@else
    <div class="hidden overflow-x-auto rounded-lg border sm:block">
        <x-ui.table>
            <caption class="sr-only">{{ $caption }}</caption>
            <x-ui.table.header>
                <x-ui.table.row>
                    @foreach ($columns as $column)
                        <x-ui.table.head @class(['text-right' => ($column['align'] ?? 'left') === 'right'])>{{ $column['label'] }}</x-ui.table.head>
                    @endforeach
                    @if ($showAction)<x-ui.table.head><span class="sr-only">Actions</span></x-ui.table.head>@endif
                </x-ui.table.row>
            </x-ui.table.header>
            <x-ui.table.body>
                @foreach ($items as $item)
                    <x-ui.table.row>
                        @foreach ($columns as $column)
                            @php
                                $cell = $renderCell($item['cells'][$column['id']] ?? null);
                            @endphp
                            <x-ui.table.cell @class(['text-right' => ($column['align'] ?? 'left') === 'right'])>
                                @if (!$cell)
                                    <span aria-hidden="true">—</span>
                                @elseif (!empty($cell['badgeVariant']) && in_array($cell['badgeVariant'], $badgeVariants, true))
                                    <x-ui.badge :variant="$cell['badgeVariant']">{{ $cell['text'] }}</x-ui.badge>
                                @else
                                    <span @class(['font-mono text-sm' => $cell['mono'] ?? false])>
                                        <span class="block">{{ $cell['text'] }}</span>
                                        @if (!empty($cell['detail']))<span class="block text-xs text-muted-foreground">{{ $cell['detail'] }}</span>@endif
                                    </span>
                                @endif
                            </x-ui.table.cell>
                        @endforeach
                        @if ($showAction)
                            <x-ui.table.cell class="text-right">
                                <x-ui.button data-contrast-action variant="outline" size="sm" style="color: var(--foreground)" aria-label="{{ $actionLabel }} {{ $item['cells'][$primaryColumnId]['text'] ?? $item['id'] }}" x-on:click="$dispatch('ui:responsive-data-collection:action', { action: 'activate', id: @js($item['id']) })">
                                    <x-phosphor-eye aria-hidden="true" />{{ $actionLabel }}
                                </x-ui.button>
                            </x-ui.table.cell>
                        @endif
                    </x-ui.table.row>
                @endforeach
            </x-ui.table.body>
        </x-ui.table>
    </div>

    <div class="space-y-3 sm:hidden" aria-label="{{ $caption }}">
        @foreach ($items as $item)
            @php
                $primary = $item['cells'][$primaryColumnId] ?? null;
                $secondary = $secondaryColumnId ? ($item['cells'][$secondaryColumnId] ?? null) : null;
                $detailColumns = collect($columns)->filter(fn ($column) => !($column['hideOnMobile'] ?? false) && $column['id'] !== $primaryColumnId && $column['id'] !== $secondaryColumnId);
            @endphp
            <article>
                <x-ui.card>
                    <x-ui.card.content class="space-y-4 p-4">
                    <header>
                        <h3 class="font-medium">{{ $primary['text'] ?? $item['id'] }}</h3>
                        @if ($secondary)<p class="mt-1 text-sm text-muted-foreground">{{ $secondary['text'] }}</p>@endif
                    </header>
                    <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        @foreach ($detailColumns as $column)
                            @php($cell = $item['cells'][$column['id']] ?? null)
                            <div @class(['text-right' => ($column['align'] ?? 'left') === 'right'])>
                                <dt class="text-xs text-muted-foreground">{{ $column['label'] }}</dt>
                                <dd class="mt-0.5">
                                    @if (!$cell)
                                        <span aria-hidden="true">—</span>
                                    @elseif (!empty($cell['badgeVariant']) && in_array($cell['badgeVariant'], $badgeVariants, true))
                                        <x-ui.badge :variant="$cell['badgeVariant']">{{ $cell['text'] }}</x-ui.badge>
                                    @else
                                        <span @class(['font-mono text-sm' => $cell['mono'] ?? false])>{{ $cell['text'] }}</span>
                                    @endif
                                </dd>
                            </div>
                        @endforeach
                    </dl>
                    @if ($showAction)
                        <x-ui.button data-contrast-action variant="outline" class="w-full" style="color: var(--foreground)" x-on:click="$dispatch('ui:responsive-data-collection:action', { action: 'activate', id: @js($item['id']) })"><x-phosphor-eye aria-hidden="true" />{{ $actionLabel }}</x-ui.button>
                    @endif
                    </x-ui.card.content>
                </x-ui.card>
            </article>
        @endforeach
    </div>
@endif
