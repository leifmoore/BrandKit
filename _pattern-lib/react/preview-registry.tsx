import type { ComponentType } from "react";
import { AvailabilityTimePickerPreview as Pattern0 } from "../recipes/availability-time-picker/react/AvailabilityTimePicker.tsx";
import fixture0 from "../recipes/availability-time-picker/fixtures/basic.json";
import { BookingCriteriaPanelPreview as Pattern1 } from "../recipes/booking-criteria-panel/react/BookingCriteriaPanel.tsx";
import fixture1 from "../recipes/booking-criteria-panel/fixtures/basic.json";
import { BookingProgressIndicatorPreview as Pattern2 } from "../recipes/booking-progress-indicator/react/BookingProgressIndicator.tsx";
import fixture2 from "../recipes/booking-progress-indicator/fixtures/basic.json";
import { BookingReviewSummaryPreview as Pattern3 } from "../recipes/booking-review-summary/react/BookingReviewSummaryRecipe.tsx";
import fixture3 from "../recipes/booking-review-summary/fixtures/basic.json";
import fixture4 from "../recipes/booking-review-summary/fixtures/collapsed.json";
import { CapacityProductSelectorPreview as Pattern4 } from "../recipes/capacity-product-selector/react/CapacityProductSelector.tsx";
import fixture5 from "../recipes/capacity-product-selector/fixtures/basic.json";
import { CheckoutDetailsPanelPreview as Pattern5 } from "../recipes/checkout-details-panel/react/CheckoutDetailsPanelRecipe.tsx";
import fixture6 from "../recipes/checkout-details-panel/fixtures/basic.json";
import fixture7 from "../recipes/checkout-details-panel/fixtures/invalid.json";
import { CollectionStatePanelPreview as Pattern6 } from "../recipes/collection-state-panel/react/CollectionStatePanelRecipe.tsx";
import fixture8 from "../recipes/collection-state-panel/fixtures/loading.json";
import fixture9 from "../recipes/collection-state-panel/fixtures/empty.json";
import fixture10 from "../recipes/collection-state-panel/fixtures/error.json";
import fixture11 from "../recipes/collection-state-panel/fixtures/restricted.json";
import { CollectionToolbarPreview as Pattern7 } from "../recipes/collection-toolbar/react/CollectionToolbarRecipe.tsx";
import fixture12 from "../recipes/collection-toolbar/fixtures/basic.json";
import fixture13 from "../recipes/collection-toolbar/fixtures/filtered.json";
import { ConfigurationWorkbenchPreview as Pattern8 } from "../recipes/configuration-workbench/react/ConfigurationWorkbenchRecipe.tsx";
import fixture14 from "../recipes/configuration-workbench/fixtures/basic.json";
import fixture15 from "../recipes/configuration-workbench/fixtures/draft.json";
import { ContextualActionDockPreview as Pattern9 } from "../recipes/contextual-action-dock/react/ContextualActionDockRecipe.tsx";
import fixture16 from "../recipes/contextual-action-dock/fixtures/basic.json";
import fixture17 from "../recipes/contextual-action-dock/fixtures/multiple-actions.json";
import { CustomerBookingJourneyPreview as Pattern10 } from "../recipes/customer-booking-journey/react/CustomerBookingJourneyRecipe.tsx";
import fixture18 from "../recipes/customer-booking-journey/fixtures/basic.json";
import fixture19 from "../recipes/customer-booking-journey/fixtures/checkout.json";
import fixture20 from "../recipes/customer-booking-journey/fixtures/error.json";
import { DiscountBuilderPreview as Pattern11 } from "../recipes/discount-builder/react/DiscountBuilder.tsx";
import fixture21 from "../recipes/discount-builder/fixtures/basic.json";
import { EposBookingJourneyPreview as Pattern12 } from "../recipes/epos-booking-journey/react/EposBookingJourney.tsx";
import fixture22 from "../recipes/epos-booking-journey/fixtures/basic.json";
import { GroupedResultsTablePreview as Pattern13 } from "../recipes/grouped-results-table/react/GroupedResultsTable.tsx";
import fixture23 from "../recipes/grouped-results-table/fixtures/basic.json";
import fixture24 from "../recipes/grouped-results-table/fixtures/empty.json";
import { KpiStatGridPreview as Pattern14 } from "../recipes/kpi-stat-grid/react/KpiStatGrid.tsx";
import fixture25 from "../recipes/kpi-stat-grid/fixtures/basic.json";
import { MobileBottomNavigationPreview as Pattern15 } from "../recipes/mobile-bottom-navigation/react/MobileBottomNavigationRecipe.tsx";
import fixture26 from "../recipes/mobile-bottom-navigation/fixtures/basic.json";
import fixture27 from "../recipes/mobile-bottom-navigation/fixtures/with-overflow.json";
import { MultiQueryManagerPreview as Pattern16 } from "../recipes/multi-query-manager/react/MultiQueryManager.tsx";
import fixture28 from "../recipes/multi-query-manager/fixtures/basic.json";
import { QuoteBuilderPreview as Pattern17 } from "../recipes/quote-builder/react/QuoteBuilder.tsx";
import fixture29 from "../recipes/quote-builder/fixtures/basic.json";
import { QuoteLookupPreview as Pattern18 } from "../recipes/quote-lookup/react/QuoteLookup.tsx";
import fixture30 from "../recipes/quote-lookup/fixtures/basic.json";
import { ReferenceRedemptionJourneyPreview as Pattern19 } from "../recipes/reference-redemption-journey/react/ReferenceRedemptionJourneyRecipe.tsx";
import fixture31 from "../recipes/reference-redemption-journey/fixtures/basic.json";
import fixture32 from "../recipes/reference-redemption-journey/fixtures/not-found.json";
import fixture33 from "../recipes/reference-redemption-journey/fixtures/expired.json";
import fixture34 from "../recipes/reference-redemption-journey/fixtures/complete.json";
import { ReportBreakdownTablePreview as Pattern20 } from "../recipes/report-breakdown-table/react/ReportBreakdownTable.tsx";
import fixture35 from "../recipes/report-breakdown-table/fixtures/basic.json";
import { ReportFilterBuilderPreview as Pattern21 } from "../recipes/report-filter-builder/react/ReportFilterBuilder.tsx";
import fixture36 from "../recipes/report-filter-builder/fixtures/basic.json";
import fixture37 from "../recipes/report-filter-builder/fixtures/stale.json";
import { ReportWorkspaceTabsPreview as Pattern22 } from "../recipes/report-workspace-tabs/react/ReportWorkspaceTabs.tsx";
import fixture38 from "../recipes/report-workspace-tabs/fixtures/basic.json";
import { ResponsiveDataCollectionPreview as Pattern23 } from "../recipes/responsive-data-collection/react/ResponsiveDataCollectionRecipe.tsx";
import fixture39 from "../recipes/responsive-data-collection/fixtures/basic.json";
import fixture40 from "../recipes/responsive-data-collection/fixtures/empty.json";
import { VisitTimeHeatMapPreview as Pattern24 } from "../recipes/visit-time-heat-map/react/VisitTimeHeatMap.tsx";
import fixture41 from "../recipes/visit-time-heat-map/fixtures/basic.json";

