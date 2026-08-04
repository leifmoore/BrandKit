@props(['value' => 0, 'max' => 100, 'label' => 'Progress'])
<progress value="{{ max(0, min((float)$value, (float)$max)) }}" max="{{ $max }}" aria-label="{{ $label }}" data-slot="progress" {{ $attributes->class('h-2 w-full overflow-hidden rounded-full bg-primary/20 accent-primary') }}>{{ $value }}%</progress>
