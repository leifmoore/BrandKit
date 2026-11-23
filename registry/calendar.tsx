"use client";

// Brand Kit port of the handoff calendar (_comp-lib/react/components/ui/calendar.tsx)
// to react-day-picker 9, which supports React 19. Structure follows shadcn's v9
// calendar; the look, the showYearMonthDropdowns option and initialFocus are kept
// from the handoff so existing callers and patterns work unchanged.

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type DropdownProps,
} from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Month and year menus in the caption, styled like Select. */
  showYearMonthDropdowns?: boolean;
  /** @deprecated react-day-picker 9 renamed this to `autoFocus`. */
  initialFocus?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showYearMonthDropdowns,
  initialFocus,
  autoFocus,
  captionLayout,
  components: userComponents,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  // Year menus default to five years back and five ahead. react-day-picker 9 also
  // stops the arrows at this range, so it must reach future booking dates.
  const year = new Date().getFullYear();
  const startMonth = props.startMonth ?? props.fromMonth ?? props.fromDate ?? (props.fromYear ? undefined : new Date(year - 5, 0));
  const endMonth = props.endMonth ?? props.toMonth ?? props.toDate ?? (props.toYear ? undefined : new Date(year + 5, 11));

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      autoFocus={autoFocus ?? initialFocus}
      captionLayout={captionLayout ?? (showYearMonthDropdowns ? "dropdown" : "label")}
      {...(showYearMonthDropdowns ? { startMonth, endMonth } : {})}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-2 sm:flex-row", defaultClassNames.months),
        month: cn("flex flex-col gap-4", defaultClassNames.month),
        nav: cn("pointer-events-none absolute inset-x-1 top-0 flex h-7 items-center justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "pointer-events-auto relative z-10 size-7 bg-transparent p-0 opacity-50 hover:opacity-100 aria-disabled:pointer-events-none aria-disabled:opacity-25",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "pointer-events-auto relative z-10 size-7 bg-transparent p-0 opacity-50 hover:opacity-100 aria-disabled:pointer-events-none aria-disabled:opacity-25",
          defaultClassNames.button_next,
        ),
        month_caption: cn("flex h-7 w-full items-center justify-center px-8", defaultClassNames.month_caption),
        caption_label: cn("text-sm font-medium", defaultClassNames.caption_label),
        dropdowns: cn("flex items-center gap-1", defaultClassNames.dropdowns),
        months_dropdown: "w-[115px]",
        years_dropdown: "w-[72px]",
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground", defaultClassNames.weekday),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 data-[selected=true]:bg-accent",
          props.mode === "range"
            ? "first:data-[selected=true]:rounded-l-md last:data-[selected=true]:rounded-r-md"
            : "data-[selected=true]:rounded-md",
          defaultClassNames.day,
        ),
        range_start: cn("rounded-l-md", defaultClassNames.range_start),
        range_middle: defaultClassNames.range_middle,
        range_end: cn("rounded-r-md", defaultClassNames.range_end),
        today: cn("[&>button]:bg-accent [&>button]:text-accent-foreground", defaultClassNames.today),
        outside: cn("text-muted-foreground", defaultClassNames.outside),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : orientation === "right" ? ChevronRight : ChevronDown;
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        },
        DayButton: CalendarDayButton,
        Dropdown: CalendarDropdown,
        ...userComponents,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "size-8 p-0 font-normal",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary data-[selected-single=true]:hover:text-primary-foreground data-[selected-single=true]:focus:bg-primary data-[selected-single=true]:focus:text-primary-foreground",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

// react-day-picker renders a native <select>; swap in our Select so the menus
// match the rest of the library.
function CalendarDropdown({ value, onChange, options, className, "aria-label": ariaLabel, disabled }: DropdownProps) {
  return (
    <Select
      value={value === undefined ? undefined : String(value)}
      disabled={disabled}
      onValueChange={(next) => onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>)}
    >
      <SelectTrigger aria-label={ariaLabel} className={cn("h-7 border-0 px-2 text-xs shadow-none focus:ring-0", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { Calendar };
