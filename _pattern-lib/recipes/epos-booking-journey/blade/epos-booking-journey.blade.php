@props([
    'title' => 'Create a booking',
    'steps' => [],
    'initialStepId' => null,
    'queries' => [],
    'criteria' => [],
    'products' => [],
    'availability' => [],
    'review' => [],
    'checkout' => [],
])

@php
    $stepIds = collect($steps)->pluck('id')->values()->all();
    $initialStepIndex = array_search($initialStepId, $stepIds, true);
    $initialStepIndex = $initialStepIndex === false ? 0 : $initialStepIndex;
    $selectedProducts = $products['selectedProductIds'] ?? [];
    $selectedTimeId = $availability['selectedTimeId'] ?? null;
    $expandedBandId = $availability['defaultExpandedBandId'] ?? null;
    $currency = $review['currency'] ?? 'GBP';
    $currencySymbol = $currency === 'GBP' ? '£' : $currency.' ';
    $totalMinor = $review['totalMinor'] ?? 0;
@endphp

<section
    {{ $attributes->class('mx-auto w-full max-w-5xl space-y-5') }}
    aria-labelledby="epos-booking-title"
    data-pattern="epos-booking-journey"
    x-data="{
        stepIndex: @js($initialStepIndex),
        complete: false,
        selectedProducts: @js($selectedProducts),
        selectedTimeId: @js($selectedTimeId),
        expandedBandId: @js($expandedBandId),
        goTo(index) {
            this.stepIndex = Math.max(0, Math.min(index, @js(max(0, count($steps) - 1))));
            this.$dispatch('ui:epos-booking-journey:change', { stepId: @js($stepIds)[this.stepIndex] });
        },
        toggleProduct(id) {
            this.selectedProducts = this.selectedProducts.includes(id)
                ? this.selectedProducts.filter((candidate) => candidate !== id)
                : [...this.selectedProducts, id];
            this.$dispatch('ui:epos-booking-journey:change', { field: 'products', value: this.selectedProducts });
        },
        selectTime(id, bandId) {
            this.selectedTimeId = this.selectedTimeId === id ? null : id;
            this.expandedBandId = bandId;
            this.$dispatch('ui:epos-booking-journey:change', { field: 'time', value: this.selectedTimeId, bandId });
        }
    }"
