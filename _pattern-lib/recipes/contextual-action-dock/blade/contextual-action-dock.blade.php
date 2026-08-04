@props([
    'summary' => null,
    'amountMinor' => null,
    'currency' => 'GBP',
    'primaryAction',
    'secondaryAction' => null,
    'position' => 'fixed',
])

@php
    $placement = $position === 'fixed'
        ? 'fixed inset-x-4 bottom-[max(2rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-xl'
        : 'relative mx-auto w-full max-w-xl';
@endphp

<aside aria-label="Current workflow actions" class="{{ $placement }}" data-pattern="contextual-action-dock">
    <x-ui.card class="shadow-lg">
        <x-ui.card.content class="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            @if ($summary || $amountMinor !== null)
                <div class="min-w-0 flex-1" aria-live="polite">
                    @if ($summary)<div class="truncate text-sm text-muted-foreground">{{ $summary }}</div>@endif
                    @if ($amountMinor !== null)<div class="font-semibold tabular-nums">{{ $currency === 'GBP' ? '£' : $currency.' ' }}{{ number_format($amountMinor / 100, 2) }}</div>@endif
                </div>
            @endif
            <div class="grid shrink-0 grid-cols-1 gap-2 sm:flex">
                @if ($secondaryAction)
                    <x-ui.button
                        type="button"
                        variant="outline"
                        :disabled="($secondaryAction['disabled'] ?? false) || ($secondaryAction['loading'] ?? false)"
                        :aria-busy="($secondaryAction['loading'] ?? false) ? 'true' : null"
                        x-on:click="$dispatch('ui:contextual-action-dock:action', { id: @js($secondaryAction['id']) })"
                    >{{ ($secondaryAction['loading'] ?? false) ? 'Working…' : $secondaryAction['label'] }}</x-ui.button>
                @endif
                <x-ui.button
                    type="button"
                    :disabled="($primaryAction['disabled'] ?? false) || ($primaryAction['loading'] ?? false)"
                    :aria-busy="($primaryAction['loading'] ?? false) ? 'true' : null"
                    x-on:click="$dispatch('ui:contextual-action-dock:action', { id: @js($primaryAction['id']) })"
                >{{ ($primaryAction['loading'] ?? false) ? 'Working…' : $primaryAction['label'] }}</x-ui.button>
            </div>
        </x-ui.card.content>
    </x-ui.card>
</aside>
