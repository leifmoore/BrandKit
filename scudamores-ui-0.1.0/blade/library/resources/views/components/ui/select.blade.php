@php $selectClasses = 'flex min-h-9 w-full rounded-lg border border-input bg-input-background px-3 py-1 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30'; @endphp
@if($label)<x-ui.field><x-ui.label :for="$id" :value="$label" />@endif
<select @if($multiple) multiple @endif {{ $formControlAttributes }} {{ $attributes->class($selectClasses) }}>
    @if($placeholder && !$multiple)<option value="" disabled @selected($isSelected(''))>{{ $placeholder }}</option>@endif
    @if($options)
        @foreach($options as $optionValue => $optionLabel)<option value="{{ $optionValue }}" @selected($isSelected($optionValue))>{{ $optionLabel }}</option>@endforeach
    @else{{ $slot }}@endif
</select>
@if($label)<x-ui.error :for="$name" :bag="$bag" /></x-ui.field>@endif
