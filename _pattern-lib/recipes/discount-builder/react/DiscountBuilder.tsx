import { useEffect, useId, useState } from "react";
import { AlertTriangle, Tag } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@scudamores/ui/components/ui/tabs";

export type DiscountValue =
  | { type: "amount"; amountMinor: number }
  | { type: "percentage"; percentage: number };

export interface DiscountBuilderProps {
  subtotalMinor: number;
  currency: string;
  currentDiscount: DiscountValue | null;
  effectivePersonUnits?: number;
  maximumPercentage?: number | null;
  approvalThresholdPercentage?: number | null;
  minimumTotalMinor?: number | null;
  locale?: string;
  triggerLabel?: string;
  onApply: (discount: DiscountValue, metadata: { requiresApproval: boolean }) => void;
  onRemove: () => void;
}

function formatMoney(minor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 100);
}

export function DiscountBuilder({
  subtotalMinor,
  currency,
  currentDiscount,
  effectivePersonUnits = 1,
  maximumPercentage = null,
  approvalThresholdPercentage = null,
  minimumTotalMinor = null,
  locale = "en-GB",
  triggerLabel = "Amend price",
  onApply,
  onRemove,
}: DiscountBuilderProps) {
  const valueInputId = useId();
  const [open, setOpen] = useState(false);
  const [basis, setBasis] = useState<"area" | "head">("area");
  const [type, setType] = useState<"amount" | "percentage">("amount");
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!open) return;
    setBasis("area");
    if (currentDiscount?.type === "amount") {
      setType("amount");
      setValue(currentDiscount.amountMinor / 100);
    } else if (currentDiscount?.type === "percentage") {
      setType("percentage");
      setValue(currentDiscount.percentage);
    } else {
      setValue(0);
    }
  }, [open, currentDiscount?.type, currentDiscount?.type === "amount" ? currentDiscount.amountMinor : null, currentDiscount?.type === "percentage" ? currentDiscount.percentage : null]);

  const units = Math.max(effectivePersonUnits, 1);
  const amountMinor = type === "amount"
    ? Math.min(Math.round(value * 100 * (basis === "head" ? units : 1)), subtotalMinor)
    : Math.round((subtotalMinor * value) / 100);
  const finalTotalMinor = subtotalMinor - amountMinor;
  const allowedMaximum = Math.min(maximumPercentage ?? 100, 100);
  const exceedsMaximum = type === "percentage" && value > allowedMaximum;
  const requiresApproval = type === "percentage" && approvalThresholdPercentage != null && value > approvalThresholdPercentage && !exceedsMaximum;
  const violatesMinimum = minimumTotalMinor != null && finalTotalMinor < minimumTotalMinor;
  const invalid = value <= 0 || exceedsMaximum || violatesMinimum;
  const presets = basis === "head" && type === "amount" ? [1, 2, 5, 10, 15] : [5, 10, 15, 20, 25];
  const previewDivisor = basis === "head" ? units : 1;

  const apply = () => {
    if (invalid) return;
    const discount: DiscountValue = type === "amount"
      ? { type: "amount", amountMinor }
      : { type: "percentage", percentage: value };
    onApply(discount, { requiresApproval });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <Tag aria-hidden="true" className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply discount</DialogTitle>
          <DialogDescription>Preview the effect before handing the draft back to the host.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-3">
            <Tabs value={basis} onValueChange={(next) => setBasis(next as "area" | "head")}>
              <TabsList><TabsTrigger value="area">Per Area</TabsTrigger><TabsTrigger value="head">Per Head</TabsTrigger></TabsList>
            </Tabs>
            <Tabs value={type} onValueChange={(next) => setType(next as "amount" | "percentage")}>
              <TabsList><TabsTrigger value="amount">{currency}</TabsTrigger><TabsTrigger value="percentage">%</TabsTrigger></TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-5 gap-2" aria-label="Discount presets">
            {presets.map((preset) => (
              <Button key={preset} type="button" variant="outline" className="aspect-square h-auto p-0 text-sm" onClick={() => setValue((current) => current + preset)}>
                {type === "amount" ? formatMoney(preset * 100, currency, locale) : `${preset}%`}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor={valueInputId}>
              {type === "amount" ? `Amount${basis === "head" ? " per person" : ""}` : "Percentage"}
            </Label>
            <div className="flex gap-2">
              <Input id={valueInputId} type="number" min="0" step={type === "amount" ? "0.01" : "0.1"} value={value || ""} onChange={(event) => setValue(Number(event.target.value) || 0)} />
              <Button type="button" variant="outline" onClick={() => setValue(0)}>Clear</Button>
            </div>
          </div>

          <div className={`space-y-1 rounded-md border p-3 transition-opacity ${value > 0 ? "border-epos-accent/30 bg-epos-accent/10 opacity-100 dark:bg-epos-accent/20" : "border-border bg-muted opacity-50"}`} aria-live="polite">
            <div className="flex justify-between text-sm"><span>{basis === "head" ? "Original (per person)" : "Original total"}</span><span className={value > 0 ? "text-muted-foreground line-through" : ""}>{formatMoney(Math.round(subtotalMinor / previewDivisor), currency, locale)}</span></div>
            <div className="flex justify-between text-sm text-epos-accent"><span>Discount</span><span>−{formatMoney(Math.round(amountMinor / previewDivisor), currency, locale)}</span></div>
            <div className="flex justify-between border-t pt-1 text-sm"><span>{basis === "head" ? "New per person" : "New total"}</span><span>{formatMoney(Math.round(finalTotalMinor / previewDivisor), currency, locale)}</span></div>
            {basis === "head" ? <div className="flex justify-between border-t pt-1 font-medium"><span>New area total</span><span>{formatMoney(finalTotalMinor, currency, locale)}</span></div> : null}
          </div>

          {exceedsMaximum ? <p role="alert" className="flex gap-2 rounded-md border border-status-danger/30 bg-status-danger/10 p-3 text-sm text-status-danger-foreground"><AlertTriangle aria-hidden="true" className="size-4 shrink-0" />Maximum discount is {allowedMaximum}%.</p> : null}
          {requiresApproval ? <p className="flex gap-2 rounded-md border border-status-warning/30 bg-status-warning/10 p-3 text-sm text-status-warning-foreground"><AlertTriangle aria-hidden="true" className="size-4 shrink-0" />This draft requires host approval.</p> : null}
          {violatesMinimum ? <p role="alert" className="flex gap-2 rounded-md border border-status-danger/30 bg-status-danger/10 p-3 text-sm text-status-danger-foreground"><AlertTriangle aria-hidden="true" className="size-4 shrink-0" />The new total is below the supplied minimum.</p> : null}

          <div className="flex gap-2">
            <Button type="button" className="flex-1" disabled={invalid} onClick={apply}>Apply discount</Button>
            {currentDiscount ? <Button type="button" variant="outline" onClick={() => { onRemove(); setOpen(false); }}>Remove</Button> : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type DiscountBuilderPreviewProps = Omit<DiscountBuilderProps, "onApply" | "onRemove">;

export function DiscountBuilderPreview({ currentDiscount: initialDiscount, ...props }: DiscountBuilderPreviewProps) {
  const [currentDiscount, setCurrentDiscount] = useState<DiscountValue | null>(initialDiscount);

  return (
    <DiscountBuilder
      {...props}
      currentDiscount={currentDiscount}
      onApply={(discount) => setCurrentDiscount(discount)}
      onRemove={() => setCurrentDiscount(null)}
    />
  );
}
