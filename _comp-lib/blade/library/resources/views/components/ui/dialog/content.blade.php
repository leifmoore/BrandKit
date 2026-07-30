@props(['closeLabel' => 'Close'])
<template x-teleport="body"><div x-cloak x-show="open" class="fixed inset-0 z-50" data-slot="dialog-portal">
    <div class="absolute inset-0 bg-black/25" data-slot="dialog-overlay" x-on:click="hide()" x-transition.opacity></div>
    <section role="dialog" aria-modal="true" tabindex="-1" x-ref="panel" x-trap.noscroll.inert="open" x-on:click.stop x-transition {{ $attributes->class('fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-lg sm:max-w-lg') }} data-slot="dialog-content">
        {{ $slot }}
        <button type="button" x-on:click="hide()" class="absolute right-4 top-4 rounded-xs opacity-70 outline-none transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"><x-phosphor-x aria-hidden="true" class="size-4" /><span class="sr-only">{{ $closeLabel }}</span></button>
    </section>
</div></template>
