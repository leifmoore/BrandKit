@props([
    'title' => 'Booking summary',
    'expanded' => true,
    'lines' => [],
    'subtotalMinor' => 0,
    'discountMinor' => 0,
    'totalMinor' => 0,
    'currency' => 'GBP',
])

@php($symbol = $currency === 'GBP' ? '£' : $currency.' ')

<div
    x-data="{ open: @js($expanded) }"
    data-pattern="booking-review-summary"
    x-on:ui:booking-review-summary:change.window="if ($event.detail?.expanded !== undefined) open = $event.detail.expanded"
>
    <x-ui.card>
        <x-ui.card.header class="gap-3">
            <button
                type="button"
                class="flex w-full items-center justify-between gap-4 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                x-on:click="open = !open; $dispatch('ui:booking-review-summary:change', { expanded: open })"
                x-bind:aria-expanded="open"
                aria-controls="booking-review-summary-content"
            >
                <span>
                    <x-ui.card.title>{{ $title }}</x-ui.card.title>
                    <span class="mt-1 block text-sm text-muted-foreground">{{ count($lines) }} {{ count($lines) === 1 ? 'selection' : 'selections' }}</span>
                </span>
                <span class="flex items-center gap-3">
                    <span class="font-semibold tabular-nums">{{ $symbol }}{{ number_format($totalMinor / 100, 2) }}</span>
                    <x-phosphor-caret-down aria-hidden="true" class="size-4 transition-transform" x-bind:class="open && 'rotate-180'" />
                </span>
            </button>
        </x-ui.card.header>
        <div id="booking-review-summary-content" x-show="open" x-collapse>
            <x-ui.card.content class="space-y-4">
                @forelse ($lines as $line)
                    <article class="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto]">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="font-medium">{{ $line['title'] }}</h3>
                                @if ($line['status'] ?? null)<x-ui.badge variant="secondary">{{ $line['status'] }}</x-ui.badge>@endif
                            </div>
                            @if ($line['description'] ?? null)<p class="mt-1 text-sm text-muted-foreground">{{ $line['description'] }}</p>@endif
                            <p class="mt-1 text-sm"><time datetime="{{ $line['date'] }}T{{ $line['time'] }}">{{ $line['date'] }} · {{ $line['time'] }}</time></p>
                        </div>
                        <div class="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                            <strong class="tabular-nums">{{ $symbol }}{{ number_format($line['amountMinor'] / 100, 2) }}</strong>
                            <span class="flex gap-1">
                                <x-ui.button type="button" variant="ghost" size="icon" aria-label="Edit {{ $line['title'] }}" x-on:click="$dispatch('ui:booking-review-summary:action', { action: 'edit', lineId: @js($line['id']) })"><x-phosphor-pencil aria-hidden="true" /></x-ui.button>
                                <x-ui.button type="button" variant="ghost" size="icon" aria-label="Remove {{ $line['title'] }}" x-on:click="$dispatch('ui:booking-review-summary:action', { action: 'remove', lineId: @js($line['id']) })"><x-phosphor-trash aria-hidden="true" /></x-ui.button>
                            </span>
                        </div>
                    </article>
                @empty
                    <p class="text-sm text-muted-foreground">No selections have been added.</p>
                @endforelse
                <x-ui.separator />
                <dl class="ml-auto grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
                    <dt class="text-muted-foreground">Subtotal</dt><dd class="text-right tabular-nums">{{ $symbol }}{{ number_format($subtotalMinor / 100, 2) }}</dd>
                    @if ($discountMinor > 0)<dt class="text-muted-foreground">Discount</dt><dd class="text-right tabular-nums">−{{ $symbol }}{{ number_format($discountMinor / 100, 2) }}</dd>@endif
                    <dt class="font-semibold">Total</dt><dd class="text-right font-semibold tabular-nums">{{ $symbol }}{{ number_format($totalMinor / 100, 2) }}</dd>
                </dl>
            </x-ui.card.content>
        </div>
    </x-ui.card>
</div>
