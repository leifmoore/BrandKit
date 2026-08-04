# Discount builder

A focused modal for amount or percentage discounts, area or per-person entry,
preset increments, a live total preview, approval guidance, and hard price
floors. All money crossing the public boundary is represented in integer minor
units.

## Integration contract

React calls `onApply(discount, { requiresApproval })` or `onRemove()`. Blade
dispatches `ui:discount-builder:change` for draft previews and
`ui:discount-builder:action` for apply/remove. A per-person amount is
normalised into a total `amountMinor` before it leaves either edition.

The host decides whether the user may open or apply this pattern, supplies
authoritative limits, performs approval, recalculates the final price, and
persists the result. Client-side warnings are guidance and must never be used
as the pricing or authorisation boundary.
