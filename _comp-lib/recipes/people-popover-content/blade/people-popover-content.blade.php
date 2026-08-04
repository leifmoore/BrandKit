@props(['people' => ['adults' => 1, 'children' => 0, 'infants' => 0, 'pets' => 0], 'accessibilityAccess' => false, 'idPrefix' => 'people-picker'])

<div class="space-y-4" x-data='{ people: @json($people), accessibility: @json($accessibilityAccess) }'>
    <div><h3 class="text-base font-semibold">People</h3><p class="text-sm text-muted-foreground">Select the people included in this booking.</p></div>
    @foreach (['adults' => 'Adults', 'children' => 'Children', 'infants' => 'Infants', 'pets' => 'Pets'] as $key => $label)
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ $label }}</span>
            <span class="flex items-center gap-3">
                <x-ui.button variant="outline" size="icon" class="size-8" aria-label="Remove {{ strtolower($label) }}" x-bind:disabled="people.{{ $key }} <= {{ $key === 'adults' ? 1 : 0 }}" x-on:click="people.{{ $key }} = Math.max({{ $key === 'adults' ? 1 : 0 }}, people.{{ $key }} - 1); $dispatch('people-change', { people: { ...people } })">-</x-ui.button>
                <span class="w-8 text-center text-sm" x-text="people.{{ $key }}">{{ $people[$key] ?? 0 }}</span>
                <x-ui.button variant="outline" size="icon" class="size-8" aria-label="Add {{ strtolower($label) }}" x-on:click="people.{{ $key }}++; $dispatch('people-change', { people: { ...people } })">+</x-ui.button>
            </span>
        </div>
    @endforeach
    <div class="flex items-center justify-between border-t pt-3">
        <span class="flex items-center gap-2">
            <x-ui.label for="{{ $idPrefix }}-access">Accessibility access</x-ui.label>
            <x-ui.tooltip>
                <x-ui.tooltip.trigger id="{{ $idPrefix }}-access-info" class="inline-flex items-center justify-center rounded-sm"><x-phosphor-info aria-hidden="true" class="size-4 text-muted-foreground" /><span class="sr-only">About accessibility access</span></x-ui.tooltip.trigger>
                <x-ui.tooltip.content id="{{ $idPrefix }}-access-info">Limit results to step-free or wheelchair-accessible options.</x-ui.tooltip.content>
            </x-ui.tooltip>
        </span>
        <x-ui.switch id="{{ $idPrefix }}-access" x-model="accessibility" x-on:ui:switch:change="accessibility = $event.detail.value; $dispatch('accessibility-change', { value: accessibility })" />
    </div>
</div>
