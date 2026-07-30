# Design-system migration record

The Brand Kit uses the `scudamores-ui` 0.1.0 handoff as its copy-only component
authority. Canonical destination files are byte-identical to the handoff and
are registered in `scripts/canonical-copies.json`; `npm run verify:canonical`
fails on drift, missing files, duplicate destinations, or an unclassified UI
implementation.

## Adopted boundary

The destination now uses canonical copies for every generic UI implementation
that already existed in `src/components/ui`: Badge, Button, Card, Dialog,
Input, Label, Popover, Scroll Area, Select, Separator, Slider, Sonner, Tabs,
Tooltip, and their colocated utility. The handoff runtime theme adapter is also
copied exactly.

Two host-owned adapters remain by design:

- `chart.tsx` preserves Brand Kit Recharts configuration and raw series data.
  Chart is deferred rather than distributed in handoff 0.1.0.
- `command.tsx` preserves the Brand Kit's global cmdk navigation and composes
  canonical Dialog. Command Palette is also deferred in handoff 0.1.0.

These exceptions are classified by the verifier; adding another local UI file
requires an explicit copy or adapter decision.

## Host integration decisions

- Existing import paths remain stable (`@/components/ui/*`).
- Brand-specific appearance belongs at host call sites, not in copied files.
- The Brand Kit retains its Scudamore navy, cream, gold, Gill/Inter typography,
  chart data, `scud-dark-mode` storage key, and `.app-dark` ownership.
- Generic semantic variables (`background`, `foreground`, `muted`, `accent`,
  status colours, and component surface tokens) back canonical utilities.
- The seven generic handoff brand presets remain isolated to Developer live
  previews; they do not replace the Brand Kit's identity.
- Dark mode has one module-level reactive store. Sidebar and Toaster observe
  the same persisted state, and canonical Sonner receives an explicit theme.
- `next-themes` was removed because the app has no ThemeProvider and no longer
  imports it.

## Compatibility adapters

- Download/copy controls retain their compact Brand Kit typography and spacing
  while composing canonical Button.
- Developer documentation Tabs use `gap-0` so existing section margins remain
  authoritative.
- Command Dialog reserves close-button space and keeps a programmatic title,
  description, and input label.
- Sidebar Scroll Area explicitly retains flex min-size and clipping behavior.
- Mobile navigation now has modal semantics, background isolation, focus entry,
  trapping, Escape dismissal, and focus restoration. Brand Kit navigation hands
  focus to the destination heading or deep-linked section.
- Logo Slider retains the approved thin track using canonical `data-slot`
  hooks and now exposes an accessible name.
- Colour Popover/Select and Typography Input gained associated names, explicit
  button types, responsive control layout, and canonical focus-visible rings.
- Colour formats, contrast changes, copy results, downloads, and scrollable code
  samples now expose specific names, live feedback, and keyboard access.

## Verification gates

Run these serially when Codespace CPU capacity allows:

1. `npm run verify:canonical`
2. `npm run typecheck`
3. `npm run build`
4. `npm run test:production` for the built root and a direct Developer deep link
5. Focused Brand Kit shell/page interaction and accessibility checks, including
   all original Brand Kit routes at 360px
6. Developer route, portal, accessibility, and visual suites

The immutable `_comp-lib` directory is never edited during destination
migration; `npm run verify:handoff` validates its supplied inventory and hashes.
