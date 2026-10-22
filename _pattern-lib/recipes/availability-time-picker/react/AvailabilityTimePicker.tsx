import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card } from "@scudamores/ui/components/ui/card";

export interface AvailabilityLocation {
  id: string;
  label: string;
}

export interface AvailabilityPricingMode {
  id: string;
  label: string;
}

export interface AvailabilityTime {
  id: string;
  label: string;
  available: boolean;
}

export interface AvailabilityBand {
  id: string;
  label: string;
  available: boolean;
  currency: string;
  priceMinor: number;
  discountedPriceMinor?: number | null;
  perPersonPriceMinor?: number | null;
  times: AvailabilityTime[];
}

export interface AvailabilityTimePickerProps {
  locations: AvailabilityLocation[];
  selectedLocationId: string;
  pricingModes?: AvailabilityPricingMode[];
  selectedPricingModeId?: string;
  timeBands: AvailabilityBand[];
  selectedTimeId: string | null;
  defaultExpandedBandId?: string | null;
  locale?: string;
  onLocationChange: (locationId: string) => void;
  onPricingModeChange?: (modeId: string) => void;
  onTimeChange: (timeId: string | null, bandId: string) => void;
}

function formatMoney(minor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(minor / 100);
}

export function AvailabilityTimePicker({
  locations,
  selectedLocationId,
  pricingModes = [],
  selectedPricingModeId,
  timeBands,
  selectedTimeId,
  defaultExpandedBandId = null,
  locale = "en-GB",
  onLocationChange,
  onPricingModeChange,
  onTimeChange,
}: AvailabilityTimePickerProps) {
  const headingId = useId();
  const timesId = useId();
  const [expandedBandId, setExpandedBandId] = useState<string | null>(defaultExpandedBandId);
  const expandedBand = timeBands.find((band) => band.id === expandedBandId) ?? null;

  return (
    <section className="space-y-4" aria-labelledby={headingId}>
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Location</p>
        <div className="flex flex-wrap gap-1.5" aria-label="Location">
          {locations.map((location) => {
            const selected = location.id === selectedLocationId;
            return (
              <button
                key={location.id}
                type="button"
                onClick={() => onLocationChange(location.id)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {location.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={headingId} className="text-sm font-medium">Select available time</h2>
        </div>

        {pricingModes.length > 0 && selectedPricingModeId ? (
          <div
            role="group"
            aria-label="Pricing display"
            className="mb-3 grid rounded-lg bg-muted p-1"
            style={{ gridTemplateColumns: `repeat(${pricingModes.length}, minmax(0, 1fr))` }}
          >
            {pricingModes.map((mode) => {
              const selected = selectedPricingModeId === mode.id;
              return (
                <Button
                  key={mode.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={selected}
                  className={selected
                    ? "bg-background text-foreground shadow-sm hover:bg-background"
                    : "text-foreground/80 hover:text-foreground"}
                  onClick={() => onPricingModeChange?.(mode.id)}
                >
                  {mode.label}
                </Button>
              );
            })}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-1.5">
          {timeBands.map((band) => {
            const expanded = band.id === expandedBandId;
            const containsSelection = band.times.some((time) => time.id === selectedTimeId);
            const price = selectedPricingModeId === "head" && band.perPersonPriceMinor != null
              ? `${formatMoney(band.perPersonPriceMinor, band.currency, locale)}/pp`
              : formatMoney(band.discountedPriceMinor ?? band.priceMinor, band.currency, locale);
            return (
              <Card key={band.id} className={`${!band.available ? "opacity-40" : ""} ${containsSelection ? "border-primary ring-1 ring-primary" : ""}`}>
                <button
                  type="button"
                  disabled={!band.available}
                  onClick={() => setExpandedBandId(expanded ? null : band.id)}
                  className="flex w-full flex-col items-center gap-0.5 p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  aria-expanded={expanded}
                  aria-controls={timesId}
                >
                  <span className="flex items-center gap-1 text-xs font-medium md:text-sm">
                    {band.label}
                    {expanded ? <ChevronUp aria-hidden="true" className="size-3" /> : <ChevronDown aria-hidden="true" className="size-3" />}
                  </span>
                  <span className="text-center text-xs">
                    {band.discountedPriceMinor != null && selectedPricingModeId !== "head" ? (
                      <span className="mr-1 text-muted-foreground line-through">{formatMoney(band.priceMinor, band.currency, locale)}</span>
                    ) : null}
                    <span className={band.discountedPriceMinor != null ? "font-medium text-epos-accent" : "text-muted-foreground"}>{price}</span>
                  </span>
                </button>
              </Card>
            );
          })}
        </div>

        <div id={timesId} className="mt-2 min-h-9">
          {expandedBand ? (
            <div className="grid grid-cols-4 gap-1.5" aria-label={`${expandedBand.label} times`}>
              {expandedBand.times.map((time) => (
                <Button
                  key={time.id}
                  type="button"
                  variant={selectedTimeId === time.id ? "default" : "outline"}
                  size="sm"
                  disabled={!time.available}
                  onClick={() => onTimeChange(selectedTimeId === time.id ? null : time.id, expandedBand.id)}
                  aria-pressed={selectedTimeId === time.id}
                  className="h-7 p-1 text-xs"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground">Choose a time band to see individual times.</p>}
        </div>
      </div>
    </section>
  );
}

export type AvailabilityTimePickerPreviewProps = Omit<
  AvailabilityTimePickerProps,
  "onLocationChange" | "onPricingModeChange" | "onTimeChange"
>;

export function AvailabilityTimePickerPreview({
  selectedLocationId: initialLocationId,
  selectedPricingModeId: initialPricingModeId,
  selectedTimeId: initialTimeId,
  ...props
}: AvailabilityTimePickerPreviewProps) {
  const [selectedLocationId, setSelectedLocationId] = useState(initialLocationId);
  const [selectedPricingModeId, setSelectedPricingModeId] = useState(initialPricingModeId);
  const [selectedTimeId, setSelectedTimeId] = useState(initialTimeId);

  return (
    <AvailabilityTimePicker
      {...props}
      selectedLocationId={selectedLocationId}
      selectedPricingModeId={selectedPricingModeId}
      selectedTimeId={selectedTimeId}
      onLocationChange={setSelectedLocationId}
      onPricingModeChange={setSelectedPricingModeId}
      onTimeChange={(timeId) => setSelectedTimeId(timeId)}
    />
  );
}
