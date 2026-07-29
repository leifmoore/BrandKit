@props(['items' => [], 'defaultId' => null, 'emptyMessage' => 'Nothing to configure yet.'])

@if (count($items) === 0)
    <p class="text-sm text-muted-foreground">{{ $emptyMessage }}</p>
@else
<div class="space-y-2">
    @foreach ($items as $item)
        @php($isDefault = $item['id'] === $defaultId)
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
            <span class="min-w-0"><span class="block truncate text-sm font-medium">{{ $item['label'] }}</span>@if (!empty($item['sublabel']))<span class="block truncate text-xs text-muted-foreground">{{ $item['sublabel'] }}</span>@endif</span>
            <span class="flex shrink-0 items-center gap-3">
                @if ($isDefault)
                    <x-ui.badge variant="secondary">Default</x-ui.badge>
                @elseif (!empty($item['lockedReason']))
                    <span class="max-w-56 text-right text-xs italic text-muted-foreground">{{ $item['lockedReason'] }}</span>
                @else
                    <x-ui.button variant="ghost" size="sm" :disabled="!$item['available']" x-on:click="$dispatch('set-default', { id: @js($item['id']) })">Set default</x-ui.button>
                @endif
                <span class="flex items-center gap-2">
                    <span class="w-20 text-right text-xs text-muted-foreground">{{ $item['available'] ? 'Available' : 'Unavailable' }}</span>
                    <x-ui.switch :checked="$item['available']" :disabled="$isDefault && $item['available']" aria-label="{{ $item['label'] }} availability" x-on:ui:switch:change="$dispatch('availability-change', { id: @js($item['id']), available: $event.detail.value })" />
                </span>
            </span>
        </div>
    @endforeach
</div>
@endif