>
    <div x-show="!complete" class="space-y-5">
        <header class="space-y-1">
            <h1 id="epos-booking-title" class="text-2xl font-semibold tracking-tight">{{ $title }}</h1>
            <p class="text-sm text-muted-foreground">Fixture-driven example: host services still own availability, pricing and submission.</p>
        </header>

        <nav aria-label="Booking progress" class="w-full py-2">
            <div class="relative mx-auto max-w-md">
                <button
                    type="button"
                    x-show="stepIndex > 0"
                    x-on:click="goTo(stepIndex - 1)"
                    class="absolute left-0 top-3 z-10 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Go back one step"
                >
                    <x-phosphor-caret-left aria-hidden="true" class="size-4" />
                </button>
                <ol class="flex items-start justify-center gap-8 sm:gap-16">
                    @foreach ($steps as $index => $step)
                        <li class="flex flex-col items-center">
                            <button
                                type="button"
                                x-on:click="if (stepIndex > {{ $index }}) goTo({{ $index }})"
                                x-bind:disabled="stepIndex <= {{ $index }}"
                                x-bind:aria-current="stepIndex === {{ $index }} ? 'step' : null"
                                class="flex flex-col items-center rounded-lg disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="{{ $step['label'] }}"
                            >
                                <span
                                    class="flex size-10 items-center justify-center rounded-full border-2 transition-colors"
                                    x-bind:class="stepIndex >= {{ $index }} ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'"
                                    x-text="stepIndex > {{ $index }} ? '✓' : @js($index + 1)"
                                    aria-hidden="true"
                                ></span>
                                <span class="mt-2 hidden max-w-24 text-center text-xs sm:block">{{ $step['label'] }}</span>
                            </button>
                        </li>
                    @endforeach
                </ol>
            </div>
        </nav>

        <div x-show="stepIndex === 0" class="space-y-4">
            @if (count($queries['queries'] ?? []))
                <div class="flex items-center gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Booking queries">
                    @foreach ($queries['queries'] as $query)
                        <button
                            type="button"
                            role="tab"
                            :aria-selected="@js(($queries['selectedQueryId'] ?? null) === $query['id'])"
                            class="min-h-10 shrink-0 rounded-full bg-muted px-3 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            x-on:click="$dispatch('ui:epos-booking-journey:change', { field: 'query', value: @js($query['id']) })"
                        >{{ $query['partyLabel'] }} · {{ $query['dateLabel'] }}</button>
                    @endforeach
                    <x-ui.button type="button" variant="outline" size="icon" class="size-8 shrink-0 rounded-full" aria-label="Add another query" x-on:click="$dispatch('ui:epos-booking-journey:action', { id: 'add-query' })">
                        <x-phosphor-plus aria-hidden="true" class="size-4" />
                    </x-ui.button>
                </div>
            @endif

            <x-ui.card>
                <x-ui.card.header>
                    <x-ui.card.title>{{ $criteria['title'] ?? 'Plan your visit' }}</x-ui.card.title>
                    <x-ui.card.description>{{ $criteria['description'] ?? 'Choose a date and tell us who is coming.' }}</x-ui.card.description>
                </x-ui.card.header>
                <x-ui.card.content class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-2">
                        <x-ui.label for="journey-date">Date</x-ui.label>
                        <x-ui.input id="journey-date" name="date" type="date" :value="$criteria['date'] ?? ''" :min="$criteria['minimumDate'] ?? null" x-on:change="$dispatch('ui:epos-booking-journey:change', { field: 'date', value: $event.target.value })" />
                    </div>
                    <fieldset class="space-y-2">
                        <legend class="text-sm font-medium">Party</legend>
                        @foreach ($criteria['party'] ?? [] as $category)
                            <div class="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                                <span class="min-w-0 text-sm"><span class="block font-medium">{{ $category['label'] }}</span>@if ($category['description'] ?? null)<span class="block text-xs text-muted-foreground">{{ $category['description'] }}</span>@endif</span>
                                <x-ui.stepper :name="'party['.$category['id'].']'" :value="$category['count']" :min="$category['min'] ?? 0" :max="$category['max'] ?? null" :label="$category['label']" />
                            </div>
                        @endforeach
                    </fieldset>
                </x-ui.card.content>
            </x-ui.card>

            <x-ui.card>
                <x-ui.card.header><x-ui.card.title>Products</x-ui.card.title><x-ui.card.description>Select products and cover the party capacity.</x-ui.card.description></x-ui.card.header>
                <x-ui.card.content class="space-y-2">
                    @foreach ($products['products'] ?? [] as $product)
                        <button
                            type="button"
                            x-on:click="toggleProduct(@js($product['id']))"
                            x-bind:aria-pressed="selectedProducts.includes(@js($product['id']))"
                            x-bind:class="selectedProducts.includes(@js($product['id'])) ? 'border-primary bg-primary/5' : 'border-border'"
                            class="flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span><span class="block text-sm font-medium">{{ $product['label'] }}</span>@if ($product['description'] ?? null)<span class="block text-xs text-muted-foreground">{{ $product['description'] }}</span>@endif</span>
                            <x-phosphor-caret-right aria-hidden="true" class="size-4" />
                        </button>
                    @endforeach
                </x-ui.card.content>
            </x-ui.card>

            <aside aria-label="Current workflow actions" class="mx-auto max-w-xl">
                <x-ui.card class="shadow-lg"><x-ui.card.content class="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"><p class="min-w-0 flex-1 text-sm text-muted-foreground" x-text="`${selectedProducts.length} products selected`"></p><x-ui.button type="button" x-bind:disabled="selectedProducts.length === 0" x-on:click="goTo(1)">Find availability</x-ui.button></x-ui.card.content></x-ui.card>
            </aside>
        </div>

        <div x-show="stepIndex === 1" class="space-y-4">
            <x-ui.card>
                <x-ui.card.header><x-ui.card.title>Availability</x-ui.card.title><x-ui.card.description>Choose a location, pricing view and available departure.</x-ui.card.description></x-ui.card.header>
                <x-ui.card.content class="space-y-4">
                    <div class="flex flex-wrap gap-2" aria-label="Location">
                        @foreach ($availability['locations'] ?? [] as $location)
                            <button type="button" class="rounded-full border px-3 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" x-on:click="$dispatch('ui:epos-booking-journey:change', { field: 'location', value: @js($location['id']) })">{{ $location['label'] }}</button>
                        @endforeach
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                        @foreach ($availability['timeBands'] ?? [] as $band)
                            <button type="button" class="rounded-lg border p-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" x-bind:aria-expanded="expandedBandId === @js($band['id'])" x-on:click="expandedBandId = expandedBandId === @js($band['id']) ? null : @js($band['id'])">{{ $band['label'] }}</button>
                        @endforeach
                    </div>
                    @foreach ($availability['timeBands'] ?? [] as $band)
                        <div x-show="expandedBandId === @js($band['id'])" class="grid grid-cols-4 gap-2" aria-label="{{ $band['label'] }} times">
                            @foreach ($band['times'] as $time)
                                <x-ui.button type="button" size="sm" :disabled="!$time['available']" x-bind:variant="selectedTimeId === @js($time['id']) ? 'default' : 'outline'" x-bind:aria-pressed="selectedTimeId === @js($time['id'])" x-on:click="selectTime(@js($time['id']), @js($band['id']))">{{ $time['label'] }}</x-ui.button>
                            @endforeach
                        </div>
                    @endforeach
                </x-ui.card.content>
            </x-ui.card>
            <aside aria-label="Current workflow actions" class="mx-auto max-w-xl">
                <x-ui.card class="shadow-lg"><x-ui.card.content class="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"><div class="min-w-0 flex-1"><p class="text-sm text-muted-foreground" x-text="selectedTimeId ? 'Departure selected' : 'Choose a departure'"></p><p class="font-semibold tabular-nums">{{ $currencySymbol }}{{ number_format($totalMinor / 100, 2) }}</p></div><x-ui.button type="button" variant="outline" x-on:click="goTo(0)">Back</x-ui.button><x-ui.button type="button" x-bind:disabled="!selectedTimeId" x-on:click="goTo(2)">Review booking</x-ui.button></x-ui.card.content></x-ui.card>
            </aside>
        </div>

        <div x-show="stepIndex === 2" class="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <x-ui.card>
                <x-ui.card.header><x-ui.card.title>{{ $review['title'] ?? 'Booking summary' }}</x-ui.card.title><x-ui.card.description>{{ count($review['lines'] ?? []) }} selections</x-ui.card.description></x-ui.card.header>
                <x-ui.card.content class="space-y-4">
                    @foreach ($review['lines'] ?? [] as $line)
                        <article class="rounded-lg border p-3"><div class="flex items-start justify-between gap-3"><div><h2 class="font-medium">{{ $line['title'] }}</h2><p class="text-sm text-muted-foreground">{{ $line['description'] ?? '' }}</p><p class="mt-1 text-sm">{{ $line['date'] }} · {{ $line['time'] }}</p></div><strong class="tabular-nums">{{ $currencySymbol }}{{ number_format($line['amountMinor'] / 100, 2) }}</strong></div></article>
                    @endforeach
                    <x-ui.separator />
                    <dl class="grid grid-cols-[1fr_auto] gap-2 text-sm"><dt class="font-semibold">Total</dt><dd class="text-right font-semibold tabular-nums">{{ $currencySymbol }}{{ number_format($totalMinor / 100, 2) }}</dd></dl>
                </x-ui.card.content>
            </x-ui.card>

            <x-ui.form action="" method="post" class="space-y-4" x-on:submit.prevent="complete = true; $dispatch('ui:epos-booking-journey:action', { id: 'complete' })">
                <x-ui.card>
                    <x-ui.card.header><x-ui.card.title>Customer details</x-ui.card.title></x-ui.card.header>
                    <x-ui.card.content class="grid gap-4 sm:grid-cols-2">
                        @foreach ([['firstName', 'First name', 'text'], ['lastName', 'Last name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel']] as [$name, $label, $type])
                            <div class="space-y-2"><x-ui.label :for="'journey-'.$name">{{ $label }}</x-ui.label><x-ui.input :id="'journey-'.$name" :name="$name" :type="$type" :value="$checkout['customer'][$name] ?? ''" required /></div>
                        @endforeach
                        <div class="space-y-2 sm:col-span-2"><x-ui.label for="journey-notes">Notes</x-ui.label><x-ui.textarea id="journey-notes" name="notes" :value="$checkout['customer']['notes'] ?? ''" rows="3" /></div>
                    </x-ui.card.content>
                </x-ui.card>
                <div class="flex justify-end"><x-ui.button type="submit">{{ $checkout['submitLabel'] ?? 'Confirm booking' }}</x-ui.button></div>
            </x-ui.form>
        </div>
    </div>

    <x-ui.card x-show="complete" class="mx-auto max-w-2xl">
        <x-ui.card.header><x-ui.card.title>Booking recorded</x-ui.card.title><x-ui.card.description>This preview stops before any payment, API call, or persisted booking.</x-ui.card.description></x-ui.card.header>
        <x-ui.card.content><x-ui.button type="button" variant="outline" x-on:click="complete = false; goTo(0)">Start another preview</x-ui.button></x-ui.card.content>
    </x-ui.card>
</section>
