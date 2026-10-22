# Availability time picker

Location chips, an optional pricing-view control, three-column time-band
cards, and an expandable grid of exact times. It preserves the EPOS visual
hierarchy without copying its catalog, permission, pricing, or availability
queries.

## Integration contract

Prices are integer minor units with an ISO currency code. React is controlled
for location, pricing mode, and selected time. Blade maintains a local draft
and dispatches `ui:availability-time-picker:change` with a `field`
discriminator. Band expansion is presentational local state in both editions.

The host supplies already-authorised locations, calculated prices and
availability, handles reservation contention, and revalidates every choice on
submission. `perPersonPriceMinor` is display data, not a pricing formula.
