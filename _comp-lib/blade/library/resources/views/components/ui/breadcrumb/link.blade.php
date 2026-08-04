@props(['href'])
<a href="{{ $href }}" data-slot="breadcrumb-link" {{ $attributes->class('transition-colors hover:text-foreground') }}>{{ $slot }}</a>
