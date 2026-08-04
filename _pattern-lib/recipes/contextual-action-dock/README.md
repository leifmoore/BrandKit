# Contextual Action Dock

Use this mobile-first dock to keep the current workflow action and optional
summary visible near the bottom edge. The host must reserve equivalent bottom
padding for page content and must not render the dock alongside bottom
navigation.

The `contained` position exists for documentation previews. Product layouts
normally use `fixed`, which honours the device safe-area inset. The host owns
navigation and business validation; the recipe reports action IDs only.

Keyboard focus follows DOM order: summary, secondary action, then primary
action. Loading and disabled states remain programmatically exposed.
