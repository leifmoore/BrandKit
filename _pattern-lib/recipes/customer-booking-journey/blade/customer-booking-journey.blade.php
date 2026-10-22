@props([
    'title',
    'description',
    'currency' => 'GBP',
    'locale' => 'en-GB',
    'minDate',
    'products' => [],
    'locations' => [],
    'times' => [],
    'value',
    'initialStep' => 'trip',
    'completionReference' => null,
    'errorMessage' => null,
    'simulateCompletion' => false,
])

@php($productPrices = collect($products)->mapWithKeys(fn ($product) => [$product['id'] => $product['unitPriceMinor']]))
<x-ui.card
    class="mx-auto max-w-3xl"
    x-data='{ step: @json($initialStep), value: @json($value), prices: @json($productPrices), order: { trip: 0, time: 1, checkout: 2, complete: 3 }, totalItems() { return Object.values(this.value.quantities).reduce((sum, item) => sum + Number(item || 0), 0) }, totalMinor() { return Object.entries(this.value.quantities).reduce((sum, entry) => sum + Number(entry[1] || 0) * Number(this.prices[entry[0]] || 0), 0) }, go(next) { this.step = next; this.$dispatch("ui:customer-booking-journey:change", { field: "step", value: next }) }, changed(field) { this.$dispatch("ui:customer-booking-journey:change", { field, value: this.value }) } }'
