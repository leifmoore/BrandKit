@props(['name' => 'date', 'value' => '', 'min' => null, 'max' => null, 'label' => 'Choose date'])
<div data-slot="calendar" aria-label="{{ $label }}" x-data="uiCalendar(@js($value), @js($min), @js($max))" {{ $attributes->class('w-fit p-3') }}>
    <input type="hidden" name="{{ $name }}" x-model="value">
    <div class="mb-4 flex items-center justify-between px-1">
        <button type="button" aria-label="Previous month" x-on:click="move(-1)" class="inline-flex size-7 items-center justify-center rounded-md border bg-transparent p-0 opacity-50 outline-none hover:bg-accent hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50"><x-phosphor-caret-left aria-hidden="true" class="size-4" /></button>
        <span class="text-sm font-medium" aria-live="polite" x-text="monthLabel"></span>
        <button type="button" aria-label="Next month" x-on:click="move(1)" class="inline-flex size-7 items-center justify-center rounded-md border bg-transparent p-0 opacity-50 outline-none hover:bg-accent hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50"><x-phosphor-caret-right aria-hidden="true" class="size-4" /></button>
    </div>
    <div role="grid" aria-label="{{ $label }}" class="grid grid-cols-7 gap-y-2">
        <div role="row" class="contents"><template x-for="weekday in weekdays" :key="weekday"><span role="columnheader" class="flex size-8 items-center justify-center text-[.8rem] font-normal text-muted-foreground" x-text="weekday"></span></template></div>
        <template x-for="(week, weekIndex) in weeks" :key="weekIndex"><div role="row" class="contents"><template x-for="day in week" :key="day.iso"><div role="gridcell" x-bind:aria-selected="value === day.iso" class="contents"><button type="button" x-on:click="select(day)" x-bind:disabled="day.disabled" x-bind:aria-label="day.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })" x-bind:class="{ 'text-muted-foreground': day.outside, 'bg-primary text-primary-foreground hover:bg-primary': value === day.iso, 'bg-accent text-accent-foreground': value !== day.iso && day.iso === new Date().toISOString().slice(0,10) }" class="inline-flex size-8 items-center justify-center rounded-md text-sm font-normal outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50" x-text="day.label"></button></div></template></div></template>
    </div>
</div>
