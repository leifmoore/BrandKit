@props(['value' => null])
<div role="group" x-data="{ selected: @js($value) }" {{ $attributes }}>{{ $slot }}</div>
