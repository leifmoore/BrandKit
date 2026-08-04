# Grouped results table

A wide, horizontally scrollable result table with optional group headers,
subtotals, a grand total and a deliberate empty state. It reflects both the
DesignApp transaction table and the production report's server-calculated row
and total model.

The host supplies columns, pre-grouped rows and every subtotal. Changing Group
by requests another supplied view; the recipe does not aggregate, sort, fetch,
paginate or export records. React calls `onGroupByChange`; Blade dispatches
`ui:grouped-results-table:change` with `{ groupBy }`.

Cells carry a formatted `displayValue` and may also carry integer
`valueMinor`/`currency` or `numericValue`. This keeps calculations and locale
formatting host-owned. Never calculate financial totals from display strings.

The table includes a caption, scoped column headers and scoped group headers.
Keep row identity stable during refreshes. For very large result sets, the host
must paginate on the server and label totals as page or all-result totals.
