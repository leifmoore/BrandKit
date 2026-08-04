"use client";

import * as React from "react";
import { AlertCircle, Check, CheckCircle2, ChevronLeft, Minus, Plus } from "lucide-react";

import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Checkbox } from "@scudamores/ui/components/ui/checkbox";
import { Input } from "@scudamores/ui/components/ui/input";
import { Label } from "@scudamores/ui/components/ui/label";
import { Separator } from "@scudamores/ui/components/ui/separator";

export type CustomerBookingStep = "trip" | "time" | "checkout" | "complete";

export interface CustomerBookingProduct {
  id: string;
  label: string;
  description?: string;
  unitPriceMinor: number;
  maxQuantity: number;
}

export interface CustomerBookingOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CustomerBookingValue {
  date: string;
  quantities: Record<string, number>;
  locationId: string;
  timeId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    marketingConsent: boolean;
  };
}

export interface CustomerBookingFixture {
  title: string;
  description: string;
  currency: string;
  locale?: string;
  minDate: string;
  products: CustomerBookingProduct[];
  locations: CustomerBookingOption[];
  times: CustomerBookingOption[];
  initialStep?: CustomerBookingStep;
  value: CustomerBookingValue;
  completionReference?: string;
  errorMessage?: string;
}

export interface CustomerBookingJourneyRecipeProps extends CustomerBookingFixture {
  step: CustomerBookingStep;
  onStepChange: (step: CustomerBookingStep) => void;
  onChange: (value: CustomerBookingValue) => void;
  onSubmit: (value: CustomerBookingValue) => void;
  paymentSlot?: React.ReactNode;
}

const steps: Array<{ id: Exclude<CustomerBookingStep, "complete">; label: string }> = [
  { id: "trip", label: "Trip details" },
  { id: "time", label: "Time slot" },
  { id: "checkout", label: "Details & payment" },
];

function formatMoney(amountMinor: number, currency: string, locale = "en-GB") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountMinor / 100);
}

