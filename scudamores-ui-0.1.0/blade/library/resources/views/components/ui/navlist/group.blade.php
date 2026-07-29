@props(['label' => null])
<section data-slot="navlist-group" {{ $attributes->class('grid gap-1') }}>@if($label)<h3 class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ $label }}</h3>@endif{{ $slot }}</section>
