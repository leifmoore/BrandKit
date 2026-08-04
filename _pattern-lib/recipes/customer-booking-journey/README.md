# Customer booking journey

A neutral public journey covering ticket/date selection, departure and time selection, customer details, a host-owned payment surface, and confirmation. It retains the source flow's compact three-stage progress model without copying availability, pricing, localisation, database, or payment code.

`CustomerBookingJourneyRecipe` is controlled: the host owns the current step and value, validates availability and price again on the server, mounts its payment provider through `paymentSlot`, and handles `onSubmit`. The fixture preview only advances to confirmation; it never processes a payment. Blade emits `ui:customer-booking-journey:change` and `ui:customer-booking-journey:action` and exposes a named `payment` slot.

Money uses integer minor units plus an ISO currency code. Fixtures are fictional. Do not treat disabled times, displayed totals, completion references, or client-side validation as authoritative. On a failed payment, keep customer input and selection intact, focus the error summary, and do not announce success.
