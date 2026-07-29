@props(['label' => 'Notifications'])
<section aria-label="{{ $label }}" aria-live="polite" aria-relevant="additions text" data-slot="toaster" {{ $attributes->class('pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:w-96') }}>{{ $slot }}</section>
