@props(['label' => null])
<fieldset {{ $attributes->class('grid gap-3') }} data-slot="radio-group">
    @if($label)<legend class="mb-1 text-sm font-medium">{{ $label }}</legend>@endif
    {{ $slot }}
</fieldset>
