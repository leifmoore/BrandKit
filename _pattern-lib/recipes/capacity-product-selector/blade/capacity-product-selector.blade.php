@props([
    'products' => [],
    'selectedProductIds' => [],
    'selections' => [],
    'targetCapacity' => 1,
])
@php
    $selectionByProduct = collect($selections)->keyBy('productId');
@endphp

<div {{ $attributes->class('space-y-2') }} aria-label="Products" data-pattern="capacity-product-selector">
    @foreach ($products as $product)
        @php
            $initialLines = $selectionByProduct->get($product['id'])['lines'] ?? [];
            $initialOpen = in_array($product['id'], $selectedProductIds, true);
        @endphp
        <section
            class="rounded-lg border transition-colors"
            x-data="{
                productId: @js((string) $product['id']),
                tiers: @js($product['tiers']),
                lines: @js(array_values($initialLines)),
                open: @js($initialOpen),
                target: @js((int) $targetCapacity),
                disabled: @js((bool) ($product['disabled'] ?? false)),
                get usedTierIds() { return this.lines.map((line) => line.tierId) },
                get hasCapacity() { return this.tiers.some((tier) => tier.capacityPerUnit !== null) },
                get coverage() {
                    return this.lines.reduce((total, line) => {
                        const tier = this.tiers.find((candidate) => candidate.id === line.tierId);
                        return total + Number(tier?.capacityPerUnit ?? 0) * Number(line.quantity);
                    }, 0);
                },
                emitChange(action) {
                    this.$dispatch('ui:capacity-product-selector:change', { productId: this.productId, included: this.open, lines: this.lines, action });
                },
                toggle() { if (this.disabled) return; this.open = !this.open; this.emitChange('toggle'); },
                addLine() {
                    const tier = this.tiers.find((candidate) => !this.usedTierIds.includes(candidate.id));
                    if (!tier) return;
                    this.lines.push({ tierId: tier.id, quantity: 1 });
                    this.emitChange('add-line');
                },
                removeLine(index) { this.lines.splice(index, 1); this.emitChange('remove-line'); },
                setTier(index, tierId) { this.lines[index].tierId = tierId; this.emitChange('change-tier'); },
                setQuantity(index, quantity) { this.lines[index].quantity = Number(quantity); this.emitChange('change-quantity'); }
            }"
            x-bind:class="{
                'border-primary bg-primary/5': open,
                'border-border': !open,
                'opacity-40': disabled
            }"
        >
            <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                x-on:click="toggle()"
                x-bind:disabled="disabled"
                x-bind:aria-expanded="open"
                aria-controls="capacity-product-{{ $product['id'] }}"
            >
                <span>
                    <span class="font-medium" x-bind:class="{ 'text-primary': open }">{{ $product['label'] }}</span>
                    @if (!empty($product['description']))
                        <span class="mt-0.5 block text-xs text-foreground/85">{{ $product['description'] }}</span>
                    @endif
                </span>
                <x-phosphor-caret-right aria-hidden="true" class="size-4 shrink-0 text-muted-foreground transition-transform" x-bind:class="{ 'rotate-90': open }" />
            </button>

            <div id="capacity-product-{{ $product['id'] }}" x-cloak x-show="open" x-collapse class="border-t border-primary/20 px-3 pb-3 pt-3">
                <div x-show="hasCapacity" class="mb-3" aria-live="polite">
                    <span
                        class="inline-flex w-fit items-center rounded-full border border-transparent px-2 py-1 text-xs font-medium"
                        x-bind:class="coverage < target ? 'bg-status-danger/15 text-status-danger-foreground' : (coverage > target ? 'bg-status-warning/15 text-status-warning-foreground' : 'bg-status-success/15 text-status-success-foreground')"
                        x-text="coverage < target ? `${coverage} of ${target} places covered` : (coverage > target ? `${coverage} places — more than needed` : `${coverage} places covered`)"
                    ></span>
                </div>

                <div class="space-y-2">
                    <p x-show="lines.length === 0" class="text-xs text-muted-foreground">No options added yet.</p>
                    <template x-for="(line, index) in lines" x-bind:key="`${line.tierId}-${index}`">
                        <div class="flex items-center gap-2">
                            <select
                                class="flex h-8 min-w-0 flex-1 rounded-lg border border-input bg-input-background px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                x-bind:value="line.tierId"
                                x-bind:aria-label="`Option ${index + 1} for {{ addslashes($product['label']) }}`"
                                x-on:change="setTier(index, $event.target.value)"
                            >
                                <template x-for="tier in tiers" x-bind:key="tier.id">
                                    <option x-bind:value="tier.id" x-bind:disabled="tier.id !== line.tierId && usedTierIds.includes(tier.id)" x-text="tier.label"></option>
                                </template>
                            </select>
                            <div class="flex items-center gap-2">
                                <button type="button" class="inline-flex size-7 items-center justify-center rounded-md border bg-background text-sm disabled:opacity-50" x-on:click="setQuantity(index, Math.max(1, Number(line.quantity) - 1))" x-bind:disabled="Number(line.quantity) <= 1" x-bind:aria-label="`Decrease option ${index + 1}`">−</button>
                                <span class="w-6 text-center text-sm tabular-nums" x-text="line.quantity" aria-live="polite"></span>
                                <button type="button" class="inline-flex size-7 items-center justify-center rounded-md border bg-background text-sm disabled:opacity-50" x-on:click="setQuantity(index, Number(line.quantity) + 1)" x-bind:disabled="tiers.find((tier) => tier.id === line.tierId)?.maxQuantity !== null && Number(line.quantity) >= Number(tiers.find((tier) => tier.id === line.tierId)?.maxQuantity)" x-bind:aria-label="`Increase option ${index + 1}`">+</button>
                            </div>
                            <button type="button" class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-destructive" x-on:click="removeLine(index)" x-bind:aria-label="`Remove option ${index + 1}`">
                                <x-phosphor-x aria-hidden="true" class="size-3.5" />
                            </button>
                        </div>
                    </template>
                </div>

                <x-ui.button data-contrast-action type="button" variant="outline" size="sm" class="mt-3 h-8" x-show="usedTierIds.length < tiers.length" x-on:click="addLine()">
                    <x-phosphor-plus aria-hidden="true" class="size-3.5" />
                    Add option
                </x-ui.button>
            </div>
        </section>
    @endforeach
</div>
