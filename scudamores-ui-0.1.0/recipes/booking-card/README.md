# Booking card

A compact status card using a neutral booking DTO. The host owns navigation,
permissions and data fetching.

## Fixture adapter

Pass the entire fixture as the `booking` prop. React calls `onView(booking)`;
Blade dispatches `view-booking` with the same booking object as `event.detail`.
The explicit View control is the only interactive target, avoiding nested
button semantics while preserving the compact card treatment.