>
    <x-ui.card.header x-show="step !== 'complete'">
        <x-ui.card.title>{{ $title }}</x-ui.card.title>
        <x-ui.card.description>{{ $description }}</x-ui.card.description>
        <nav aria-label="Booking progress" class="pt-4">
            <ol class="grid grid-cols-3 gap-2">
                @foreach ([['trip', 'Trip details'], ['time', 'Time slot'], ['checkout', 'Details & payment']] as $progressStep)
                    <li class="min-w-0 text-center"><button type="button" class="w-full rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default" x-bind:disabled="order[step] <= {{ $loop->index }}" x-bind:aria-current="step === @js($progressStep[0]) ? 'step' : null" x-on:click="go(@js($progressStep[0]))"><span class="mx-auto grid size-9 place-items-center rounded-full border-2" x-bind:class="step === @js($progressStep[0]) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'">{{ $loop->iteration }}</span><span class="mt-2 block truncate text-xs">{{ $progressStep[1] }}</span></button></li>
                @endforeach
            </ol>
        </nav>
    </x-ui.card.header>
    <x-ui.card.content class="space-y-6">
        @if ($errorMessage)<div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">{{ $errorMessage }}</div>@endif

        <div x-show="step === 'trip'" class="space-y-6">
            <x-ui.input name="booking_date" type="date" label="Date" :min="$minDate" x-model="value.date" x-on:change="changed('date')" />
            <fieldset class="space-y-3"><legend class="font-semibold">Choose tickets</legend>
                @foreach ($products as $product)
                    @php($formattedPrice = ($currency === 'GBP' ? '£' : $currency.' ').number_format($product['unitPriceMinor'] / 100, 2))
                    <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><div class="font-medium">{{ $product['label'] }}</div>@if (!empty($product['description']))<p class="text-sm text-muted-foreground">{{ $product['description'] }}</p>@endif<p class="mt-1 text-sm">{{ $formattedPrice }}</p></div><div class="flex items-center gap-3"><x-ui.button variant="outline" size="icon" aria-label="Remove {{ $product['label'] }}" x-bind:disabled="Number(value.quantities[@js($product['id'])] || 0) <= 0" x-on:click="value.quantities[@js($product['id'])] = Math.max(0, Number(value.quantities[@js($product['id'])] || 0) - 1); changed('quantities')"><x-phosphor-minus aria-hidden="true" /></x-ui.button><output class="w-8 text-center tabular-nums" x-text="value.quantities[@js($product['id'])] || 0">{{ $value['quantities'][$product['id']] ?? 0 }}</output><x-ui.button variant="outline" size="icon" aria-label="Add {{ $product['label'] }}" x-bind:disabled="Number(value.quantities[@js($product['id'])] || 0) >= {{ $product['maxQuantity'] }}" x-on:click="value.quantities[@js($product['id'])] = Math.min({{ $product['maxQuantity'] }}, Number(value.quantities[@js($product['id'])] || 0) + 1); changed('quantities')"><x-phosphor-plus aria-hidden="true" /></x-ui.button></div></div>
                @endforeach
            </fieldset>
            <div class="flex items-center justify-between border-t pt-4"><span class="text-sm text-muted-foreground"><span x-text="totalItems()"></span> tickets</span><span class="font-semibold tabular-nums" x-text="new Intl.NumberFormat(@js($locale), { style: 'currency', currency: @js($currency) }).format(totalMinor() / 100)"></span></div>
            <x-ui.button class="w-full" x-bind:disabled="!value.date || totalItems() === 0" x-on:click="go('time')">Choose a time</x-ui.button>
        </div>

        <div x-cloak x-show="step === 'time'" class="space-y-6">
            <fieldset class="space-y-3"><legend class="font-semibold">Departure point</legend><div class="flex flex-wrap gap-2">@foreach ($locations as $location)<x-ui.button variant="outline" :disabled="$location['disabled'] ?? false" x-bind:aria-pressed="value.locationId === @js($location['id'])" x-bind:class="value.locationId === @js($location['id']) && 'bg-primary text-primary-foreground'" x-on:click="value.locationId = @js($location['id']); value.timeId = ''; changed('locationId')">{{ $location['label'] }}</x-ui.button>@endforeach</div></fieldset>
            <fieldset class="space-y-3"><legend class="font-semibold">Available times</legend><div class="grid grid-cols-2 gap-2 sm:grid-cols-3">@foreach ($times as $time)<x-ui.button variant="outline" class="h-auto min-h-12 flex-col" :disabled="$time['disabled'] ?? false" x-bind:disabled="!value.locationId || @js($time['disabled'] ?? false)" x-bind:aria-pressed="value.timeId === @js($time['id'])" x-bind:class="value.timeId === @js($time['id']) && 'bg-primary text-primary-foreground'" x-on:click="value.timeId = @js($time['id']); changed('timeId')"><span>{{ $time['label'] }}</span>@if (!empty($time['description']))<span class="text-xs opacity-75">{{ $time['description'] }}</span>@endif</x-ui.button>@endforeach</div></fieldset>
            <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><x-ui.button variant="outline" x-on:click="go('trip')"><x-phosphor-caret-left aria-hidden="true" />Back</x-ui.button><x-ui.button x-bind:disabled="!value.locationId || !value.timeId" x-on:click="go('checkout')">Continue</x-ui.button></div>
        </div>

        <div x-cloak x-show="step === 'checkout'" class="space-y-6">
            <section class="rounded-lg bg-muted p-4"><div class="flex items-center justify-between"><h3 class="font-semibold">Booking summary</h3><x-ui.button variant="link" size="sm" x-on:click="go('trip')">Edit</x-ui.button></div><dl class="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt class="text-muted-foreground">Date</dt><dd x-text="value.date"></dd></div><div><dt class="text-muted-foreground">Tickets</dt><dd x-text="totalItems()"></dd></div><div><dt class="text-muted-foreground">Total</dt><dd class="font-semibold" x-text="new Intl.NumberFormat(@js($locale), { style: 'currency', currency: @js($currency) }).format(totalMinor() / 100)"></dd></div></dl></section>
            <section class="space-y-4"><h3 class="font-semibold">Your details</h3><div class="grid gap-4 sm:grid-cols-2"><x-ui.input name="first_name" label="First name" autocomplete="given-name" x-model="value.customer.firstName" x-on:input="changed('customer')" /><x-ui.input name="last_name" label="Last name" autocomplete="family-name" x-model="value.customer.lastName" x-on:input="changed('customer')" /><x-ui.input name="email" type="email" label="Email" autocomplete="email" x-model="value.customer.email" x-on:input="changed('customer')" /><x-ui.input name="phone" type="tel" label="Phone (optional)" autocomplete="tel" x-model="value.customer.phone" x-on:input="changed('customer')" /></div><x-ui.checkbox name="marketing_consent" label="Send me occasional updates (optional)" x-model="value.customer.marketingConsent" x-on:change="changed('customer')" /></section>
            <x-ui.separator />
            <section class="space-y-3"><h3 class="font-semibold">Payment</h3>@isset($payment){{ $payment }}@else<div class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Secure payment surface supplied by the host</div>@endisset</section>
            <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><x-ui.button variant="outline" x-on:click="go('time')"><x-phosphor-caret-left aria-hidden="true" />Back</x-ui.button><x-ui.button x-bind:disabled="!value.customer.firstName || !value.customer.lastName || !value.customer.email || totalMinor() <= 0" x-on:click="$dispatch('ui:customer-booking-journey:action', { action: 'submit', value }); if (@js($simulateCompletion)) step = 'complete'">Confirm and pay</x-ui.button></div>
        </div>

        <div x-cloak x-show="step === 'complete'" class="flex flex-col items-center px-6 py-8 text-center" role="status"><x-phosphor-check-circle aria-hidden="true" class="size-12 text-status-success-foreground" /><h2 class="mt-4 text-xl font-semibold">Booking confirmed</h2><p class="mt-1 text-sm text-muted-foreground">A confirmation summary can now be sent by the host application.</p>@if ($completionReference)<x-ui.badge variant="success" class="mt-4 font-mono">{{ $completionReference }}</x-ui.badge>@endif</div>
    </x-ui.card.content>
</x-ui.card>
