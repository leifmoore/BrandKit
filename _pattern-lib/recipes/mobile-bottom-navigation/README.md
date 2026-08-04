# Mobile bottom navigation

A safe-area-aware application navigation pattern for small, coarse-pointer viewports. Supply three or four permission-filtered primary destinations and optionally place less frequent destinations in the focus-trapped **More** sheet.

The host owns routing, authorization, and destination visibility. React calls `onNavigate(id)`; Blade dispatches `ui:mobile-bottom-navigation:change` with `{ id }`. Item IDs are domain-neutral and must be mapped by the host.

## Placement rule

Do not render this navigation at the same time as the contextual action dock. Both reserve the bottom safe area. In React, `actionDockActive` hides this recipe; Blade accepts the same prop. When swapping patterns, restore focus to the control that initiated the contextual task.

The default `hideForFinePointer` behavior mirrors the source application. Set it to `false` only inside a documentation viewport or when the host intentionally supports bottom navigation for mouse users.

## Accessibility

- The active destination uses `aria-current="page"`.
- The More trigger communicates dialog state and its sheet traps/restores focus through the base component.
- Labels remain visible; icons are decorative.
- Keep translated labels concise and preserve at least a 48px touch target.
