import * as React from "react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@scudamores/ui/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@scudamores/ui/components/ui/table";

export type HeatMapAxis = "visit" | "transaction";
export type HeatMapValueMode = "bookings" | "revenue";

export interface HeatMapDataset {
  axis: HeatMapAxis;
  valueMode: HeatMapValueMode;
  values: number[][];
}

export interface VisitTimeHeatMapProps {
  days: string[];
  hours: string[];
  datasets: HeatMapDataset[];
  axis: HeatMapAxis;
  valueMode: HeatMapValueMode;
  currency?: string;
  locale?: string;
  onAxisChange: (axis: HeatMapAxis) => void;
  onValueModeChange: (mode: HeatMapValueMode) => void;
  formatValue?: (value: number, mode: HeatMapValueMode) => string;
}

function defaultFormat(value: number, mode: HeatMapValueMode, locale: string, currency: string) {
  if (mode === "bookings") return String(value);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export function VisitTimeHeatMap({
  days,
  hours,
  datasets,
  axis,
  valueMode,
  currency = "GBP",
  locale = "en-GB",
  onAxisChange,
  onValueModeChange,
  formatValue,
}: VisitTimeHeatMapProps) {
  const dataset = datasets.find((item) => item.axis === axis && item.valueMode === valueMode);
  const values = dataset?.values ?? days.map(() => hours.map(() => 0));
  const maximum = Math.max(1, ...values.flat());
  const display = (value: number) => formatValue?.(value, valueMode) ?? defaultFormat(value, valueMode, locale, currency);

  let peak = { day: days[0] ?? "", hour: hours[0] ?? "", value: 0 };
  values.forEach((row, dayIndex) => row.forEach((value, hourIndex) => {
    if (value > peak.value) peak = { day: days[dayIndex] ?? "", hour: hours[hourIndex] ?? "", value };
  }));

  const title = `${axis === "visit" ? "Visit" : "Transaction"} time distribution`;
  const summaryId = React.useId();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1" aria-label="Date axis">
              {(["visit", "transaction"] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={axis === item ? "default" : "outline"}
                  className="h-7 px-2.5 text-xs"
                  aria-pressed={axis === item}
                  onClick={() => onAxisChange(item)}
                >
                  {item === "visit" ? "Visit date" : "Transaction date"}
                </Button>
              ))}
            </div>
            <span aria-hidden="true" className="h-6 w-px bg-border" />
            <div className="flex gap-1" aria-label="Value shown">
              {(["bookings", "revenue"] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={valueMode === item ? "default" : "outline"}
                  className="h-7 px-2.5 text-xs capitalize"
                  aria-pressed={valueMode === item}
                  onClick={() => onValueModeChange(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p id={summaryId} className="text-xs text-muted-foreground" aria-live="polite">
          Peak: {peak.day} at {peak.hour}, {display(peak.value)} {valueMode}.
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[640px]" role="img" aria-label={title} aria-describedby={summaryId}>
            <div className="grid" style={{ gridTemplateColumns: `2.75rem repeat(${hours.length}, minmax(2rem, 1fr))` }} aria-hidden="true">
              <span />
              {hours.map((hour) => <span key={hour} className="pb-1 text-center text-[10px] text-muted-foreground">{hour}</span>)}
              {days.map((day, dayIndex) => (
                <React.Fragment key={day}>
                  <span className="self-center pr-1 text-right text-xs text-muted-foreground">{day}</span>
                  {hours.map((hour, hourIndex) => {
                    const value = values[dayIndex]?.[hourIndex] ?? 0;
                    const intensity = value === 0 ? 0.05 : 0.1 + 0.9 * (value / maximum);
                    return (
                      <span
                        key={`${day}-${hour}`}
                        className={`flex aspect-square items-center justify-center border border-background text-[10px] font-medium tabular-nums ${
                          intensity >= 0.94 ? "text-white" : "text-black dark:text-white"
                        }`}
                        style={{
                          backgroundColor: `rgba(37, 99, 235, ${intensity})`,
                        }}
                      >
                        {display(value)}
                      </span>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="text-xs text-muted-foreground">0</span>
              <span className="h-3 w-40 rounded-md bg-gradient-to-r from-blue-600/5 to-blue-600" />
              <span className="text-xs text-muted-foreground">{display(maximum)}</span>
            </div>
          </div>
        </div>

        <details className="rounded-lg border px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium">View values as a table</summary>
          <div className="mt-3">
            <Table>
              <caption className="sr-only">{title}: {valueMode} by day and hour</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Day</TableHead>
                  {hours.map((hour) => <TableHead key={hour} scope="col" className="text-right">{hour}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day, dayIndex) => (
                  <TableRow key={day}>
                    <TableHead scope="row" className="font-medium text-foreground">{day}</TableHead>
                    {hours.map((hour, hourIndex) => (
                      <TableCell key={hour} className="text-right tabular-nums">{display(values[dayIndex]?.[hourIndex] ?? 0)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

export interface VisitTimeHeatMapPreviewProps extends Omit<VisitTimeHeatMapProps, "axis" | "valueMode" | "onAxisChange" | "onValueModeChange" | "formatValue"> {
  initialAxis: HeatMapAxis;
  initialValueMode: HeatMapValueMode;
}

export function VisitTimeHeatMapPreview({ initialAxis, initialValueMode, ...props }: VisitTimeHeatMapPreviewProps) {
  const [axis, setAxis] = React.useState(initialAxis);
  const [valueMode, setValueMode] = React.useState(initialValueMode);
  return (
    <VisitTimeHeatMap
      {...props}
      axis={axis}
      valueMode={valueMode}
      onAxisChange={setAxis}
      onValueModeChange={setValueMode}
    />
  );
}
