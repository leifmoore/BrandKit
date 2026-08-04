@props(['src', 'alt' => ''])
<img src="{{ $src }}" alt="{{ $alt }}" data-slot="avatar-image" {{ $attributes->class('aspect-square size-full object-cover') }}>
