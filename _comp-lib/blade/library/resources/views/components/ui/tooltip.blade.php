@props(['open' => false, 'placement' => 'top', 'delay' => 0])
<span data-slot="tooltip" x-data="uiFloating(@js((bool)$open), @js($placement), 'tooltip', @js((int)$delay))" {{ $attributes }}>{{ $slot }}</span>
