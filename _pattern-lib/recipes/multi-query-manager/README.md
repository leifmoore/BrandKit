# Multi-query manager

A horizontally scrollable query switcher for booking several dates or party
configurations in one journey. It preserves the compact pill treatment from
EPOS while replacing clickable `div` elements with keyboard-operable selection
buttons in a labelled toolbar and explicitly labelled removal controls.

## Integration contract

React is controlled and calls select/add/delete/clear callbacks. Blade keeps a
local display draft and dispatches `ui:multi-query-manager:change` for
selection plus `ui:multi-query-manager:action` for add, delete, and clear.

The host owns query creation, destructive-operation policy, selected-query
fallback, validation, storage, and any return to an earlier booking step.
`partyLabel` and `dateLabel` are presentation strings so the pattern does not
own localisation or date parsing.
