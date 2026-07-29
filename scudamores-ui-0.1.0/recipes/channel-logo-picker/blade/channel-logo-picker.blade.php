@props(['logos' => [], 'selectedLogoId' => null, 'showLogo' => true, 'canUpload' => false, 'idPrefix' => 'channel-logo-picker'])

<div class="space-y-4" x-data="{ showLogo: @js($showLogo), selected: @js($selectedLogoId) }">
    <div class="flex items-center justify-between"><span><x-ui.label for="{{ $idPrefix }}-show-logo">Show logo</x-ui.label><span class="block text-xs text-muted-foreground">Display an organisation logo on this channel.</span></span><x-ui.switch id="{{ $idPrefix }}-show-logo" x-model="showLogo" x-on:ui:switch:change="$dispatch('show-logo-change', { value: $event.detail.value })" /></div>
    <div class="space-y-3" x-bind:aria-disabled="!showLogo" x-bind:class="!showLogo && 'pointer-events-none opacity-50'">
        <p class="text-sm font-medium">Organisation logo gallery</p>
        <div class="flex flex-wrap gap-3">
            @foreach ($logos as $logo)
                <button type="button" aria-label="Select {{ $logo['label'] }}" class="relative flex size-16 items-center justify-center overflow-hidden rounded-md border-2 bg-muted text-xs font-medium transition disabled:cursor-not-allowed" x-bind:disabled="!showLogo" x-bind:aria-pressed="selected === @js($logo['id'])" x-bind:class="selected === @js($logo['id']) ? 'border-ring' : 'border-border hover:border-muted-foreground'" x-on:click="selected = @js($logo['id']); $dispatch('logo-change', { value: selected })">
                    @if (!empty($logo['imageUrl']))
                        <img src="{{ $logo['imageUrl'] }}" alt="" class="size-full object-contain p-2">
                    @else
                        {{ strtoupper(substr($logo['label'], 0, 2)) }}
                    @endif
                    <span x-cloak x-show="selected === @js($logo['id'])" class="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border border-transparent bg-primary text-primary-foreground"><x-phosphor-check aria-hidden="true" class="size-3" /><span class="sr-only">Selected</span></span>
                </button>
            @endforeach
        </div>
        @if ($canUpload)
            <x-ui.input type="file" name="logo" accept="image/*" aria-label="Upload new logo" x-bind:disabled="!showLogo" />
        @endif
    </div>
</div>
