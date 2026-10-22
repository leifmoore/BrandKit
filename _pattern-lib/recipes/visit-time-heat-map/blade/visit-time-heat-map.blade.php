@props([
    'days',
    'hours',
    'datasets',
    'initialAxis' => 'visit',
    'initialValueMode' => 'bookings',
    'currency' => 'GBP',
    'locale' => 'en-GB',
])

<x-ui.card x-data="{
    axis: @js($initialAxis),
    valueMode: @js($initialValueMode),
    days: @js($days),
    hours: @js($hours),
    datasets: @js($datasets),
    dataset() { return this.datasets.find((item) => item.axis === this.axis && item.valueMode === this.valueMode); },
    values() { return this.dataset()?.values || this.days.map(() => this.hours.map(() => 0)); },
    max() { return Math.max(1, ...this.values().flat()); },
    format(value) {
        if (this.valueMode === 'bookings') return String(value);
        return new Intl.NumberFormat(@js($locale), { style: 'currency', currency: @js($currency), maximumFractionDigits: 0 }).format(value / 100);
    },
    intensity(value) { return value === 0 ? 0.05 : 0.1 + (0.9 * value / this.max()); },
    peak() {
        let peak = { day: this.days[0] || '', hour: this.hours[0] || '', value: 0 };
        this.values().forEach((row, dayIndex) => row.forEach((value, hourIndex) => {
            if (value > peak.value) peak = { day: this.days[dayIndex], hour: this.hours[hourIndex], value };
        }));
        return peak;
    },
    changed() { this.$dispatch('ui:visit-time-heat-map:change', { axis: this.axis, valueMode: this.valueMode }); },
}">
    <x-ui.card.header>
        <div class="flex flex-wrap items-center justify-between gap-2">
            <x-ui.card.title class="text-sm" x-text="`${axis === 'visit' ? 'Visit' : 'Transaction'} time distribution`"></x-ui.card.title>
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex gap-1" aria-label="Date axis">
                    @foreach (['visit' => 'Visit date', 'transaction' => 'Transaction date'] as $axisValue => $axisLabel)
                        <button type="button" class="inline-flex h-7 items-center rounded-lg border px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" x-bind:class="axis === @js($axisValue) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background'" x-bind:aria-pressed="axis === @js($axisValue)" x-on:click="axis = @js($axisValue); changed()">{{ $axisLabel }}</button>
                    @endforeach
                </div>
                <span aria-hidden="true" class="h-6 w-px bg-border"></span>
                <div class="flex gap-1" aria-label="Value shown">
                    @foreach (['bookings' => 'Bookings', 'revenue' => 'Revenue'] as $modeValue => $modeLabel)
                        <button type="button" class="inline-flex h-7 items-center rounded-lg border px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" x-bind:class="valueMode === @js($modeValue) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background'" x-bind:aria-pressed="valueMode === @js($modeValue)" x-on:click="valueMode = @js($modeValue); changed()">{{ $modeLabel }}</button>
                    @endforeach
                </div>
            </div>
        </div>
    </x-ui.card.header>
    <x-ui.card.content class="space-y-4">
        <p id="visit-time-heat-map-summary" class="text-xs text-muted-foreground" aria-live="polite">
            Peak: <span x-text="peak().day"></span> at <span x-text="peak().hour"></span>, <span x-text="format(peak().value)"></span> <span x-text="valueMode"></span>.
        </p>

        <div class="overflow-x-auto">
            <div class="min-w-[640px]" role="img" x-bind:aria-label="`${axis === 'visit' ? 'Visit' : 'Transaction'} time distribution`" aria-describedby="visit-time-heat-map-summary">
                <div class="grid" x-bind:style="`grid-template-columns: 2.75rem repeat(${hours.length}, minmax(2rem, 1fr))`" aria-hidden="true">
                    <span></span>
                    <template x-for="hour in hours" :key="hour"><span class="pb-1 text-center text-[10px] text-muted-foreground" x-text="hour"></span></template>
                    <template x-for="(day, dayIndex) in days" :key="day">
                        <div class="contents">
                            <span class="self-center pr-1 text-right text-xs text-muted-foreground" x-text="day"></span>
                            <template x-for="(hour, hourIndex) in hours" :key="`${day}-${hour}`">
                                <span
                                    class="flex aspect-square items-center justify-center border border-background text-[10px] font-medium tabular-nums"
                                    x-bind:class="intensity(values()[dayIndex]?.[hourIndex] || 0) >= 0.94 ? 'text-white' : 'text-black dark:text-white'"
                                    x-bind:style="`background-color: rgba(37, 99, 235, ${intensity(values()[dayIndex]?.[hourIndex] || 0)})`"
                                    x-text="format(values()[dayIndex]?.[hourIndex] || 0)"
                                ></span>
                            </template>
                        </div>
                    </template>
                </div>
                <div class="mt-3 flex items-center justify-center gap-3" aria-hidden="true">
                    <span class="text-xs text-muted-foreground">0</span>
                    <span class="h-3 w-40 rounded-md bg-gradient-to-r from-blue-600/5 to-blue-600"></span>
                    <span class="text-xs text-muted-foreground" x-text="format(max())"></span>
                </div>
            </div>
        </div>

        <details class="rounded-lg border px-3 py-2">
            <summary class="cursor-pointer text-sm font-medium">View values as a table</summary>
            <div class="relative mt-3 w-full overflow-x-auto">
                <table class="w-full caption-bottom text-sm">
                    <caption class="sr-only" x-text="`${axis === 'visit' ? 'Visit' : 'Transaction'} time distribution: ${valueMode} by day and hour`"></caption>
                    <thead><tr class="border-b"><th scope="col" class="h-10 px-2 text-left font-medium text-muted-foreground">Day</th>@foreach ($hours as $hour)<th scope="col" class="h-10 px-2 text-right font-medium text-muted-foreground">{{ $hour }}</th>@endforeach</tr></thead>
                    <template x-for="(day, dayIndex) in days" :key="day">
                        <tbody><tr class="border-b"><th scope="row" class="p-2 text-left font-medium" x-text="day"></th><template x-for="(hour, hourIndex) in hours" :key="hour"><td class="p-2 text-right tabular-nums" x-text="format(values()[dayIndex]?.[hourIndex] || 0)"></td></template></tr></tbody>
                    </template>
                </table>
            </div>
        </details>
    </x-ui.card.content>
</x-ui.card>
