# People popover content

A quantity and accessibility selector. This deliberately excludes the
database-backed audit-log panel that shared the original source file.

## Fixture adapter

The fixture keeps counts flat for easy editing. For React, split
`accessibilityAccess` from the four remaining keys, pass those keys as
`people`, and own both values through `onPeopleChange` and
`onAccessibilityChange`.

For Blade, pass the four counts as `people` and the boolean separately. Alpine
enforces a minimum of one adult and zero for the other counts. It dispatches
`people-change` with `event.detail.people` and `accessibility-change` with
`event.detail.value`; the host owns persistence and form submission. Set a
unique `idPrefix` when rendering multiple pickers on one page.