function JourneyProgress({ step, onStepChange }: { step: CustomerBookingStep; onStepChange: (step: CustomerBookingStep) => void }) {
  const currentIndex = step === "complete" ? steps.length : steps.findIndex((item) => item.id === step);

  return (
    <nav aria-label="Booking progress">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((item, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={item.id} className="min-w-0 text-center">
              <button
                type="button"
                className="group w-full rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default"
                disabled={!complete || step === "complete"}
                onClick={() => onStepChange(item.id)}
                aria-current={current ? "step" : undefined}
                aria-label={`${item.label}, ${complete ? "complete" : current ? "current" : "upcoming"}`}
              >
                <span className="flex items-center">
                  <span className={`h-0.5 flex-1 ${index === 0 ? "bg-transparent" : complete || current ? "bg-primary" : "bg-border"}`} />
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold ${complete || current ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                    {complete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
                  </span>
                  <span className={`h-0.5 flex-1 ${index === steps.length - 1 ? "bg-transparent" : complete ? "bg-primary" : "bg-border"}`} />
                </span>
                <span className="mt-2 block truncate text-xs">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** A host-controlled public booking journey with an explicit payment slot. */
export function CustomerBookingJourneyRecipe({
  title,
  description,
  currency,
  locale = "en-GB",
  minDate,
  products,
  locations,
  times,
  value,
  step,
  onStepChange,
  onChange,
  onSubmit,
  paymentSlot,
  completionReference,
  errorMessage,
}: CustomerBookingJourneyRecipeProps) {
  const quantity = (id: string) => value.quantities[id] ?? 0;
  const totalMinor = products.reduce((total, product) => total + quantity(product.id) * product.unitPriceMinor, 0);
  const totalItems = Object.values(value.quantities).reduce((total, item) => total + item, 0);
  const selectedLocation = locations.find((item) => item.id === value.locationId);
  const selectedTime = times.find((item) => item.id === value.timeId);
  const customerComplete = Boolean(value.customer.firstName.trim() && value.customer.lastName.trim() && value.customer.email.trim());

  const update = (patch: Partial<CustomerBookingValue>) => onChange({ ...value, ...patch });
  const updateCustomer = (patch: Partial<CustomerBookingValue["customer"]>) => update({ customer: { ...value.customer, ...patch } });
  const updateQuantity = (product: CustomerBookingProduct, next: number) => {
    update({ quantities: { ...value.quantities, [product.id]: Math.max(0, Math.min(product.maxQuantity, next)) } });
  };

  if (step === "complete") {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center" role="status">
          <CheckCircle2 aria-hidden="true" className="size-12 text-status-success-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Booking confirmed</h2>
          <p className="mt-1 text-sm text-muted-foreground">A confirmation summary can now be sent by the host application.</p>
          {completionReference ? <Badge variant="success" className="mt-4 font-mono">{completionReference}</Badge> : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="pt-4"><JourneyProgress step={step} onStepChange={onStepChange} /></div>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage ? (
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{errorMessage}
          </div>
        ) : null}

        {step === "trip" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer-booking-date">Date</Label>
              <Input id="customer-booking-date" type="date" min={minDate} value={value.date} onChange={(event) => update({ date: event.currentTarget.value })} />
            </div>
            <fieldset className="space-y-3">
              <legend className="font-semibold">Choose tickets</legend>
              {products.map((product) => (
                <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                  <div><div className="font-medium">{product.label}</div>{product.description ? <p className="text-sm text-muted-foreground">{product.description}</p> : null}<p className="mt-1 text-sm">{formatMoney(product.unitPriceMinor, currency, locale)}</p></div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" aria-label={`Remove ${product.label}`} disabled={quantity(product.id) === 0} onClick={() => updateQuantity(product, quantity(product.id) - 1)}><Minus aria-hidden="true" /></Button>
                    <output className="w-8 text-center tabular-nums" aria-label={`${product.label} quantity`}>{quantity(product.id)}</output>
                    <Button variant="outline" size="icon" aria-label={`Add ${product.label}`} disabled={quantity(product.id) >= product.maxQuantity} onClick={() => updateQuantity(product, quantity(product.id) + 1)}><Plus aria-hidden="true" /></Button>
                  </div>
                </div>
              ))}
            </fieldset>
            <div className="flex items-center justify-between border-t pt-4"><span className="text-sm text-muted-foreground">{totalItems} tickets</span><span className="font-semibold tabular-nums">{formatMoney(totalMinor, currency, locale)}</span></div>
            <Button className="w-full" disabled={!value.date || totalItems === 0} onClick={() => onStepChange("time")}>Choose a time</Button>
          </div>
        ) : null}

        {step === "time" ? (
          <div className="space-y-6">
            <fieldset className="space-y-3"><legend className="font-semibold">Departure point</legend><div className="flex flex-wrap gap-2">{locations.map((location) => <Button key={location.id} variant={value.locationId === location.id ? "default" : "outline"} aria-pressed={value.locationId === location.id} disabled={location.disabled} onClick={() => update({ locationId: location.id, timeId: "" })}>{location.label}</Button>)}</div></fieldset>
            <fieldset className="space-y-3"><legend className="font-semibold">Available times</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{times.map((time) => <Button key={time.id} variant={value.timeId === time.id ? "default" : "outline"} className="h-auto min-h-12 flex-col" aria-pressed={value.timeId === time.id} disabled={time.disabled || !value.locationId} onClick={() => update({ timeId: time.id })}><span>{time.label}</span>{time.description ? <span className="text-xs opacity-75">{time.description}</span> : null}</Button>)}</div></fieldset>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button variant="outline" onClick={() => onStepChange("trip")}><ChevronLeft aria-hidden="true" />Back</Button><Button disabled={!selectedLocation || !selectedTime} onClick={() => onStepChange("checkout")}>Continue</Button></div>
          </div>
        ) : null}

        {step === "checkout" ? (
          <div className="space-y-6">
            <section aria-labelledby="booking-summary-title" className="rounded-lg bg-muted p-4"><div className="flex items-center justify-between"><h3 id="booking-summary-title" className="font-semibold">Booking summary</h3><Button variant="link" size="sm" onClick={() => onStepChange("trip")}>Edit</Button></div><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Date</dt><dd>{value.date}</dd></div><div><dt className="text-muted-foreground">Departure</dt><dd>{selectedLocation?.label ?? "—"}, {selectedTime?.label ?? "—"}</dd></div><div><dt className="text-muted-foreground">Tickets</dt><dd>{totalItems}</dd></div><div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold tabular-nums">{formatMoney(totalMinor, currency, locale)}</dd></div></dl></section>
            <section aria-labelledby="customer-details-title" className="space-y-4"><h3 id="customer-details-title" className="font-semibold">Your details</h3><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="booking-first-name">First name</Label><Input id="booking-first-name" autoComplete="given-name" value={value.customer.firstName} onChange={(event) => updateCustomer({ firstName: event.currentTarget.value })} /></div><div className="space-y-2"><Label htmlFor="booking-last-name">Last name</Label><Input id="booking-last-name" autoComplete="family-name" value={value.customer.lastName} onChange={(event) => updateCustomer({ lastName: event.currentTarget.value })} /></div><div className="space-y-2"><Label htmlFor="booking-email">Email</Label><Input id="booking-email" type="email" autoComplete="email" value={value.customer.email} onChange={(event) => updateCustomer({ email: event.currentTarget.value })} /></div><div className="space-y-2"><Label htmlFor="booking-phone">Phone (optional)</Label><Input id="booking-phone" type="tel" autoComplete="tel" value={value.customer.phone} onChange={(event) => updateCustomer({ phone: event.currentTarget.value })} /></div></div><div className="flex items-start gap-2"><Checkbox id="booking-marketing" checked={value.customer.marketingConsent} onCheckedChange={(checked) => updateCustomer({ marketingConsent: checked === true })} /><Label htmlFor="booking-marketing" className="font-normal">Send me occasional updates (optional)</Label></div></section>
            <Separator />
            <section aria-labelledby="payment-title" className="space-y-3"><h3 id="payment-title" className="font-semibold">Payment</h3>{paymentSlot ?? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Secure payment surface supplied by the host</div>}</section>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button variant="outline" onClick={() => onStepChange("time")}><ChevronLeft aria-hidden="true" />Back</Button><Button disabled={!customerComplete || totalMinor <= 0} onClick={() => onSubmit(value)}>Confirm and pay {formatMoney(totalMinor, currency, locale)}</Button></div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Stateful fixture adapter for documentation only; it performs no payment. */
export function CustomerBookingJourneyPreview(fixture: CustomerBookingFixture) {
  const [step, setStep] = React.useState<CustomerBookingStep>(fixture.initialStep ?? "trip");
  const [value, setValue] = React.useState(fixture.value);

  return <CustomerBookingJourneyRecipe {...fixture} step={step} value={value} onStepChange={setStep} onChange={setValue} onSubmit={() => { if (!fixture.errorMessage) setStep("complete"); }} />;
}
