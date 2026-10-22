import { useMemo, useState } from "react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import {
  AvailabilityTimePicker,
  type AvailabilityTimePickerPreviewProps,
} from "../../availability-time-picker/react/AvailabilityTimePicker";
import {
  BookingCriteriaPanel,
  type BookingCriteriaPanelPreviewProps,
} from "../../booking-criteria-panel/react/BookingCriteriaPanel";
import {
  BookingProgressIndicator,
  type BookingProgressStep,
} from "../../booking-progress-indicator/react/BookingProgressIndicator";
import {
  BookingReviewSummaryRecipe,
  type BookingReviewSummaryProps,
} from "../../booking-review-summary/react/BookingReviewSummaryRecipe";
import {
  CapacityProductSelector,
  type CapacityProductSelectorPreviewProps,
} from "../../capacity-product-selector/react/CapacityProductSelector";
import {
  CheckoutDetailsPanelRecipe,
  type CheckoutDetailsPanelProps,
} from "../../checkout-details-panel/react/CheckoutDetailsPanelRecipe";
import { ContextualActionDockRecipe } from "../../contextual-action-dock/react/ContextualActionDockRecipe";
import {
  MultiQueryManager,
  type MultiQueryManagerPreviewProps,
} from "../../multi-query-manager/react/MultiQueryManager";

export interface EposBookingJourneyFixture {
  title: string;
  steps: BookingProgressStep[];
  initialStepId: string;
  queries: MultiQueryManagerPreviewProps;
  criteria: BookingCriteriaPanelPreviewProps;
  products: CapacityProductSelectorPreviewProps;
  availability: AvailabilityTimePickerPreviewProps;
  review: BookingReviewSummaryProps;
  checkout: CheckoutDetailsPanelProps;
}

export interface EposBookingJourneyPreviewProps extends EposBookingJourneyFixture {
  onComplete?: () => void;
}

