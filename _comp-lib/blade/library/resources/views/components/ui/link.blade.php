@props(['href'])
<a href="{{ $href }}" {{ $attributes->class('font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50') }}>{{ $slot }}</a>
