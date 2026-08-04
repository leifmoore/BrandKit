# Report workspace tabs

A horizontally scrollable report-view rail derived from the Reporting page.
It keeps a large analytical workspace navigable at phone widths without
compressing labels into unreadable targets.

React is controlled through `value` and `onValueChange`; the host renders each
panel through `renderPanel`. Blade uses the base tabs composition and dispatches
`ui:report-workspace-tabs:change` with `{ value }`.

The pattern owns tab selection and focus semantics only. The host owns lazy
loading, URL synchronisation, permission-based tab availability, draft versus
applied filter policy, exports and the panel content itself. Disabled tabs must
include a nearby explanation; do not use a disabled tab as the only indication
that access is restricted.

The active trigger scrolls into the visible part of the rail. Panels are
focusable so keyboard users can move from the selected tab into its content.
