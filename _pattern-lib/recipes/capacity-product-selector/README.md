# Capacity product selector

An expandable product list with unique tier lines, quantity controls, and a
clear under/exact/over coverage status. It extracts the repeatable interaction
from the EPOS product cards without copying product eligibility or allocation
rules.

## Integration contract

React is controlled through `selectedProductIds`, `selections`,
`onToggleProduct`, and `onLinesChange`. Blade owns a local Alpine draft and
dispatches `ui:capacity-product-selector:change` with the product ID, included
state, complete line array, and the initiating action.

`capacityPerUnit: null` explicitly disables coverage messaging for a tier.
The host owns product filtering, mutual exclusion, suggested allocations,
stock, price calculation, validation, and persistence. Duplicate tier lines
are prevented by the presentation, but must still be validated by the host.
