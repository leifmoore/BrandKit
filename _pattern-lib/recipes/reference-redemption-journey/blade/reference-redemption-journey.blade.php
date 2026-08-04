@props([
    'initialState' => 'lookup',
    'initialReference' => '',
    'lookupOutcome' => 'found',
    'quote' => null,
    'result' => null,
    'simulateConfirmation' => false,
])

<x-ui.card class="mx-auto max-w-xl" x-data="{ state: @js($initialState), reference: @js($initialReference), lookupOutcome: @js($lookupOutcome), lookup() { this.$dispatch('ui:reference-redemption-journey:action', { action: 'lookup', reference: this.reference }); this.state = this.lookupOutcome === 'found' ? 'review' : this.lookupOutcome }, restart() { this.state = 'lookup'; this.reference = ''; this.$dispatch('ui:reference-redemption-journey:change', { field: 'state', value: 'lookup' }) } }">
    <x-ui.card.header>
        <x-ui.card.title>Use a booking reference</x-ui.card.title>
        <x-ui.card.description>Find the saved offer, review its details, and confirm when ready.</x-ui.card.description>
    </x-ui.card.header>
    <x-ui.card.content class="space-y-5">
        <form x-show="state === 'lookup'" x-on:submit.prevent="lookup()" class="space-y-4">
            <x-ui.input name="redemption_reference" label="Reference" autocomplete="off" x-model="reference" x-on:input="reference = reference.toUpperCase()" aria-describedby="redemption-reference-hint" />
            <p id="redemption-reference-hint" class="text-xs text-muted-foreground">Enter the reference exactly as it appears in the message you received.</p>
            <x-ui.button type="submit" class="w-full" x-bind:disabled="!reference.trim()"><x-phosphor-magnifying-glass aria-hidden="true" />Look up reference</x-ui.button>
        </form>

        <div x-cloak x-show="state === 'not-found' || state === 'expired'" class="flex flex-col items-center py-6 text-center" role="alert">
            <span class="grid size-11 place-items-center rounded-full bg-status-warning/15 text-status-warning-foreground"><x-phosphor-warning-circle aria-hidden="true" class="size-5" /></span>
            <h2 class="mt-4 font-semibold" x-text="state === 'not-found' ? 'Reference not found' : 'This reference has expired'"></h2>
            <p class="mt-1 max-w-sm text-sm text-muted-foreground" x-text="state === 'not-found' ? 'Check the characters and try again. No changes have been made.' : 'Ask the sender for a current offer before trying again.'"></p>
            <x-ui.button variant="outline" class="mt-5" x-on:click="restart()"><x-phosphor-arrow-counter-clockwise aria-hidden="true" />Try another reference</x-ui.button>
        </div>

        @if ($quote)
            @php($formattedTotal = ($quote['currency'] === 'GBP' ? '£' : $quote['currency'].' ').number_format($quote['totalMinor'] / 100, 2))
            <div x-cloak x-show="state === 'review'" class="space-y-5">
                <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-sm text-muted-foreground">Prepared for</p><p class="font-semibold">{{ $quote['customerName'] }}</p><p class="text-sm text-muted-foreground">{{ $quote['customerEmail'] }}</p></div><x-ui.badge variant="outline" class="font-mono">{{ $quote['reference'] }}</x-ui.badge></div>
                <x-ui.separator />
                <section class="space-y-3"><div class="flex items-center justify-between"><h2 class="font-semibold">Saved booking details</h2><span class="text-xs text-muted-foreground">Expires {{ $quote['expiresLabel'] }}</span></div>@foreach ($quote['items'] as $item)<article class="rounded-lg border p-3 text-sm"><div class="flex items-start justify-between gap-3"><div><h3 class="font-medium">{{ $item['description'] }}</h3><p class="mt-1 text-muted-foreground">{{ $item['dateLabel'] }} at {{ $item['timeLabel'] }}</p></div><span class="shrink-0 text-muted-foreground">{{ $item['partyLabel'] }}</span></div></article>@endforeach</section>
                <div class="flex items-center justify-between border-t pt-4"><span class="text-sm text-muted-foreground">Total due</span><span class="font-semibold tabular-nums">{{ $formattedTotal }}</span></div>
                <x-ui.button class="w-full" x-on:click="state = 'confirm'; $dispatch('ui:reference-redemption-journey:change', { field: 'state', value: state })">Continue</x-ui.button>
            </div>

            <div x-cloak x-show="state === 'confirm'" class="space-y-5">
                <div class="rounded-lg bg-muted p-4"><h2 class="font-semibold">Confirm redemption</h2><p class="mt-1 text-sm text-muted-foreground">The host must revalidate this reference, amount, and availability before completing the booking.</p></div>
                <dl class="grid gap-3 text-sm sm:grid-cols-2"><div><dt class="text-muted-foreground">Reference</dt><dd class="font-mono">{{ $quote['reference'] }}</dd></div><div><dt class="text-muted-foreground">Bookings</dt><dd>{{ count($quote['items']) }}</dd></div><div><dt class="text-muted-foreground">Confirmation email</dt><dd>{{ $quote['customerEmail'] }}</dd></div><div><dt class="text-muted-foreground">Total due</dt><dd class="font-semibold">{{ $formattedTotal }}</dd></div></dl>
                <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><x-ui.button variant="outline" x-on:click="restart()">Cancel</x-ui.button><x-ui.button x-on:click="$dispatch('ui:reference-redemption-journey:action', { action: 'confirm', reference: @js($quote['reference']) }); if (@js($simulateConfirmation)) state = 'complete'">Confirm redemption</x-ui.button></div>
            </div>
        @endif

        @if ($result)
            <div x-cloak x-show="state === 'complete'" class="flex flex-col items-center py-6 text-center" role="status"><x-phosphor-check-circle aria-hidden="true" class="size-12 text-status-success-foreground" /><h2 class="mt-4 text-lg font-semibold">Reference redeemed</h2><p class="mt-1 max-w-sm text-sm text-muted-foreground">{{ $result['message'] }}</p><div class="mt-4 flex flex-wrap justify-center gap-2">@foreach ($result['bookingReferences'] as $reference)<x-ui.badge variant="success" class="font-mono">{{ $reference }}</x-ui.badge>@endforeach</div><x-ui.button variant="outline" class="mt-6" x-on:click="restart()">Use another reference</x-ui.button></div>
        @endif
    </x-ui.card.content>
</x-ui.card>
