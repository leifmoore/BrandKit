@props([
    'initialReference' => '',
    'initialResult' => null,
    'lookupAction' => null,
    'locale' => 'en-GB',
    'triggerLabel' => 'Look up quote',
])
@php
    $quote = isset($initialResult['quote']) ? $initialResult['quote'] : null;
    $status = $initialResult['status'] ?? null;
@endphp

<div {{ $attributes }} x-data="{ reference: @js($initialReference) }">
    <x-ui.dialog>
        <x-ui.dialog.trigger class="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">{{ $triggerLabel }}</x-ui.dialog.trigger>
        <x-ui.dialog.content class="sm:max-w-sm">
            <x-ui.dialog.header>
                <x-ui.dialog.title>Look up quote</x-ui.dialog.title>
                <x-ui.dialog.description>Enter the customer’s quote reference to continue its host-owned journey.</x-ui.dialog.description>
            </x-ui.dialog.header>

            <form
                class="space-y-4"
                @if ($lookupAction) action="{{ $lookupAction }}" method="GET" @else x-on:submit.prevent="$dispatch('ui:quote-lookup:action', { action: 'lookup', reference: reference.trim() })" @endif
            >
                <div class="space-y-2">
                    <x-ui.label for="quote-lookup-reference" value="Quote reference" />
                    <x-ui.input id="quote-lookup-reference" name="reference" autocomplete="off" placeholder="e.g. QT-1042" required x-model="reference" />
                    @if ($status === 'not-found')
                        <p role="alert" class="text-sm text-destructive">No quote was found with that reference.</p>
                    @endif
                </div>
                <x-ui.button type="submit" class="w-full" x-bind:disabled="!reference.trim()">
                    <x-phosphor-magnifying-glass aria-hidden="true" class="size-4" />
                    Look up quote
                </x-ui.button>
            </form>

            @if ($quote)
                <section class="space-y-3 rounded-lg border p-4" aria-live="polite" aria-label="Quote {{ $quote['reference'] }}">
                    <div class="flex items-center justify-between gap-2">
                        <strong>{{ $quote['reference'] }}</strong>
                        <x-ui.badge :variant="$status === 'found' ? 'success' : ($status === 'expired' ? 'warning' : 'secondary')">{{ $status === 'found' ? 'Ready' : ($status === 'expired' ? 'Expired' : 'Redeemed') }}</x-ui.badge>
                    </div>
                    <div class="text-sm">
                        <p class="font-medium">{{ $quote['customerName'] }}</p>
                        <p class="text-muted-foreground">{{ $quote['bookingLabel'] }}</p>
                        <p class="text-muted-foreground">{{ implode(', ', $quote['productLabels']) }}</p>
                    </div>
                    <div class="flex justify-between border-t pt-3 text-sm">
                        <span>Quoted price</span>
                        <strong>
                            @php
                                $currencyPrefix = match ($quote['currency']) {
                                    'GBP' => '£', 'EUR' => '€', 'USD' => '$',
                                    default => $quote['currency'].' ',
                                };
                                $from = $currencyPrefix.number_format($quote['priceFromMinor'] / 100, 2);
                                $to = $currencyPrefix.number_format($quote['priceToMinor'] / 100, 2);
                            @endphp
                            {{ $quote['priceFromMinor'] === $quote['priceToMinor'] ? $from : $from.' – '.$to }}
                        </strong>
                    </div>
                    <p class="text-xs text-muted-foreground">Expires {{ $quote['expiresAtLabel'] }}</p>
                    @if ($status === 'found')
                        <x-ui.button type="button" class="w-full" x-on:click="$dispatch('ui:quote-lookup:action', { action: 'select', quote: @js($quote) }); hide()">Continue with quote</x-ui.button>
                    @else
                        <p role="status" class="text-sm text-muted-foreground">This quote cannot be continued. The host should offer an appropriate recovery path.</p>
                    @endif
                </section>
            @endif
        </x-ui.dialog.content>
    </x-ui.dialog>
</div>
