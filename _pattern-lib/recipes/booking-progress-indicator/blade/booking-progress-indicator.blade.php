@props([
    'steps' => [],
    'currentStepId',
    'ariaLabel' => 'Booking progress',
    'showBack' => true,
])
@php
    $stepIds = array_values(array_map(fn ($step) => (string) $step['id'], $steps));
    $currentIndex = array_search((string) $currentStepId, $stepIds, true);
    $currentIndex = $currentIndex === false ? 0 : $currentIndex;
@endphp

<nav aria-label="{{ $ariaLabel }}" {{ $attributes->class('w-full py-2') }}>
    <div class="relative mx-auto max-w-md">
        @if ($showBack && $currentIndex > 0)
            <x-ui.button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute left-0 top-2 z-10 text-muted-foreground hover:text-foreground"
                aria-label="Go back one step"
                x-on:click="$dispatch('ui:booking-progress-indicator:action', { action: 'back' })"
            >
                <x-phosphor-caret-left aria-hidden="true" class="size-4" />
            </x-ui.button>
        @endif

        <ol class="flex items-start justify-center gap-8 sm:gap-16">
            @foreach ($steps as $index => $step)
                @php
                    $complete = $index < $currentIndex;
                    $current = $index === $currentIndex;
                    $markerClasses = $complete || $current
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground';
                @endphp
                <li class="flex flex-col items-center">
                    @if ($complete)
                        <button
                            type="button"
                            class="flex flex-col items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Return to {{ $step['label'] }}"
                            x-on:click="$dispatch('ui:booking-progress-indicator:change', { stepId: @js((string) $step['id']) })"
                        >
                            <span class="flex size-10 items-center justify-center rounded-full border-2 transition-colors {{ $markerClasses }}" aria-hidden="true">
                                <x-phosphor-check aria-hidden="true" class="size-5" />
                            </span>
                            <span class="mt-2 hidden max-w-24 text-center text-xs sm:block">{{ $step['label'] }}</span>
                        </button>
                    @else
                        <span
                            class="flex flex-col items-center"
                            @if ($current) aria-current="step" @endif
                            aria-label="{{ $step['label'] }}, {{ $current ? 'current' : 'upcoming' }}"
                        >
                            <span class="flex size-10 items-center justify-center rounded-full border-2 transition-colors {{ $markerClasses }}" aria-hidden="true">{{ $index + 1 }}</span>
                            <span class="mt-2 hidden max-w-24 text-center text-xs sm:block">{{ $step['label'] }}</span>
                        </span>
                    @endif
                </li>
            @endforeach
        </ol>
    </div>
</nav>
