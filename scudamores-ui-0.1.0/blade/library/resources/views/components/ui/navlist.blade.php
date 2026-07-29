<nav aria-label="{{ $attributes->get('aria-label', 'Navigation') }}" data-slot="navlist" {{ $attributes->except('aria-label')->class('flex flex-col gap-1') }}>{{ $slot }}</nav>
