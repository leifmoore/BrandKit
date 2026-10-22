@props([
    'subtotalMinor',
    'currency' => 'GBP',
    'currentDiscount' => null,
    'effectivePersonUnits' => 1,
    'maximumPercentage' => null,
    'approvalThresholdPercentage' => null,
    'minimumTotalMinor' => null,
    'locale' => 'en-GB',
    'triggerLabel' => 'Amend price',
])

<div
    {{ $attributes }}
    x-data="{
        subtotal: @js((int) $subtotalMinor), currency: @js($currency), locale: @js($locale),
        currentDiscount: @js($currentDiscount), basis: 'area',
        type: @js(($currentDiscount['type'] ?? 'amount')),
        value: @js(isset($currentDiscount) ? (($currentDiscount['type'] ?? null) === 'amount' ? (($currentDiscount['amountMinor'] ?? 0) / 100) : ($currentDiscount['percentage'] ?? 0)) : 0),
        units: Math.max(@js((float) $effectivePersonUnits), 1),
        maximum: @js($maximumPercentage), approvalThreshold: @js($approvalThresholdPercentage), minimumTotal: @js($minimumTotalMinor),
        get amountMinor() { return this.type === 'amount' ? Math.min(Math.round(this.value * 100 * (this.basis === 'head' ? this.units : 1)), this.subtotal) : Math.round(this.subtotal * this.value / 100) },
        get finalTotal() { return this.subtotal - this.amountMinor },
        get allowedMaximum() { return Math.min(this.maximum === null ? 100 : Number(this.maximum), 100) },
        get exceedsMaximum() { return this.type === 'percentage' && this.value > this.allowedMaximum },
        get requiresApproval() { return this.type === 'percentage' && this.approvalThreshold !== null && this.value > Number(this.approvalThreshold) && !this.exceedsMaximum },
        get violatesMinimum() { return this.minimumTotal !== null && this.finalTotal < Number(this.minimumTotal) },
        get invalid() { return this.value <= 0 || this.exceedsMaximum || this.violatesMinimum },
        get presets() { return this.basis === 'head' && this.type === 'amount' ? [1, 2, 5, 10, 15] : [5, 10, 15, 20, 25] },
        money(minor) { return new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency }).format(Number(minor) / 100) },
        emitDraft() { this.$dispatch('ui:discount-builder:change', { type: this.type, basis: this.basis, value: Number(this.value), amountMinor: this.amountMinor, finalTotalMinor: this.finalTotal }); },
        apply() {
            const discount = this.type === 'amount' ? { type: 'amount', amountMinor: this.amountMinor } : { type: 'percentage', percentage: Number(this.value) };
            this.currentDiscount = discount;
            this.$dispatch('ui:discount-builder:action', { action: 'apply', discount, requiresApproval: this.requiresApproval });
        },
        remove() { this.currentDiscount = null; this.value = 0; this.$dispatch('ui:discount-builder:action', { action: 'remove' }); }
    }"
