import { useId, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Checkbox } from "@scudamores/ui/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@scudamores/ui/components/ui/dialog";
import { Input } from "@scudamores/ui/components/ui/input";
import { Label } from "@scudamores/ui/components/ui/label";

export interface QuoteBookingSummary {
  partyLabel: string;
  dateLabel: string;
  productLabels: string[];
}

export interface QuoteTimeBand {
  id: string;
  label: string;
  available: boolean;
  priceMinor: number;
  currency: string;
}

export interface QuoteExpiryOption {
  id: string;
  label: string;
  expiresAt: string;
}

export interface QuoteDraft {
  customerName: string;
  customerEmail: string;
  selectedBandIds: string[];
  expiresAt: string;
}

export interface QuoteBuilderProps {
  summary: QuoteBookingSummary;
  timeBands: QuoteTimeBand[];
  initialSelectedBandIds: string[];
  expiryOptions: QuoteExpiryOption[];
  defaultExpiryOptionId: string;
  locale?: string;
  triggerLabel?: string;
  onSubmit: (draft: QuoteDraft) => void | Promise<void>;
}

function formatMoney(minor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 100);
}

export function QuoteBuilder({
  summary,
  timeBands,
  initialSelectedBandIds,
  expiryOptions,
  defaultExpiryOptionId,
  locale = "en-GB",
  triggerLabel = "Get quote",
  onSubmit,
}: QuoteBuilderProps) {
  const customerNameId = useId();
  const customerEmailId = useId();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedBandIds, setSelectedBandIds] = useState(initialSelectedBandIds);
  const [expiryOptionId, setExpiryOptionId] = useState(defaultExpiryOptionId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedBands = timeBands.filter((band) => selectedBandIds.includes(band.id));
  const prices = selectedBands.map((band) => band.priceMinor);
  const minimum = prices.length ? Math.min(...prices) : 0;
  const maximum = prices.length ? Math.max(...prices) : 0;
  const currency = selectedBands[0]?.currency ?? timeBands[0]?.currency ?? "GBP";
  const selectedExpiry = expiryOptions.find((option) => option.id === expiryOptionId);

  const submit = async () => {
    if (!selectedExpiry || selectedBandIds.length === 0 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({ customerName, customerEmail, selectedBandIds, expiresAt: selectedExpiry.expiresAt });
      setOpen(false);
    } catch {
      setSubmitError("The quote could not be created. Check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button type="button" variant="outline">{triggerLabel}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create quote</DialogTitle>
          <DialogDescription>Choose the offered times, recipient, and expiry. The host sends and stores the quote.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">{summary.partyLabel} · {summary.dateLabel}</p>
            <p className="mt-1 text-muted-foreground">{summary.productLabels.join(", ")}</p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Time bands</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {timeBands.map((band) => {
                const checked = selectedBandIds.includes(band.id);
                return (
                  <label key={band.id} className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm ${!band.available ? "opacity-50" : ""}`}>
                    <span className="flex items-center gap-2">
                      <Checkbox
                        aria-label={`Offer ${band.label}`}
                        checked={checked}
                        disabled={!band.available}
                        onCheckedChange={(next) => setSelectedBandIds((current) => next === true ? [...current, band.id] : current.filter((id) => id !== band.id))}
                      />
                      {band.label}
                    </span>
                    <span className="text-muted-foreground">{formatMoney(band.priceMinor, band.currency, locale)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex justify-between border-y py-3 text-sm" aria-live="polite">
            <span>{selectedBands.length} time band{selectedBands.length === 1 ? "" : "s"} offered</span>
            <strong>{selectedBands.length === 0 ? "No price" : minimum === maximum ? formatMoney(minimum, currency, locale) : `${formatMoney(minimum, currency, locale)} – ${formatMoney(maximum, currency, locale)}`}</strong>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor={customerNameId}>Customer name</Label><Input id={customerNameId} value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" required /></div>
            <div className="space-y-2"><Label htmlFor={customerEmailId}>Email address</Label><Input id={customerEmailId} type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} autoComplete="email" required /></div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Quote expiry</legend>
            <div className="flex flex-wrap gap-1.5">
              {expiryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setExpiryOptionId(option.id)}
                  aria-pressed={option.id === expiryOptionId}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${option.id === expiryOptionId ? "border-epos-accent bg-epos-accent text-epos-accent-foreground" : "border-border bg-background hover:border-epos-accent hover:text-epos-accent"}`}
                >{option.label}</button>
              ))}
            </div>
          </fieldset>

          <Button type="submit" className="w-full" disabled={selectedBandIds.length === 0 || submitting}>
            <Send aria-hidden="true" className="size-4" />
            {submitting ? "Creating…" : "Create quote"}
          </Button>
          {submitError ? <p role="alert" className="text-sm text-destructive">{submitError}</p> : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface QuoteBuilderPreviewProps extends Omit<QuoteBuilderProps, "onSubmit"> {
  onSubmit?: (draft: QuoteDraft) => void | Promise<void>;
}

export function QuoteBuilderPreview({ onSubmit, ...props }: QuoteBuilderPreviewProps) {
  return <QuoteBuilder {...props} onSubmit={onSubmit ?? (() => undefined)} />;
}
