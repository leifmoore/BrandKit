import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@scudamores/ui/components/ui/collapsible";
import { Separator } from "@scudamores/ui/components/ui/separator";

export interface BookingReviewLine {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  amountMinor: number;
  status?: string;
}

export interface BookingReviewSummaryProps {
  title?: string;
  expanded: boolean;
  lines: BookingReviewLine[];
  subtotalMinor: number;
  discountMinor?: number;
  totalMinor: number;
  currency?: string;
  onExpandedChange?: (expanded: boolean) => void;
  onEdit?: (lineId: string) => void;
  onRemove?: (lineId: string) => void;
}

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amountMinor / 100);
}

export function BookingReviewSummaryRecipe({
  title = "Booking summary",
  expanded,
  lines,
  subtotalMinor,
  discountMinor = 0,
  totalMinor,
  currency = "GBP",
  onExpandedChange,
  onEdit,
  onRemove,
}: BookingReviewSummaryProps) {
  const contentId = "booking-review-summary-content";
  return (
    <Collapsible open={expanded} onOpenChange={onExpandedChange} data-pattern="booking-review-summary">
      <Card>
        <CardHeader className="gap-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-controls={contentId}
            >
              <span>
                <CardTitle>{title}</CardTitle>
                <span className="mt-1 block text-sm text-muted-foreground">{lines.length} {lines.length === 1 ? "selection" : "selections"}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-semibold tabular-nums">{formatMoney(totalMinor, currency)}</span>
                <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </span>
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent id={contentId}>
          <CardContent className="space-y-4">
            {lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No selections have been added.</p>
            ) : lines.map((line) => (
              <article key={line.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{line.title}</h3>
                    {line.status && <Badge variant="secondary">{line.status}</Badge>}
                  </div>
                  {line.description && <p className="mt-1 text-sm text-muted-foreground">{line.description}</p>}
                  <p className="mt-1 text-sm"><time dateTime={`${line.date}T${line.time}`}>{line.date} · {line.time}</time></p>
                </div>
                <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                  <strong className="tabular-nums">{formatMoney(line.amountMinor, currency)}</strong>
                  <span className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${line.title}`} onClick={() => onEdit?.(line.id)}><Pencil aria-hidden="true" /></Button>
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${line.title}`} onClick={() => onRemove?.(line.id)}><Trash2 aria-hidden="true" /></Button>
                  </span>
                </div>
              </article>
            ))}
            <Separator />
            <dl className="ml-auto grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt><dd className="text-right tabular-nums">{formatMoney(subtotalMinor, currency)}</dd>
              {discountMinor > 0 && <><dt className="text-muted-foreground">Discount</dt><dd className="text-right tabular-nums">−{formatMoney(discountMinor, currency)}</dd></>}
              <dt className="font-semibold">Total</dt><dd className="text-right font-semibold tabular-nums">{formatMoney(totalMinor, currency)}</dd>
            </dl>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function BookingReviewSummaryPreview(props: BookingReviewSummaryProps) {
  const [expanded, setExpanded] = useState(props.expanded);
  const [lines, setLines] = useState(props.lines);
  return <BookingReviewSummaryRecipe
    {...props}
    expanded={expanded}
    lines={lines}
    onExpandedChange={setExpanded}
    onRemove={(lineId) => setLines((current) => current.filter((line) => line.id !== lineId))}
  />;
}
