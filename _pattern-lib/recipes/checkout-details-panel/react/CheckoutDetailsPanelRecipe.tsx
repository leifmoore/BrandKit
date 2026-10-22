import { useId, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@scudamores/ui/components/ui/collapsible";
import { Input } from "@scudamores/ui/components/ui/input";
import { Label } from "@scudamores/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@scudamores/ui/components/ui/select";
import { Textarea } from "@scudamores/ui/components/ui/textarea";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

export interface CheckoutMetadataField {
  id: string;
  label: string;
  type: "text" | "select";
  value: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface CheckoutDetailsPanelProps {
  customer: CheckoutCustomer;
  metadata?: CheckoutMetadataField[];
  metadataExpanded?: boolean;
  errors?: Record<string, string>;
  submitting?: boolean;
  submitLabel?: string;
  onCustomerChange?: (field: keyof CheckoutCustomer, value: string) => void;
  onMetadataChange?: (id: string, value: string) => void;
  onMetadataExpandedChange?: (expanded: boolean) => void;
  onSubmit?: () => void;
}

export function CheckoutDetailsPanelRecipe({
  customer,
  metadata = [],
  metadataExpanded = false,
  errors = {},
  submitting = false,
  submitLabel = "Continue",
  onCustomerChange,
  onMetadataChange,
  onMetadataExpandedChange,
  onSubmit,
}: CheckoutDetailsPanelProps) {
  const prefix = useId();
  const field = (name: keyof CheckoutCustomer, label: string, type = "text") => {
    const id = `${prefix}-${name}`;
    const errorId = `${id}-error`;
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} name={name} type={type} value={customer[name]} required={name !== "notes"} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? errorId : undefined} onChange={(event) => onCustomerChange?.(name, event.target.value)} />
        {errors[name] && <p id={errorId} className="text-sm text-destructive">{errors[name]}</p>}
      </div>
    );
  };
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.(); };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate data-pattern="checkout-details-panel">
      <Card>
        <CardHeader><CardTitle>Customer details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {field("firstName", "First name")}
          {field("lastName", "Last name")}
          {field("email", "Email address", "email")}
          {field("phone", "Phone number", "tel")}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${prefix}-notes`}>Notes</Label>
            <Textarea id={`${prefix}-notes`} name="notes" rows={3} value={customer.notes} onChange={(event) => onCustomerChange?.("notes", event.target.value)} />
          </div>
        </CardContent>
      </Card>

      {metadata.length > 0 && (
        <Collapsible open={metadataExpanded} onOpenChange={onMetadataExpandedChange}>
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <button type="button" className="flex w-full items-center justify-between rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-controls={`${prefix}-metadata`}>
                  <span><CardTitle>Additional details</CardTitle><span className="mt-1 block text-sm text-muted-foreground">Optional operational information</span></span>
                  <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${metadataExpanded ? "rotate-180" : ""}`} />
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent id={`${prefix}-metadata`}>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {metadata.map((item) => {
                  const id = `${prefix}-metadata-${item.id}`;
                  const error = errors[`metadata.${item.id}`];
                  return <div key={item.id} className="space-y-2">
                    <Label htmlFor={id}>{item.label}{item.required ? " *" : ""}</Label>
                    {item.type === "select" ? (
                      <Select value={item.value} onValueChange={(value) => onMetadataChange?.(item.id, value)}>
                        <SelectTrigger id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}><SelectValue placeholder="Choose an option" /></SelectTrigger>
                        <SelectContent>{item.options?.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <Input id={id} value={item.value} required={item.required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onMetadataChange?.(item.id, event.target.value)} />
                    )}
                    {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
                  </div>;
                })}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      <div className="flex justify-end"><Button type="submit" disabled={submitting} aria-busy={submitting || undefined}>{submitting ? "Submitting…" : submitLabel}</Button></div>
    </form>
  );
}

export function CheckoutDetailsPanelPreview(props: CheckoutDetailsPanelProps) {
  const [customer, setCustomer] = useState(props.customer);
  const [metadata, setMetadata] = useState(props.metadata ?? []);
  const [metadataExpanded, setMetadataExpanded] = useState(props.metadataExpanded ?? false);
  const [submitted, setSubmitted] = useState(false);
  return <div className="space-y-2">
    <CheckoutDetailsPanelRecipe
      {...props}
      customer={customer}
      metadata={metadata}
      metadataExpanded={metadataExpanded}
      onCustomerChange={(field, value) => setCustomer((current) => ({ ...current, [field]: value }))}
      onMetadataChange={(id, value) => setMetadata((current) => current.map((item) => item.id === id ? { ...item, value } : item))}
      onMetadataExpandedChange={setMetadataExpanded}
      onSubmit={() => setSubmitted(true)}
    />
    <p className="text-right text-xs text-muted-foreground" aria-live="polite">{submitted ? "Preview submission received." : "Changes remain local to this preview."}</p>
  </div>;
}
