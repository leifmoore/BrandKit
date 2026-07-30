# Availability toggle list

Composes Switch, Badge and Button to manage availability and one default item.
The host owns persistence and cross-channel locking rules.

## Fixture adapter

The fixture maps directly to the React data props. The preview adapter owns
`items` and `defaultId` state, updates them from `onToggle` and `onSetDefault`,
and passes them back to the recipe. `emptyMessage` is optional.

For Blade, pass the same `items` and `defaultId` values. Listen for
`availability-change` with `{ id, available }` and `set-default` with `{ id }`.
These events request host updates; the recipe does not persist or mutate
server data.
