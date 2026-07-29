@props(['name' => 'search', 'label' => 'Search', 'placeholder' => 'Search…'])
<div data-slot="search" {{ $attributes->class('relative') }}><x-phosphor-magnifying-glass aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><x-ui.input :name="$name" :placeholder="$placeholder" :aria-label="$label" class="pl-9" /></div>