export function EposBookingJourneyPreview({
  title,
  steps,
  initialStepId,
  queries: initialQueryState,
  criteria: initialCriteria,
  products: initialProducts,
  availability: initialAvailability,
  review: initialReview,
  checkout: initialCheckout,
  onComplete,
}: EposBookingJourneyPreviewProps) {
  const firstStepId = steps[0]?.id ?? initialStepId;
  const [currentStepId, setCurrentStepId] = useState(
    steps.some((step) => step.id === initialStepId) ? initialStepId : firstStepId,
  );
  const [queries, setQueries] = useState(initialQueryState.queries);
  const [selectedQueryId, setSelectedQueryId] = useState(initialQueryState.selectedQueryId);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [selectedProductIds, setSelectedProductIds] = useState(initialProducts.selectedProductIds);
  const [selections, setSelections] = useState(initialProducts.selections);
  const [availability, setAvailability] = useState(initialAvailability);
  const [reviewExpanded, setReviewExpanded] = useState(initialReview.expanded);
  const [reviewLines, setReviewLines] = useState(initialReview.lines);
  const [customer, setCustomer] = useState(initialCheckout.customer);
  const [metadata, setMetadata] = useState(initialCheckout.metadata ?? []);
  const [metadataExpanded, setMetadataExpanded] = useState(initialCheckout.metadataExpanded ?? false);
  const [complete, setComplete] = useState(false);

  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentStepId));
  const totalMinor = useMemo(
    () => Math.max(0, reviewLines.reduce((sum, line) => sum + line.amountMinor, 0) - (initialReview.discountMinor ?? 0)),
    [initialReview.discountMinor, reviewLines],
  );

  const moveTo = (index: number) => {
    const next = steps[index];
    if (next) setCurrentStepId(next.id);
  };
  const advance = () => moveTo(Math.min(currentIndex + 1, steps.length - 1));
  const retreat = () => moveTo(Math.max(currentIndex - 1, 0));
  const removeQuery = (queryId: string) => {
    setQueries((current) => {
      const next = current.filter((query) => query.id !== queryId);
      if (selectedQueryId === queryId) setSelectedQueryId(next[0]?.id ?? null);
      return next;
    });
  };

  if (complete) {
    return (
      <Card className="mx-auto max-w-2xl" data-pattern="epos-booking-journey">
        <CardHeader>
          <CardTitle>Booking recorded</CardTitle>
          <CardDescription>This preview stops before any payment, API call, or persisted booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={() => { setComplete(false); setCurrentStepId(firstStepId); }}>
            Start another preview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5" aria-labelledby="epos-booking-title" data-pattern="epos-booking-journey">
      <header className="space-y-1">
        <h1 id="epos-booking-title" className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Fixture-driven example: host services still own availability, pricing and submission.</p>
      </header>

      <BookingProgressIndicator
        steps={steps}
        currentStepId={currentStepId}
        onBack={currentIndex > 0 ? retreat : undefined}
        onStepSelect={setCurrentStepId}
      />

      {currentIndex === 0 ? (
        <div className="space-y-4">
          <MultiQueryManager
            queries={queries}
            selectedQueryId={selectedQueryId}
            maxQueries={initialQueryState.maxQueries}
            onSelectQuery={setSelectedQueryId}
            onDeleteQuery={removeQuery}
            onClearAll={() => { setQueries([]); setSelectedQueryId(null); }}
            onAddQuery={() => {
              const sequence = queries.length + 1;
              const query = { id: `journey-query-${sequence}`, partyLabel: "1 person", dateLabel: "Choose date" };
              setQueries((current) => [...current, query]);
              setSelectedQueryId(query.id);
            }}
          />
          <BookingCriteriaPanel
            {...criteria}
            onDateChange={(date) => setCriteria((current) => ({ ...current, date }))}
            onPartyChange={(categoryId, count) => setCriteria((current) => ({
              ...current,
              party: current.party.map((category) => category.id === categoryId ? { ...category, count } : category),
            }))}
            onAccessibilityChange={(accessibilityAccess) => setCriteria((current) => ({ ...current, accessibilityAccess }))}
          />
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Select products and cover the party capacity.</CardDescription>
            </CardHeader>
            <CardContent>
              <CapacityProductSelector
                {...initialProducts}
                selectedProductIds={selectedProductIds}
                selections={selections}
                onToggleProduct={(productId, included) => setSelectedProductIds((current) => included
                  ? [...new Set([...current, productId])]
                  : current.filter((id) => id !== productId))}
                onLinesChange={(productId, lines) => setSelections((current) => {
                  const found = current.some((selection) => selection.productId === productId);
                  return found
                    ? current.map((selection) => selection.productId === productId ? { productId, lines } : selection)
                    : [...current, { productId, lines }];
                })}
              />
            </CardContent>
          </Card>
          <ContextualActionDockRecipe
            position="contained"
            summary={`${criteria.party.reduce((total, category) => total + category.count, 0)} people · ${selectedProductIds.length} products`}
            primaryAction={{ id: "continue", label: "Find availability", disabled: !criteria.date || selectedProductIds.length === 0 }}
            onAction={advance}
          />
        </div>
      ) : null}

      {currentIndex === 1 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Choose a location, pricing view and available departure.</CardDescription>
            </CardHeader>
            <CardContent>
              <AvailabilityTimePicker
                {...availability}
                onLocationChange={(selectedLocationId) => setAvailability((current) => ({ ...current, selectedLocationId }))}
                onPricingModeChange={(selectedPricingModeId) => setAvailability((current) => ({ ...current, selectedPricingModeId }))}
                onTimeChange={(selectedTimeId) => setAvailability((current) => ({ ...current, selectedTimeId }))}
              />
            </CardContent>
          </Card>
          <ContextualActionDockRecipe
            position="contained"
            summary={availability.selectedTimeId ? "Departure selected" : "Choose a departure"}
            amountMinor={totalMinor}
            currency={initialReview.currency}
            primaryAction={{ id: "continue", label: "Review booking", disabled: !availability.selectedTimeId }}
            secondaryAction={{ id: "back", label: "Back" }}
            onAction={(id) => id === "back" ? retreat() : advance()}
          />
        </div>
      ) : null}

      {currentIndex === 2 ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <BookingReviewSummaryRecipe
            {...initialReview}
            expanded={reviewExpanded}
            lines={reviewLines}
            subtotalMinor={reviewLines.reduce((sum, line) => sum + line.amountMinor, 0)}
            totalMinor={totalMinor}
            onExpandedChange={setReviewExpanded}
            onEdit={() => moveTo(1)}
            onRemove={(lineId) => setReviewLines((current) => current.filter((line) => line.id !== lineId))}
          />
          <CheckoutDetailsPanelRecipe
            {...initialCheckout}
            customer={customer}
            metadata={metadata}
            metadataExpanded={metadataExpanded}
            onCustomerChange={(field, value) => setCustomer((current) => ({ ...current, [field]: value }))}
            onMetadataChange={(id, value) => setMetadata((current) => current.map((item) => item.id === id ? { ...item, value } : item))}
            onMetadataExpandedChange={setMetadataExpanded}
            onSubmit={() => { setComplete(true); onComplete?.(); }}
          />
        </div>
      ) : null}
    </section>
  );
}
