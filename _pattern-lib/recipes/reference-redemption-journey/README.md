# Reference redemption journey

A portable lookup → not-found/expired → review → confirmation → completion journey for redeeming a saved reference. It preserves the source journey's information architecture while removing signed URLs, database mutations, customer records, payment processing, timers, and routing.

The controlled React recipe calls `onLookup`, `onContinue`, `onConfirm`, and `onRestart`. The fixture preview only changes local display state. Blade dispatches `ui:reference-redemption-journey:change` and `ui:reference-redemption-journey:action`. The host must validate the reference server-side, rate-limit lookup, avoid confirming whether unrelated customer data exists, re-check expiry/availability/amount, process any payment, persist atomically, and return final references.

Not-found and expired copy is deliberately non-sensitive. Move focus to the new state heading after asynchronous lookup, retain the entered reference on recoverable errors, and announce completion only after the host confirms success.
