import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Calendar } from "@scudamores/ui/components/ui/calendar";
import { Card, CardContent } from "@scudamores/ui/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@scudamores/ui/components/ui/popover";

export type EmptySelectionBehavior = "include-all" | "include-none";

export interface ReportFilterOption {
  id: string;
  label: string;
  description?: string;
}

export interface ReportFilterDefinition {
  id: string;
  label: string;
  options: ReportFilterOption[];
  emptySelectionBehavior: EmptySelectionBehavior;
}

export interface ReportDatePreset {
  id: string;
  label: string;
  from: string;
  to: string;
}

export interface ReportFilterValue {
  from: string;
  to: string;
  selections: Record<string, string[]>;
}

export interface ReportFilterBuilderProps {
  value: ReportFilterValue;
  presets: ReportDatePreset[];
  filters: ReportFilterDefinition[];
  matchCount?: number;
  stale?: boolean;
  locale?: string;
  onChange: (value: ReportFilterValue) => void;
  onApply: (value: ReportFilterValue) => void;
  onClear?: (value: ReportFilterValue) => void;
}

function sameRange(value: ReportFilterValue, preset: ReportDatePreset) {
  return value.from === preset.from && value.to === preset.to;
}

function selectionSummary(filter: ReportFilterDefinition, selected: string[]) {
  if (selected.length > 0) return `${selected.length} selected`;
  return filter.emptySelectionBehavior === "include-all" ? "All included" : "None included";
}

export function ReportFilterBuilder({
  value,
  presets,
  filters,
  matchCount,
  stale = false,
  locale = "en-GB",
  onChange,
  onApply,
  onClear,
}: ReportFilterBuilderProps) {
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);

  const toggle = (filterId: string, optionId: string) => {
    const current = value.selections[filterId] ?? [];
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onChange({
      ...value,
      selections: { ...value.selections, [filterId]: next },
    });
  };

  const clearSelections = () => {
    const next = {
      ...value,
      selections: Object.fromEntries(filters.map((filter) => [filter.id, []])),
    };
    onChange(next);
    onClear?.(next);
  };

  const activeSelections = Object.values(value.selections).reduce(
    (total, selected) => total + selected.length,
    0,
  );

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5" aria-label="Quick date ranges">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant={sameRange(value, preset) ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              aria-pressed={sameRange(value, preset)}
              onClick={() => onChange({ ...value, from: preset.from, to: preset.to })}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <fieldset className="min-w-0">
            <legend className="mb-1 text-xs font-medium">Date range</legend>
            <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-8 w-full justify-start text-left text-sm font-normal">
                  <CalendarIcon aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
                  {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value.from}T12:00:00`))} – {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value.to}T12:00:00`))}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-[calc(100vw-2rem)] overflow-x-auto p-0" align="start">
                <Calendar
                  mode="range"
                  showYearMonthDropdowns
                  numberOfMonths={2}
                  selected={{ from: new Date(`${value.from}T12:00:00`), to: new Date(`${value.to}T12:00:00`) }}
                  onSelect={(range) => {
                    const from = range?.from ? format(range.from, "yyyy-MM-dd") : value.from;
                    const to = range?.to ? format(range.to, "yyyy-MM-dd") : from;
                    onChange({ ...value, from, to });
                    if (range?.from && range.to) setDateRangeOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </fieldset>

          {filters.map((filter) => {
            const selected = value.selections[filter.id] ?? [];
            return (
              <fieldset key={filter.id} className="min-w-0">
                <legend className="mb-1 flex w-full items-center gap-2 text-xs font-medium">
                  <span>{filter.label}</span>
                  <span className="font-normal text-muted-foreground">
                    {selectionSummary(filter, selected)}
                  </span>
                </legend>
                <div className="flex flex-wrap gap-1">
                  {filter.options.map((option) => {
                    const active = selected.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        title={option.description}
                        onClick={() => toggle(filter.id, option.id)}
                        className={
                          "rounded-full border px-2 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                          (active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:border-primary/50")
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
            {typeof matchCount === "number" && (
              <span>{matchCount} result{matchCount === 1 ? "" : "s"} matched</span>
            )}
            {activeSelections > 0 && (
              <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={clearSelections}>
                Clear filters
              </Button>
            )}
            {stale && <Badge variant="warning">Filters changed</Badge>}
          </div>
          <Button type="button" size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApply(value)}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            Generate report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export interface ReportFilterBuilderPreviewProps {
  value: ReportFilterValue;
  presets: ReportDatePreset[];
  filters: ReportFilterDefinition[];
  matchCount?: number;
  stale?: boolean;
  locale?: string;
}

export function ReportFilterBuilderPreview(props: ReportFilterBuilderPreviewProps) {
  const [value, setValue] = React.useState(props.value);
  const [applied, setApplied] = React.useState(props.value);
  const [initiallyStale, setInitiallyStale] = React.useState(Boolean(props.stale));
  const stale = initiallyStale || JSON.stringify(value) !== JSON.stringify(applied);

  return (
    <ReportFilterBuilder
      {...props}
      value={value}
      stale={stale}
      onChange={setValue}
      onApply={(next) => {
        setApplied(next);
        setInitiallyStale(false);
      }}
    />
  );
}
