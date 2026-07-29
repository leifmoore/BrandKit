# Quick launch

A responsive grid of frequently used destinations. Consumers provide items and
handle the launch event; the recipe owns no routing or permissions.

## Fixture adapter

Pass the fixture's `items` directly. React receives `onLaunch(item)`; Blade
dispatches `quick-launch` with the item as `event.detail`. An empty collection
renders nothing. Ranking, routing and any large-list overflow policy remain
host concerns.

The three semantic tints repeat by item position in both editions. They avoid
copying the DesignApp's product-specific five-hue data convention into this
neutral recipe.
