@props([
    'summary',
    'timeBands' => [],
    'initialSelectedBandIds' => [],
    'expiryOptions' => [],
    'defaultExpiryOptionId',
    'locale' => 'en-GB',
    'triggerLabel' => 'Get quote',
])

<div
    {{ $attributes }}
    x-data="{
        bands: @js($timeBands), selectedBandIds: @js(array_values($initialSelectedBandIds)),
        expiryOptions: @js($expiryOptions), expiryOptionId: @js($defaultExpiryOptionId),
        customerName: '', customerEmail: '', locale: @js($locale),
        get selectedBands() { return this.bands.filter((band) => this.selectedBandIds.includes(band.id)) },
        money(minor, currency) { return new Intl.NumberFormat(this.locale, { style: 'currency', currency }).format(Number(minor) / 100) },
        toggleBand(id, checked) { this.selectedBandIds = checked ? [...new Set([...this.selectedBandIds, id])] : this.selectedBandIds.filter((candidate) => candidate !== id); this.$dispatch('ui:quote-builder:change', { field: 'timeBands', selectedBandIds: this.selectedBandIds }); },
        submit() {
            const expiry = this.expiryOptions.find((option) => option.id === this.expiryOptionId);
            this.$dispatch('ui:quote-builder:action', { action: 'submit', draft: { customerName: this.customerName, customerEmail: this.customerEmail, selectedBandIds: this.selectedBandIds, expiresAt: expiry?.expiresAt ?? null } });
        }
    }"
>
    <x-ui.dialog>
        <x-ui.dialog.trigger class="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">{{ $triggerLabel }}</x-ui.dialog.trigger>
        <x-ui.dialog.content class="sm:max-w-lg">
            <x-ui.dialog.header>
                <x-ui.dialog.title>Create quote</x-ui.dialog.title>
                <x-ui.dialog.description>Choose the offered times, recipient, and expiry. The host sends and stores the quote.</x-ui.dialog.description>
            </x-ui.dialog.header>

            <form class="space-y-4" x-on:submit.prevent="submit(); hide()">
                <div class="rounded-lg bg-muted p-3 text-sm">
                    <p class="font-medium">{{ $summary['partyLabel'] }} · {{ $summary['dateLabel'] }}</p>
                    <p class="mt-1 text-muted-foreground">{{ implode(', ', $summary['productLabels']) }}</p>
                </div>

                <fieldset class="space-y-2">
                    <legend class="text-sm font-medium">Time bands</legend>
                    <div class="grid gap-2 sm:grid-cols-2">
                        @foreach ($timeBands as $band)
                            <label @class(['flex items-center justify-between gap-3 rounded-lg border p-3 text-sm', 'opacity-50' => !($band['available'] ?? true)])>
                                <span class="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value="{{ $band['id'] }}"
                                        @checked(in_array($band['id'], $initialSelectedBandIds, true))
                                        @disabled(!($band['available'] ?? true))
                                        class="size-4 rounded border-input accent-primary"
                                        x-on:change="toggleBand(@js((string) $band['id']), $event.target.checked)"
                                    >
                                    {{ $band['label'] }}
                                </span>
                                <span class="text-muted-foreground" x-text="money(@js((int) $band['priceMinor']), @js($band['currency']))"></span>
                            </label>
                        @endforeach
                    </div>
                </fieldset>

                <div class="flex justify-between border-y py-3 text-sm" aria-live="polite">
                    <span><span x-text="selectedBands.length"></span> time <span x-text="selectedBands.length === 1 ? 'band' : 'bands'"></span> offered</span>
                    <strong x-text="selectedBands.length === 0 ? 'No price' : (() => { const prices = selectedBands.map((band) => Number(band.priceMinor)); const low = Math.min(...prices); const high = Math.max(...prices); const currency = selectedBands[0].currency; return low === high ? money(low, currency) : `${money(low, currency)} – ${money(high, currency)}` })()"></strong>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-2"><x-ui.label for="quote-customer-name" value="Customer name" /><x-ui.input id="quote-customer-name" name="customer_name" autocomplete="name" required x-model="customerName" /></div>
                    <div class="space-y-2"><x-ui.label for="quote-customer-email" value="Email address" /><x-ui.input id="quote-customer-email" name="customer_email" type="email" autocomplete="email" required x-model="customerEmail" /></div>
                </div>

                <fieldset class="space-y-2">
                    <legend class="text-sm font-medium">Quote expiry</legend>
                    <div class="flex flex-wrap gap-1.5">
                        @foreach ($expiryOptions as $option)
                            <button
                                type="button"
                                class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                                x-on:click="expiryOptionId = @js((string) $option['id']); $dispatch('ui:quote-builder:change', { field: 'expiry', expiresAt: @js($option['expiresAt']) })"
                                x-bind:aria-pressed="expiryOptionId === @js((string) $option['id'])"
                                x-bind:class="expiryOptionId === @js((string) $option['id']) ? 'border-epos-accent bg-epos-accent text-epos-accent-foreground' : 'border-border bg-background hover:border-epos-accent hover:text-epos-accent'"
                            >{{ $option['label'] }}</button>
                        @endforeach
                    </div>
                </fieldset>

                <x-ui.button type="submit" class="w-full" x-bind:disabled="selectedBandIds.length === 0">
                    <x-phosphor-paper-plane-tilt aria-hidden="true" class="size-4" />
                    Create quote
                </x-ui.button>
            </form>
        </x-ui.dialog.content>
    </x-ui.dialog>
</div>
