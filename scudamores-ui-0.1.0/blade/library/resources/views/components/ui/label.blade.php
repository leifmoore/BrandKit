@props(['for' => null, 'value' => null])
<label for="{{ $for }}" {{ $attributes->class('flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50') }}>{{ $value ?? $slot }}</label>