>
    <x-ui.dialog>
        <x-ui.dialog.trigger class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <x-phosphor-tag aria-hidden="true" class="size-4" />
            {{ $triggerLabel }}
        </x-ui.dialog.trigger>
        <x-ui.dialog.content class="sm:max-w-md">
            <x-ui.dialog.header>
                <x-ui.dialog.title>Apply discount</x-ui.dialog.title>
                <x-ui.dialog.description>Preview the effect before handing the draft back to the host.</x-ui.dialog.description>
            </x-ui.dialog.header>

            <div class="space-y-4 pt-2">
                <div class="flex items-center justify-center gap-3">
                    <div class="flex rounded-lg bg-muted p-1" role="group" aria-label="Pricing basis">
                        <button type="button" class="rounded-md px-3 py-1.5 text-sm" x-on:click="basis = 'area'; emitDraft()" x-bind:class="basis === 'area' ? 'bg-background shadow-sm' : 'text-muted-foreground'" x-bind:aria-pressed="basis === 'area'">Per Area</button>
                        <button type="button" class="rounded-md px-3 py-1.5 text-sm" x-on:click="basis = 'head'; emitDraft()" x-bind:class="basis === 'head' ? 'bg-background shadow-sm' : 'text-muted-foreground'" x-bind:aria-pressed="basis === 'head'">Per Head</button>
                    </div>
                    <div class="flex rounded-lg bg-muted p-1" role="group" aria-label="Discount type">
                        <button type="button" class="rounded-md px-3 py-1.5 text-sm" x-on:click="type = 'amount'; emitDraft()" x-bind:class="type === 'amount' ? 'bg-background shadow-sm' : 'text-muted-foreground'" x-bind:aria-pressed="type === 'amount'" x-text="currency"></button>
                        <button type="button" class="rounded-md px-3 py-1.5 text-sm" x-on:click="type = 'percentage'; emitDraft()" x-bind:class="type === 'percentage' ? 'bg-background shadow-sm' : 'text-muted-foreground'" x-bind:aria-pressed="type === 'percentage'">%</button>
                    </div>
                </div>

                <div class="grid grid-cols-5 gap-2" aria-label="Discount presets">
                    <template x-for="preset in presets" x-bind:key="preset">
                        <button type="button" class="aspect-square rounded-md border bg-background p-0 text-sm font-medium hover:bg-accent" x-on:click="value += preset; emitDraft()" x-text="type === 'amount' ? money(preset * 100) : `${preset}%`"></button>
                    </template>
                </div>

                <div class="space-y-2">
                    <x-ui.label for="discount-builder-value" value="Discount value" />
                    <div class="flex gap-2">
                        <x-ui.input id="discount-builder-value" name="discount_value" type="number" min="0" x-model.number="value" x-on:input="emitDraft()" />
                        <x-ui.button type="button" variant="outline" x-on:click="value = 0; emitDraft()">Clear</x-ui.button>
                    </div>
                </div>

                <div class="space-y-1 rounded-md border p-3 transition-opacity" x-bind:class="value > 0 ? 'border-epos-accent/30 bg-epos-accent/10 opacity-100 dark:bg-epos-accent/20' : 'border-border bg-muted opacity-50'" aria-live="polite">
                    <div class="flex justify-between text-sm"><span x-text="basis === 'head' ? 'Original (per person)' : 'Original total'"></span><span x-bind:class="{ 'text-muted-foreground line-through': value > 0 }" x-text="money(Math.round(subtotal / (basis === 'head' ? units : 1)))"></span></div>
                    <div class="flex justify-between text-sm text-epos-accent"><span>Discount</span><span x-text="`−${money(Math.round(amountMinor / (basis === 'head' ? units : 1)))}`"></span></div>
                    <div class="flex justify-between border-t pt-1 text-sm"><span x-text="basis === 'head' ? 'New per person' : 'New total'"></span><span x-text="money(Math.round(finalTotal / (basis === 'head' ? units : 1)))"></span></div>
                    <div x-show="basis === 'head'" class="flex justify-between border-t pt-1 font-medium"><span>New area total</span><span x-text="money(finalTotal)"></span></div>
                </div>

                <p x-show="exceedsMaximum" role="alert" class="flex gap-2 rounded-md border border-status-danger/30 bg-status-danger/10 p-3 text-sm text-status-danger-foreground"><x-phosphor-warning aria-hidden="true" class="size-4 shrink-0" />Maximum discount is <span x-text="`${allowedMaximum}%`"></span>.</p>
                <p x-show="requiresApproval" class="flex gap-2 rounded-md border border-status-warning/30 bg-status-warning/10 p-3 text-sm text-status-warning-foreground"><x-phosphor-warning aria-hidden="true" class="size-4 shrink-0" />This draft requires host approval.</p>
                <p x-show="violatesMinimum" role="alert" class="flex gap-2 rounded-md border border-status-danger/30 bg-status-danger/10 p-3 text-sm text-status-danger-foreground"><x-phosphor-warning aria-hidden="true" class="size-4 shrink-0" />The new total is below the supplied minimum.</p>

                <div class="flex gap-2">
                    <x-ui.button type="button" class="flex-1" x-bind:disabled="invalid" x-on:click="apply(); hide()">Apply discount</x-ui.button>
                    <x-ui.button type="button" variant="outline" x-show="currentDiscount" x-on:click="remove(); hide()">Remove</x-ui.button>
                </div>
            </div>
        </x-ui.dialog.content>
    </x-ui.dialog>
</div>