export interface PatternPreviewRegistration {
  Component: ComponentType<any>;
  scenarios: Record<string, { title: string; fixture: unknown }>;
}

export const patternPreviewRegistry = {
  "availability-time-picker": { Component: Pattern0, scenarios: { "basic": { title: "Seller pricing view", fixture: fixture0 } } },
  "booking-criteria-panel": { Component: Pattern1, scenarios: { "basic": { title: "Date and party", fixture: fixture1 } } },
  "booking-progress-indicator": { Component: Pattern2, scenarios: { "basic": { title: "Second step", fixture: fixture2 } } },
  "booking-review-summary": { Component: Pattern3, scenarios: { "basic": { title: "Expanded summary", fixture: fixture3 }, "collapsed": { title: "Compact summary", fixture: fixture4 } } },
  "capacity-product-selector": { Component: Pattern4, scenarios: { "basic": { title: "Under-covered party", fixture: fixture5 } } },
  "checkout-details-panel": { Component: Pattern5, scenarios: { "basic": { title: "Customer details", fixture: fixture6 }, "invalid": { title: "Validation errors", fixture: fixture7 } } },
  "collection-state-panel": { Component: Pattern6, scenarios: { "loading": { title: "Loading", fixture: fixture8 }, "empty": { title: "Empty results", fixture: fixture9 }, "error": { title: "Recoverable error", fixture: fixture10 }, "restricted": { title: "Access restricted", fixture: fixture11 } } },
  "collection-toolbar": { Component: Pattern7, scenarios: { "basic": { title: "Search, filter, and sort", fixture: fixture12 }, "filtered": { title: "Active query and grid", fixture: fixture13 } } },
  "configuration-workbench": { Component: Pattern8, scenarios: { "basic": { title: "Active configuration", fixture: fixture14 }, "draft": { title: "Incomplete draft", fixture: fixture15 } } },
  "contextual-action-dock": { Component: Pattern9, scenarios: { "basic": { title: "Single action", fixture: fixture16 }, "multiple-actions": { title: "Summary with two actions", fixture: fixture17 } } },
  "customer-booking-journey": { Component: Pattern10, scenarios: { "basic": { title: "Select trip details", fixture: fixture18 }, "checkout": { title: "Details and host payment", fixture: fixture19 }, "error": { title: "Recoverable payment error", fixture: fixture20 } } },
  "discount-builder": { Component: Pattern11, scenarios: { "basic": { title: "Discount draft", fixture: fixture21 } } },
  "epos-booking-journey": { Component: Pattern12, scenarios: { "basic": { title: "Interactive three-step journey", fixture: fixture22 } } },
  "grouped-results-table": { Component: Pattern13, scenarios: { "grouped": { title: "Grouped by seller", fixture: fixture23 }, "empty": { title: "No matching rows", fixture: fixture24 } } },
  "kpi-stat-grid": { Component: Pattern14, scenarios: { "default": { title: "Four report metrics", fixture: fixture25 } } },
  "mobile-bottom-navigation": { Component: Pattern15, scenarios: { "basic": { title: "Four destinations", fixture: fixture26 }, "with-overflow": { title: "Three destinations and More", fixture: fixture27 } } },
  "multi-query-manager": { Component: Pattern16, scenarios: { "basic": { title: "Three booking queries", fixture: fixture28 } } },
  "quote-builder": { Component: Pattern17, scenarios: { "basic": { title: "Two offered time bands", fixture: fixture29 } } },
  "quote-lookup": { Component: Pattern18, scenarios: { "basic": { title: "Fixture-backed lookup", fixture: fixture30 } } },
  "reference-redemption-journey": { Component: Pattern19, scenarios: { "basic": { title: "Successful lookup and redemption", fixture: fixture31 }, "not-found": { title: "Reference not found", fixture: fixture32 }, "expired": { title: "Expired reference", fixture: fixture33 }, "complete": { title: "Multiple booking references", fixture: fixture34 } } },
  "report-breakdown-table": { Component: Pattern20, scenarios: { "product": { title: "Product hierarchy", fixture: fixture35 } } },
  "report-filter-builder": { Component: Pattern21, scenarios: { "default": { title: "Applied filters", fixture: fixture36 }, "stale": { title: "Draft differs from report", fixture: fixture37 } } },
  "report-workspace-tabs": { Component: Pattern22, scenarios: { "default": { title: "Six report views", fixture: fixture38 } } },
  "responsive-data-collection": { Component: Pattern23, scenarios: { "basic": { title: "Table and card records", fixture: fixture39 }, "empty": { title: "No matching records", fixture: fixture40 } } },
  "visit-time-heat-map": { Component: Pattern24, scenarios: { "default": { title: "Visit bookings", fixture: fixture41 } } }
} satisfies Record<string, PatternPreviewRegistration>;

export type PatternPreviewId = keyof typeof patternPreviewRegistry;
