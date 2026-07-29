@props(['open' => false])
<div role="none" x-data="uiDisclosure(@js((bool)$open), 'dropdown-menu-sub')" {{ $attributes->class('relative') }}>{{ $slot }}</div>
