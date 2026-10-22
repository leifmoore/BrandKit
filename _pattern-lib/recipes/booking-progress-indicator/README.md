# Booking progress indicator

A compact three-state journey indicator derived from the EPOS flow. Complete
steps are actionable, the current step is announced with `aria-current`, and
upcoming steps are descriptive rather than misleadingly clickable.

## Integration contract

React receives neutral step IDs and calls `onStepSelect(stepId)` only for a
completed step. `onBack()` is an independent escape path. Blade dispatches
`ui:booking-progress-indicator:change` with `{ stepId }` and
`ui:booking-progress-indicator:action` with `{ action: "back" }`.

The host owns navigation, validation, persistence, and whether returning to a
completed step is allowed. Labels may be localised by the host. Keep the list
short enough to remain legible at 360px; this recipe is not a generic site
breadcrumb.
