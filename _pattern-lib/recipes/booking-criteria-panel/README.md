# Booking criteria panel

The date and party-size entry composition used at the start of the EPOS
journey. Its DTO deliberately describes generic party categories rather than
encoding product eligibility or passenger pricing rules.

## Integration contract

Dates cross the handoff boundary as ISO `YYYY-MM-DD` strings. React calls
`onDateChange`, `onPartyChange`, and `onAccessibilityChange`. Blade keeps
native form values and dispatches `ui:booking-criteria-panel:change` with a
`field` discriminator.

The host decides valid dates, party constraints, accessibility consequences,
availability, pricing, and persistence. The fixture's minimums and maximums
are illustrative UI constraints only. Blade uses the library-owned Alpine
calendar; React uses the paired DayPicker-backed calendar.
