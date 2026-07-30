<div class="flex items-center gap-2.5">
    <span class="group relative grid size-4 shrink-0 place-items-center">
        <input type="checkbox" value="{{ $value }}" @checked($isChecked) {{ $formControlAttributes }} {{ $attributes->class('peer size-4 appearance-none rounded-[4px] border border-input bg-input-background outline-none transition-shadow checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-75 dark:bg-input/30') }}>
        <svg aria-hidden="true" viewBox="0 0 14 14" fill="none" class="pointer-events-none absolute size-3.5 stroke-primary-foreground opacity-0 peer-checked:opacity-100"><path d="M3 7.5 5.6 10 11 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    @if($label)<x-ui.label :for="$id" :value="$label" />@endif
</div>
