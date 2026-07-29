@props(['name', 'value' => 0, 'min' => 0, 'max' => null, 'step' => 1, 'label' => 'Quantity', 'disabled' => false])
<div data-slot="stepper" x-data="uiStepper(@js((float)$value), @js((float)$min), @js($max === null ? null : (float)$max), @js((float)$step))" {{ $attributes->class('flex items-center gap-2') }}>
    <x-ui.button type="button" variant="outline" size="icon" aria-label="Decrease {{ $label }}" x-on:click="decrement()" x-bind:disabled="{{ $disabled ? 'true' : 'false' }} || value <= {{ (float)$min }}" class="size-7"><x-phosphor-minus aria-hidden="true" class="size-4" /></x-ui.button>
    <span aria-live="polite" class="w-6 text-center text-sm tabular-nums" x-text="value"></span>
    <input type="hidden" name="{{ $name }}" x-bind:value="value">
    <x-ui.button type="button" variant="outline" size="icon" aria-label="Increase {{ $label }}" x-on:click="increment()" x-bind:disabled="{{ $disabled ? 'true' : 'false' }} || ({{ $max === null ? 'null' : (float)$max }} !== null && value >= {{ $max === null ? 'null' : (float)$max }})" class="size-7"><x-phosphor-plus aria-hidden="true" class="size-4" /></x-ui.button>
</div>
