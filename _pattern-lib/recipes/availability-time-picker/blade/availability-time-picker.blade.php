@props([
    'locations' => [],
    'selectedLocationId',
    'pricingModes' => [],
    'selectedPricingModeId' => null,
    'timeBands' => [],
    'selectedTimeId' => null,
    'defaultExpandedBandId' => null,
    'locale' => 'en-GB',
])

<section
    {{ $attributes->class('space-y-4') }}
    aria-labelledby="availability-heading"
    x-data="{
        locations: @js($locations),
        selectedLocationId: @js($selectedLocationId),
        pricingModes: @js($pricingModes),
        selectedPricingModeId: @js($selectedPricingModeId),
        bands: @js($timeBands),
        selectedTimeId: @js($selectedTimeId),
        expandedBandId: @js($defaultExpandedBandId),
        locale: @js($locale),
        get expandedBand() { return this.bands.find((band) => band.id === this.expandedBandId) ?? null },
        money(minor, currency) { return new Intl.NumberFormat(this.locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(minor) / 100) },
        selectLocation(id) { this.selectedLocationId = id; this.$dispatch('ui:availability-time-picker:change', { field: 'location', locationId: id }); },
        selectMode(id) { this.selectedPricingModeId = id; this.$dispatch('ui:availability-time-picker:change', { field: 'pricingMode', pricingModeId: id }); },
        toggleBand(id) { this.expandedBandId = this.expandedBandId === id ? null : id },
        selectTime(id, bandId) { this.selectedTimeId = this.selectedTimeId === id ? null : id; this.$dispatch('ui:availability-time-picker:change', { field: 'time', timeId: this.selectedTimeId, bandId }); }
    }"
>
    <div class="space-y-1.5">
        <p class="text-sm font-medium">Location</p>
        <div class="flex flex-wrap gap-1.5" aria-label="Location">
            @foreach ($locations as $location)
                <button
                    type="button"
                    class="rounded-full border px-3 py-1 text-xs transition-colors"
                    x-on:click="selectLocation(@js((string) $location['id']))"
                    x-bind:aria-pressed="selectedLocationId === @js((string) $location['id'])"
                    x-bind:class="selectedLocationId === @js((string) $location['id']) ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background text-muted-foreground hover:border-foreground hover:text-foreground'"
                >{{ $location['label'] }}</button>
            @endforeach
        </div>
    </div>

    <div>
        <h2 id="availability-heading" class="mb-3 text-sm font-medium">Select available time</h2>

        @if (count($pricingModes) > 0)
            <div class="mb-3 grid rounded-lg bg-muted p-1" style="grid-template-columns: repeat({{ count($pricingModes) }}, minmax(0, 1fr));" role="group" aria-label="Pricing display">
                @foreach ($pricingModes as $mode)
                    <button
                        type="button"
                        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                        x-on:click="selectMode(@js((string) $mode['id']))"
                        x-bind:aria-pressed="selectedPricingModeId === @js((string) $mode['id'])"
                        x-bind:class="selectedPricingModeId === @js((string) $mode['id']) ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                    >{{ $mode['label'] }}</button>
                @endforeach
            </div>
        @endif

        <div class="grid grid-cols-3 gap-1.5">
            @foreach ($timeBands as $band)
                <x-ui.card
                    @class(['opacity-40' => !($band['available'] ?? true)])
                    x-bind:class="bands.find((item) => item.id === @js((string) $band['id']))?.times.some((time) => time.id === selectedTimeId) ? 'border-primary ring-1 ring-primary' : ''"
                >
                    <button
                        type="button"
                        class="flex w-full flex-col items-center gap-0.5 p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        @disabled(!($band['available'] ?? true))
                        x-on:click="toggleBand(@js((string) $band['id']))"
                        x-bind:aria-expanded="expandedBandId === @js((string) $band['id'])"
                        aria-controls="availability-times"
                    >
                        <span class="flex items-center gap-1 text-xs font-medium md:text-sm">
                            {{ $band['label'] }}
                            <x-phosphor-caret-down aria-hidden="true" class="size-3 transition-transform" x-bind:class="{ 'rotate-180': expandedBandId === @js((string) $band['id']) }" />
                        </span>
                        <span class="text-center text-xs">
                            @if (isset($band['discountedPriceMinor']))
                                <span class="mr-1 text-muted-foreground line-through" x-show="selectedPricingModeId !== 'head'" x-text="money(@js((int) $band['priceMinor']), @js($band['currency']))"></span>
                            @endif
                            <span
                                @class(['font-medium text-epos-accent' => isset($band['discountedPriceMinor']), 'text-muted-foreground' => !isset($band['discountedPriceMinor'])])
                                x-text="selectedPricingModeId === 'head' && @js($band['perPersonPriceMinor'] ?? null) !== null ? `${money(@js($band['perPersonPriceMinor'] ?? 0), @js($band['currency']))}/pp` : money(@js($band['discountedPriceMinor'] ?? $band['priceMinor']), @js($band['currency']))"
                            ></span>
                        </span>
                    </button>
                </x-ui.card>
            @endforeach
        </div>

        <div id="availability-times" class="mt-2 min-h-9">
            <template x-if="expandedBand">
                <div class="grid grid-cols-4 gap-1.5" x-bind:aria-label="`${expandedBand.label} times`">
                    <template x-for="time in expandedBand.times" x-bind:key="time.id">
                        <button
                            type="button"
                            class="inline-flex h-7 items-center justify-center rounded-md border p-1 text-xs font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                            x-bind:disabled="!time.available"
                            x-bind:aria-pressed="selectedTimeId === time.id"
                            x-bind:class="selectedTimeId === time.id ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-accent'"
                            x-on:click="selectTime(time.id, expandedBand.id)"
                            x-text="time.label"
                        ></button>
                    </template>
                </div>
            </template>
            <p x-show="!expandedBand" class="text-xs text-muted-foreground">Choose a time band to see individual times.</p>
        </div>
    </div>
</section>
