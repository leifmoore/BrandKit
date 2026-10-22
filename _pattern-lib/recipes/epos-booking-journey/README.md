# EPOS Booking Journey

This is the orchestration example for the three-stage EPOS flow: build one or
more booking queries, select availability, then review and collect checkout
details. It composes the smaller booking recipes in this package; those pages
remain the authoritative source for each constituent interaction.

The fixture is deliberately neutral. The host must fetch catalogue and
availability data, enforce capacity and pricing rules, validate customer data,
authorize discounts, persist quotes/bookings and own payment. The preview keeps
state in memory and stops at a local confirmation message.

## Integration notes

- Keep one host-owned journey state object and pass slices to the constituent
  patterns. Do not infer business state from rendered DOM.
- Announce step changes and preserve focus when mounting a new step.
- Mobile views use the contained action dock in the documentation canvas. A
  product may switch it to the fixed safe-area variant.
- Blade dispatches `ui:epos-booking-journey:change` for transient choices and
  `ui:epos-booking-journey:action` for host-owned operations.

The Blade version demonstrates the same orchestration with progressively
enhanced form controls. The dedicated Blade subpattern files provide the richer
calendar, capacity, availability and review implementations to compose in a
production integration.
