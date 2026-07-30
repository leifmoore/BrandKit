@props(['open' => false])
<div data-slot="collapsible" x-data="uiDisclosure(@js((bool)$open), 'collapsible')" {{ $attributes }}>{{ $slot }}</div>
