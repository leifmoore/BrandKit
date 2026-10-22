# Report filter builder

A compact, reusable report-filter composition based on the Reporting page's
quick ranges, date interval, channel/staff chips, result count and explicit
Generate action.

## Contract

The pattern is controlled. React calls `onChange` for a draft edit and
`onApply` only when Generate report is pressed. Blade dispatches equivalent
`ui:report-filter-builder:change` and `ui:report-filter-builder:action` events;
the action detail is `{ action: "apply" | "clear", value }`.

Every filter declares `emptySelectionBehavior`:

- `include-all` means no selected option removes that dimension from the host
  query (the normal reporting behavior).
- `include-none` means an empty selection intentionally matches nothing.

The recipe displays that meaning but never guesses it. The host validates date
ranges, resolves permissions and available options, applies the DTO to its
query, computes match counts, and decides whether draft edits make a report
stale. Fetching and exporting are outside the pattern.

Date strings use ISO 8601 calendar dates. IDs are opaque strings. Options and
fixtures are fictional and contain no application records.

## Accessibility

Chip controls use native buttons with `aria-pressed`; each dimension is a
`fieldset`; range labels are available to assistive technology; status changes
are announced through a polite live region. The host must move focus to, or
announce, an error summary if server-side validation rejects Apply.
