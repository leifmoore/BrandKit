"use client";

import * as React from "react";
import { AlertCircle, CalendarDays, CheckCircle2, RotateCcw, Search } from "lucide-react";

import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Input } from "@scudamores/ui/components/ui/input";
import { Label } from "@scudamores/ui/components/ui/label";
import { Separator } from "@scudamores/ui/components/ui/separator";

export type ReferenceRedemptionState = "lookup" | "not-found" | "expired" | "review" | "confirm" | "complete";

export interface RedeemableItem {
  id: string;
  dateLabel: string;
  timeLabel: string;
  description: string;
  partyLabel: string;
}

export interface RedeemableReference {
  reference: string;
  customerName: string;
  customerEmail: string;
  expiresLabel: string;
  items: RedeemableItem[];
  totalMinor: number;
  currency: string;
}

export interface RedemptionResult {
  bookingReferences: string[];
  message: string;
}

export interface ReferenceRedemptionJourneyRecipeProps {
  state: ReferenceRedemptionState;
  quote?: RedeemableReference | null;
  result?: RedemptionResult | null;
  initialReference?: string;
  lookingUp?: boolean;
  confirming?: boolean;
  onLookup: (reference: string) => void;
  onContinue: () => void;
  onConfirm: () => void;
  onRestart: () => void;
}

function money(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amountMinor / 100);
}

/** A host-controlled lookup, review, confirmation and completion journey. */
export function ReferenceRedemptionJourneyRecipe({
  state,
  quote,
  result,
  initialReference = "",
  lookingUp = false,
  confirming = false,
  onLookup,
  onContinue,
  onConfirm,
  onRestart,
}: ReferenceRedemptionJourneyRecipeProps) {
  const [reference, setReference] = React.useState(initialReference);

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Use a booking reference</CardTitle>
        <CardDescription>Find the saved offer, review its details, and confirm when ready.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {state === "lookup" ? (
          <form onSubmit={(event) => { event.preventDefault(); onLookup(reference.trim()); }} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="redemption-reference">Reference</Label><Input id="redemption-reference" autoComplete="off" value={reference} onChange={(event) => setReference(event.currentTarget.value.toUpperCase())} aria-describedby="redemption-reference-hint" /><p id="redemption-reference-hint" className="text-xs text-muted-foreground">Enter the reference exactly as it appears in the message you received.</p></div>
            <Button type="submit" className="w-full" disabled={!reference.trim() || lookingUp} aria-busy={lookingUp || undefined}><Search aria-hidden="true" />{lookingUp ? "Looking up…" : "Look up reference"}</Button>
          </form>
        ) : null}

        {state === "not-found" || state === "expired" ? (
          <div className="flex flex-col items-center py-6 text-center" role="alert">
            <span className="grid size-11 place-items-center rounded-full bg-status-warning/15 text-status-warning-foreground"><AlertCircle aria-hidden="true" className="size-5" /></span>
            <h2 className="mt-4 font-semibold">{state === "not-found" ? "Reference not found" : "This reference has expired"}</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{state === "not-found" ? "Check the characters and try again. No changes have been made." : "Ask the sender for a current offer before trying again."}</p>
            <Button variant="outline" className="mt-5" onClick={onRestart}><RotateCcw aria-hidden="true" />Try another reference</Button>
          </div>
        ) : null}

        {state === "review" && quote ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-muted-foreground">Prepared for</p><p className="font-semibold">{quote.customerName}</p><p className="text-sm text-muted-foreground">{quote.customerEmail}</p></div><Badge variant="outline" className="font-mono">{quote.reference}</Badge></div>
            <Separator />
            <section aria-labelledby="redemption-items-title" className="space-y-3"><div className="flex items-center justify-between"><h2 id="redemption-items-title" className="font-semibold">Saved booking details</h2><span className="text-xs text-muted-foreground">Expires {quote.expiresLabel}</span></div>{quote.items.map((item) => <article key={item.id} className="rounded-lg border p-3 text-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium">{item.description}</h3><p className="mt-1 flex items-center gap-1 text-muted-foreground"><CalendarDays aria-hidden="true" className="size-3.5" />{item.dateLabel} at {item.timeLabel}</p></div><span className="shrink-0 text-muted-foreground">{item.partyLabel}</span></div></article>)}</section>
            <div className="flex items-center justify-between border-t pt-4"><span className="text-sm text-muted-foreground">Total due</span><span className="font-semibold tabular-nums">{money(quote.totalMinor, quote.currency)}</span></div>
            <Button className="w-full" onClick={onContinue}>Continue</Button>
          </div>
        ) : null}

        {state === "confirm" && quote ? (
          <div className="space-y-5">
            <div className="rounded-lg bg-muted p-4"><h2 className="font-semibold">Confirm redemption</h2><p className="mt-1 text-sm text-muted-foreground">The host must revalidate this reference, amount, and availability before completing the booking.</p></div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Reference</dt><dd className="font-mono">{quote.reference}</dd></div><div><dt className="text-muted-foreground">Bookings</dt><dd>{quote.items.length}</dd></div><div><dt className="text-muted-foreground">Confirmation email</dt><dd>{quote.customerEmail}</dd></div><div><dt className="text-muted-foreground">Total due</dt><dd className="font-semibold tabular-nums">{money(quote.totalMinor, quote.currency)}</dd></div></dl>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button variant="outline" onClick={onRestart}>Cancel</Button><Button disabled={confirming} aria-busy={confirming || undefined} onClick={onConfirm}>{confirming ? "Confirming…" : "Confirm redemption"}</Button></div>
          </div>
        ) : null}

        {state === "complete" && result ? (
          <div className="flex flex-col items-center py-6 text-center" role="status">
            <CheckCircle2 aria-hidden="true" className="size-12 text-status-success-foreground" />
            <h2 className="mt-4 text-lg font-semibold">Reference redeemed</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{result.message}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">{result.bookingReferences.map((item) => <Badge key={item} variant="success" className="font-mono">{item}</Badge>)}</div>
            <Button variant="outline" className="mt-6" onClick={onRestart}>Use another reference</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export interface ReferenceRedemptionFixture {
  initialState: ReferenceRedemptionState;
  initialReference?: string;
  lookupOutcome: "found" | "not-found" | "expired";
  quote?: RedeemableReference | null;
  result?: RedemptionResult | null;
}

/** Stateful fixture adapter; callbacks simulate state only and never redeem. */
export function ReferenceRedemptionJourneyPreview(fixture: ReferenceRedemptionFixture) {
  const [state, setState] = React.useState(fixture.initialState);

  return (
    <ReferenceRedemptionJourneyRecipe
      state={state}
      quote={fixture.quote}
      result={fixture.result}
      initialReference={fixture.initialReference}
      onLookup={() => setState(fixture.lookupOutcome === "found" ? "review" : fixture.lookupOutcome)}
      onContinue={() => setState("confirm")}
      onConfirm={() => setState("complete")}
      onRestart={() => setState("lookup")}
    />
  );
}
