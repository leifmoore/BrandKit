import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
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

export interface QuoteLookupRecord {
  reference: string;
  status: "pending" | "expired" | "redeemed";
  customerName: string;
  customerEmail: string;
  bookingLabel: string;
  productLabels: string[];
  priceFromMinor: number;
  priceToMinor: number;
  currency: string;
  expiresAtLabel: string;
}

export type QuoteLookupResult =
  | { status: "found"; quote: QuoteLookupRecord }
  | { status: "not-found" }
  | { status: "expired"; quote: QuoteLookupRecord }
  | { status: "redeemed"; quote: QuoteLookupRecord };

export interface QuoteLookupProps {
  initialReference?: string;
  initialResult?: QuoteLookupResult | null;
  locale?: string;
  triggerLabel?: string;
  onLookup: (reference: string) => QuoteLookupResult | Promise<QuoteLookupResult>;
  onSelect: (quote: QuoteLookupRecord) => void;
}

function formatMoney(minor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 100);
}

export function QuoteLookup({
  initialReference = "",
  initialResult = null,
  locale = "en-GB",
  triggerLabel = "Look up quote",
  onLookup,
  onSelect,
}: QuoteLookupProps) {
  const referenceInputId = useId();
  const errorId = useId();
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState(initialReference);
  const [result, setResult] = useState<QuoteLookupResult | null>(initialResult);
  const [searching, setSearching] = useState(false);

  const lookup = async () => {
    const normalized = reference.trim();
    if (!normalized || searching) return;
    setSearching(true);
    try {
      setResult(await onLookup(normalized));
    } finally {
      setSearching(false);
    }
  };

  const quote = result && result.status !== "not-found" ? result.quote : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setReference(initialReference);
          setResult(initialResult);
          setSearching(false);
        }
      }}
    >
      <DialogTrigger asChild><Button type="button" variant="outline">{triggerLabel}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Look up quote</DialogTitle>
          <DialogDescription>Enter the customer’s quote reference to continue its host-owned journey.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void lookup(); }}>
          <div className="space-y-2">
            <Label htmlFor={referenceInputId}>Quote reference</Label>
            <Input
              id={referenceInputId}
              value={reference}
              onChange={(event) => { setReference(event.target.value); setResult(null); }}
              autoComplete="off"
              placeholder="e.g. QT-1042"
              required
              aria-describedby={result?.status === "not-found" ? errorId : undefined}
            />
            {result?.status === "not-found" ? <p id={errorId} role="alert" className="text-sm text-destructive">No quote was found with that reference.</p> : null}
          </div>

          <Button type="submit" className="w-full" disabled={!reference.trim() || searching}>
            <Search aria-hidden="true" className="size-4" />
            {searching ? "Looking up…" : "Look up quote"}
          </Button>
        </form>

        {quote ? (
          <section className="space-y-3 rounded-lg border p-4" aria-live="polite" aria-label={`Quote ${quote.reference}`}>
            <div className="flex items-center justify-between gap-2">
              <strong>{quote.reference}</strong>
              <Badge variant={result?.status === "found" ? "success" : result?.status === "expired" ? "warning" : "secondary"}>{result?.status === "found" ? "Ready" : result?.status === "expired" ? "Expired" : "Redeemed"}</Badge>
            </div>
            <div className="text-sm">
              <p className="font-medium">{quote.customerName}</p>
              <p className="text-muted-foreground">{quote.bookingLabel}</p>
              <p className="text-muted-foreground">{quote.productLabels.join(", ")}</p>
            </div>
            <div className="flex justify-between border-t pt-3 text-sm">
              <span>Quoted price</span>
              <strong>{quote.priceFromMinor === quote.priceToMinor ? formatMoney(quote.priceFromMinor, quote.currency, locale) : `${formatMoney(quote.priceFromMinor, quote.currency, locale)} – ${formatMoney(quote.priceToMinor, quote.currency, locale)}`}</strong>
            </div>
            <p className="text-xs text-muted-foreground">Expires {quote.expiresAtLabel}</p>
            {result?.status === "found" ? <Button type="button" className="w-full" onClick={() => { onSelect(quote); setOpen(false); }}>Continue with quote</Button> : <p role="status" className="text-sm text-muted-foreground">This quote cannot be continued. The host should offer an appropriate recovery path.</p>}
          </section>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export interface QuoteLookupPreviewProps extends Omit<QuoteLookupProps, "onLookup" | "onSelect"> {
  previewRecords: QuoteLookupRecord[];
  onSelect?: (quote: QuoteLookupRecord) => void;
}

export function QuoteLookupPreview({ previewRecords, onSelect, initialReference, initialResult, ...props }: QuoteLookupPreviewProps) {
  return (
    <QuoteLookup
      {...props}
      initialReference={initialReference}
      initialResult={initialResult}
      onLookup={(reference) => {
        const quote = previewRecords.find((record) => record.reference.toLocaleLowerCase() === reference.toLocaleLowerCase());
        if (!quote) return { status: "not-found" };
        if (quote.status === "expired") return { status: "expired", quote };
        if (quote.status === "redeemed") return { status: "redeemed", quote };
        return { status: "found", quote };
      }}
      onSelect={onSelect ?? (() => undefined)}
    />
  );
}
