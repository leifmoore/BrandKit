@props([
    'metrics',
    'label' => 'Report summary',
])

<section aria-label="{{ $label }}">
    <dl class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        @foreach ($metrics as $metric)
            <x-ui.card @class(['gap-0 p-4', 'border-destructive/50' => ($metric['tone'] ?? 'default') === 'destructive'])>
                <dt class="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                    <span>{{ $metric['label'] }}</span>
                    @switch($metric['icon'] ?? null)
                        @case('sales') <x-phosphor-currency-dollar aria-hidden="true" class="size-4 text-muted-foreground" /> @break
                        @case('bookings') <x-phosphor-users aria-hidden="true" class="size-4 text-muted-foreground" /> @break
                        @case('average') <x-phosphor-trend-up aria-hidden="true" class="size-4 text-muted-foreground" /> @break
                        @case('commission') <x-phosphor-receipt aria-hidden="true" class="size-4 text-muted-foreground" /> @break
                    @endswitch
                </dt>
                <dd class="mt-1 text-xl font-semibold tabular-nums">
                    {{ $metric['displayValue'] }}
                    @if (isset($metric['trend']))
                        @php($trendVariant = match ($metric['trend']['direction']) { 'up' => 'success', 'down' => 'destructive', default => 'secondary' })
                        <span class="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-normal text-muted-foreground">
                            <x-ui.badge :variant="$trendVariant">{{ $metric['trend']['displayValue'] }}</x-ui.badge>
                            <span>{{ $metric['trend']['label'] }}</span>
                        </span>
                    @endif
                </dd>
            </x-ui.card>
        @endforeach
    </dl>
</section>
