@props(['name' => null, 'value' => '1', 'checked' => false, 'label' => null])
@php
    $isChecked = $name === null
        ? (bool) $checked
        : (bool) old(\App\View\Components\Ui\FormControl::sessionPath($name), $checked);
@endphp
<label class="inline-flex items-center gap-2">
    <input type="checkbox" role="switch" @if($name !== null) name="{{ $name }}" @endif value="{{ $value }}" @checked($isChecked) x-on:change="$dispatch('ui:switch:change', { value: $event.target.checked })" {{ $attributes->class('peer sr-only') }}>
    <span aria-hidden="true" class="pointer-events-none inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent bg-switch-background shadow-xs outline-none transition-all peer-checked:bg-primary peer-checked:[&>span]:translate-x-[calc(100%-2px)] peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"><span class="block size-4 rounded-full bg-background ring-0 transition-transform dark:bg-foreground"></span></span>
    @if($label)<span class="text-sm font-medium">{{ $label }}</span>@endif
</label>
