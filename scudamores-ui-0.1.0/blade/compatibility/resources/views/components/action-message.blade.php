@props(['on'])
@if(session('status') === $on)
<x-ui.alert role="status" aria-live="polite" x-data="{ shown: true }" x-init="$dispatch(@js($on)); setTimeout(() => shown = false, 2000)" x-show="shown" x-transition.opacity {{ $attributes }}>{{ $slot->isEmpty() ? __('Saved.') : $slot }}</x-ui.alert>
@endif
