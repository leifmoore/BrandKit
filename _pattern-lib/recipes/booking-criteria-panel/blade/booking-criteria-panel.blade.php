@props([
    'date' => null,
    'minimumDate' => null,
    'party' => [],
    'accessibilityAccess' => false,
    'title' => 'Plan your visit',
    'description' => 'Choose a date and tell us who is coming.',
])

<x-ui.card
    {{ $attributes }}
    x-data="{
        date: @js($date),
        party: @js(collect($party)->mapWithKeys(fn ($item) => [(string) $item['id'] => (int) $item['count']])->all()),
        accessible: @js((bool) $accessibilityAccess),
        get totalPeople() { return Object.values(this.party).reduce((total, value) => total + Number(value), 0) },
        updateParty(id, count) {
            this.party[id] = Number(count);
            this.$dispatch('ui:booking-criteria-panel:change', { field: 'party', categoryId: id, count: Number(count) });
        }
    }"
>
    <x-ui.card.header>
        <x-ui.card.title>{{ $title }}</x-ui.card.title>
        <x-ui.card.description>{{ $description }}</x-ui.card.description>
    </x-ui.card.header>
    <x-ui.card.content class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
            <x-ui.label value="Date" />
            <x-ui.popover>
                <x-ui.popover.trigger class="inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border bg-background px-3 text-left text-sm font-normal outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    <x-phosphor-calendar-blank aria-hidden="true" class="size-4" />
                    <span x-text="date || 'Pick a date'"></span>
                </x-ui.popover.trigger>
                <x-ui.popover.content class="w-auto p-0">
                    <div
                        x-on:ui:calendar:change="
                            date = $event.detail.value;
                            $dispatch('ui:booking-criteria-panel:change', { field: 'date', value: date });
                        "
                    >
                        <x-ui.calendar name="date" :value="$date ?? ''" :min="$minimumDate" label="Choose booking date" />
                    </div>
                </x-ui.popover.content>
            </x-ui.popover>
        </div>

        <div class="space-y-2">
            <x-ui.label value="Who" />
            <x-ui.popover>
                <x-ui.popover.trigger class="inline-flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm font-normal outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    <span class="flex items-center gap-2">
                        <x-phosphor-users aria-hidden="true" class="size-4" />
                        <span><span x-text="totalPeople"></span> <span x-text="totalPeople === 1 ? 'person' : 'people'"></span></span>
                    </span>
                    <x-phosphor-caret-down aria-hidden="true" class="size-4" />
                </x-ui.popover.trigger>
                <x-ui.popover.content class="w-80 p-4">
                    <div class="space-y-4" aria-label="Party composition">
                        @foreach ($party as $category)
                            <div class="flex items-center justify-between gap-4">
                                <span class="min-w-0">
                                    <span class="block text-sm font-medium">{{ $category['label'] }}</span>
                                    @if (!empty($category['description']))
                                        <span class="block text-xs text-muted-foreground">{{ $category['description'] }}</span>
                                    @endif
                                </span>
                                <div x-on:ui:stepper:change.stop="updateParty(@js((string) $category['id']), $event.detail.value)">
                                    <x-ui.stepper
                                        :name="'party['.$category['id'].']'"
                                        :value="(int) $category['count']"
                                        :min="(int) ($category['min'] ?? 0)"
                                        :max="$category['max'] ?? null"
                                        :label="$category['label']"
                                    />
                                </div>
                            </div>
                        @endforeach
                        <div class="border-t pt-4">
                            <x-ui.checkbox
                                name="accessibility_access"
                                value="1"
                                :checked="$accessibilityAccess"
                                label="Accessibility access required"
                                x-model="accessible"
                                x-on:change="$dispatch('ui:booking-criteria-panel:change', { field: 'accessibilityAccess', value: accessible })"
                            />
                            <p class="ml-6 mt-1 text-xs text-muted-foreground">Let the host adapt available products and arrival guidance.</p>
                        </div>
                    </div>
                </x-ui.popover.content>
            </x-ui.popover>
        </div>
    </x-ui.card.content>
</x-ui.card>
