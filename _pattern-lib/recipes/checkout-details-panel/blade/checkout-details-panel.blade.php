@props([
    'customer' => [],
    'metadata' => [],
    'metadataExpanded' => false,
    'errors' => [],
    'submitting' => false,
    'submitLabel' => 'Continue',
    'action' => '',
    'method' => 'post',
])

<x-ui.form
    :action="$action"
    :method="$method"
    class="space-y-4"
    data-pattern="checkout-details-panel"
    x-on:submit="$dispatch('ui:checkout-details-panel:action', { action: 'submit' })"
>
    <x-ui.card>
        <x-ui.card.header><x-ui.card.title>Customer details</x-ui.card.title></x-ui.card.header>
        <x-ui.card.content class="grid gap-4 sm:grid-cols-2">
            @foreach ([['firstName', 'First name', 'text'], ['lastName', 'Last name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel']] as [$name, $label, $type])
                <div class="space-y-2">
                    <x-ui.label :for="$name">{{ $label }}</x-ui.label>
                    <x-ui.input :name="$name" :id="$name" :type="$type" :value="$customer[$name] ?? ''" :aria-invalid="isset($errors[$name]) ? 'true' : null" :aria-describedby="isset($errors[$name]) ? $name.'-error' : null" required />
                    @if ($errors[$name] ?? null)<p id="{{ $name }}-error" class="text-sm text-destructive">{{ $errors[$name] }}</p>@endif
                </div>
            @endforeach
            <div class="space-y-2 sm:col-span-2">
                <x-ui.label for="notes">Notes</x-ui.label>
                <x-ui.textarea name="notes" id="notes" :value="$customer['notes'] ?? ''" rows="3" />
            </div>
        </x-ui.card.content>
    </x-ui.card>

    @if (count($metadata))
        <div x-data="{ open: @js($metadataExpanded) }">
            <x-ui.card>
                <x-ui.card.header>
                    <button type="button" class="flex w-full items-center justify-between rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" x-on:click="open = !open; $dispatch('ui:checkout-details-panel:change', { metadataExpanded: open })" x-bind:aria-expanded="open" aria-controls="checkout-metadata">
                        <span><x-ui.card.title>Additional details</x-ui.card.title><span class="mt-1 block text-sm text-muted-foreground">Optional operational information</span></span>
                        <x-phosphor-caret-down aria-hidden="true" class="size-4 transition-transform" x-bind:class="open && 'rotate-180'" />
                    </button>
                </x-ui.card.header>
                <div id="checkout-metadata" x-show="open" x-collapse>
                    <x-ui.card.content class="grid gap-4 sm:grid-cols-2">
                        @foreach ($metadata as $item)
                            @php($error = $errors['metadata.'.$item['id']] ?? null)
                            <div class="space-y-2">
                                <x-ui.label :for="'metadata-'.$item['id']">{{ $item['label'] }}{{ ($item['required'] ?? false) ? ' *' : '' }}</x-ui.label>
                                @if ($item['type'] === 'select')
                                    <x-ui.select :name="'metadata['.$item['id'].']'" :id="'metadata-'.$item['id']" :options="collect($item['options'] ?? [])->pluck('label', 'value')->all()" :value="$item['value'] ?? ''" :aria-invalid="$error ? 'true' : null" />
                                @else
                                    <x-ui.input :name="'metadata['.$item['id'].']'" :id="'metadata-'.$item['id']" :value="$item['value'] ?? ''" :required="$item['required'] ?? false" :aria-invalid="$error ? 'true' : null" />
                                @endif
                                @if ($error)<p id="metadata-{{ $item['id'] }}-error" class="text-sm text-destructive">{{ $error }}</p>@endif
                            </div>
                        @endforeach
                    </x-ui.card.content>
                </div>
            </x-ui.card>
        </div>
    @endif

    <div class="flex justify-end"><x-ui.button type="submit" :disabled="$submitting" :aria-busy="$submitting ? 'true' : null">{{ $submitting ? 'Submitting…' : $submitLabel }}</x-ui.button></div>
</x-ui.form>
