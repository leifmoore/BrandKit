<label class="flex items-center gap-2.5 text-sm font-medium">
    <input type="radio" value="{{ $value }}" @checked($isChecked) {{ $formControlAttributes }} {{ $attributes->class('peer size-4 appearance-none rounded-full border border-border bg-input-background outline-none transition-shadow checked:border-primary checked:shadow-[inset_0_0_0_3px_var(--input-background),inset_0_0_0_8px_var(--primary)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30') }}>
    @if($label)<span>{{ $label }}</span>@else{{ $slot }}@endif
</label>
