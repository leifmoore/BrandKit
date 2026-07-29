# Composition recipes

Recipes demonstrate product-shaped compositions without becoming public
component APIs. Each recipe uses neutral fixture data, approved primitives and
both React and Blade source. Hosts should copy and adapt a recipe, not install
it as a registry dependency.

## Preview adapters

Fixtures contain serializable data only. They deliberately omit functions,
browser `File` objects and Laravel runtime state. A live React preview therefore
adds a thin stateful adapter; Blade receives the same data as view props and
reports user intent through Alpine events.

| Recipe | Fixture mapping | Host signal |
|---|---|---|
| Quick Launch | `items` maps directly | `onLaunch(item)` / `quick-launch` |
| Availability Toggle List | `items` and `defaultId` map directly | React state callbacks / `availability-change` and `set-default` |
| Channel Logo Picker | `showLogo`, `selectedLogoId` and `logos` map directly | React state callbacks / `show-logo-change` and `logo-change` |
| Booking Card | the fixture is the `booking` value | `onView(booking)` / `view-booking` |
| Booking Details Dialog | the fixture is the `booking` value; the React adapter also owns `open` | React callbacks / `reschedule-booking` and `cancel-booking` |
| People Popover Content | split `accessibilityAccess` from the four count keys | React state callbacks / `people-change` and `accessibility-change` |

Alpine event payloads are documented in each recipe README. Preview adapters
must update their own state after a callback or event; recipes never invent
persistence, navigation, permissions or network behavior.

## Intentional framework differences

- React recipes use controlled props and callbacks; Blade recipes use ordinary
  view props plus Alpine events.
- The Blade logo upload remains a native named file input for reliable form
  submission, while React delegates upload handling to a `File` callback.
- React uses Lucide and Blade uses Phosphor. Semantic glyph, size, weight,
  colour and alignment are matched; path shapes can differ.
