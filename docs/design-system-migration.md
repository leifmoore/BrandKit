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

## Pattern-library add-on boundary

`_pattern-lib` is a read-only sibling of `_comp-lib`, not an overlay. Its JSON
catalogue and individual recipe manifests add 25 patterns to the six base
recipes for 31 combined patterns. The host uses manifest data—not Markdown
parsing—for navigation, search, maturity, dependencies, scenarios, states,
accessibility, and parity. Exact declared React, Blade, and fixture files back
the workbench source tabs.

The generated `_pattern-lib/react/preview-registry.tsx` remains the live React
preview authority. The host resolves `@scudamores/ui/*` to `_comp-lib/react/*`
and `@scudamores/patterns/*` to `_pattern-lib/*`, and loads base styles before
the pattern add-on stylesheet. Blade remains copyable source only; PHP is not
executed in the browser. `scripts/verify-pattern-handoff.mjs` verifies the
released add-on inventory and hashes without writing into the package.

The add-on validation summary records two approved visual-parity accessibility
findings. They are reported on the Patterns collection and affected detail
pages without silently changing the handed-off pattern styling.

## Host integration decisions

- Existing import paths remain stable (`@/components/ui/*`).
- Brand-specific appearance belongs at host call sites, not in copied files.
- The shared shell and software documentation use the handoff's neutral
  semantic palette and Instrument Sans. Brand typography and colour remain
  authored content until the Brand migration gate is approved.
- Official Navy and Off-White remain Brand identity colours. Earlier Cream and
  Gold application proposals are not exposed as app-ready theme candidates.
  Toggleable website-expression experiments are owned
  by the Brand Playground and documented in `docs/brand-colour-review.md`.
- Generic semantic variables (`background`, `foreground`, `muted`, `accent`,
  status colours, and component surface tokens) back canonical utilities. The
  destination corrects light and dark `muted-foreground` contrast without
  altering the immutable handoff or copyable source.
- The seven generic handoff accent presets remain isolated to Design System
  live previews; they do not replace the Brand Kit's identity.
- Dark mode has one module-level reactive store. Sidebar and Toaster observe
  the same persisted state, and canonical Sonner receives an explicit theme.
- `next-themes` was removed because the app has no ThemeProvider and no longer
  imports it.

## Compatibility adapters

- Download/copy controls retain their compact Brand Kit typography and spacing
  while composing canonical Button.
- The preview-first workbench keeps Preview, React, and Blade at the top of
  component and pattern pages; detailed guidance opens in a URL-addressable
  documentation sheet.
- The Components collection defaults to alphabetized Card view, with a compact
  List view available through the URL-addressable layout control. Component and
  pattern cards virtualize inert previews near the viewport to protect host
  runtime and Codespace compute.
- Component and pattern detail pages include a collection back link plus
  wraparound previous/next sibling navigation.
- Recipe canvases establish their own viewport-positioning boundary, so fixed
  pattern chrome such as Mobile Bottom Navigation and contextual action docks
  cannot escape into the host application or neighbouring catalogue cards.
- Copy and Download actions operate on a selected exact handoff file. Deferred
  roadmap records expose neither action.
- The sequential preview-review queue mounts one preview at a time, stores
  personal Pass/Flag decisions by handoff version, and exports Markdown or JSON.
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

## Shared host patterns

The application shell owns a small set of reusable patterns that are shared by
Brand and Design System pages without being presented as canonical handoff
components or framework-parity implementations:

- `PageHeader` provides one semantic, responsive heading hierarchy for both
  workspaces. Brand's legacy `SectionHeader` and the catalogue's
  `DeveloperPageHeader` are compatibility wrappers over this host pattern.
- `SectionSubNav` provides overflow-safe, reduced-motion-aware in-page
  navigation. It composes the canonical Button and uses only semantic surface,
  text, border, and focus roles; Brand identity colours remain authored content.
- `GuidanceTable` preserves captions and every guidance column at narrow widths
  inside a labelled, keyboard-scrollable region instead of deleting content at
  responsive breakpoints.
- Neutral Brand guidance clusters compose the canonical `Card` and
  `CardContent`. Authored Brand specimens—such as logo canvases, colour fields,
  and Deep Navy statements—keep their explicitly documented Brand treatment.
- Pending or coming-soon guidance uses a canonical `Card` with a dashed border,
  a semantic `Badge` where status text is present, and ordinary document
  headings. Warning and destructive guidance remains a labelled semantic
  notice rather than borrowing Brand accent colours.
- The Brand Playground composes canonical controls but deliberately renders its
  photographic website specimens inside an isolated expressive canvas. Its
  local drafts and experimental exports cannot change canonical component files
  or semantic application tokens.
- Its explicit workspace-preview switch may override Brand-content primary
  actions and authored accent cues for comparison. The override is scoped below
  the Brand shell and is removed on every Design System route; status, focus,
  chart, and immutable component definitions remain governed.

These patterns may enter the copyable component library only after original
React and Blade sources plus behavioural contracts are reviewed.

## Verification gates

Run these serially when Codespace CPU capacity allows:

1. `npm run verify:canonical`
2. `npm run typecheck`
3. `npm run build`
4. `npm run test:production` for the built root and a direct Design System deep link
5. Focused Brand Kit shell/page interaction and accessibility checks, including
   all original Brand Kit routes at 360px
6. Design System route, workbench, review, Calendar, portal, accessibility, and visual suites

The immutable `_comp-lib` and `_pattern-lib` directories are never edited during
destination migration; `npm run verify:handoff` validates both supplied
inventories and hashes.
