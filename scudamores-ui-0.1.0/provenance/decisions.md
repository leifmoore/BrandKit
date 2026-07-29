# Approved decisions

This is the compact decision record for the portable handoff. It replaces, rather than copies, the long internal planning conversation.

## Product boundary

- Build raw handoff material only; do not build or style the external brand-kit application.
- The brand-kit is a WIP destination shell and contributes no source or visual authority.
- The future section is named Developer in the information architecture and supports interactive React previews plus React/Blade source tabs.
- `_comp-lib` is maintained source; a deterministic ZIP and SHA-256 file are generated release outputs.

## Authority

- Current DesignApp components and `src/styles/theme.css` define visual truth.
- Production Blade defines legacy tags and Laravel-specific form/runtime behavior, then is restyled in copied artifacts to match the DesignApp.
- Current curated design-system rationale informs documentation. Raw extraction JSON, completed audits, and product-functional backlogs are not transferred.
- Visual parity is the first release priority. Accessibility issues are fixed when they do not alter the approved design and are always flagged when unresolved.

## Catalogue scope

- Pair 30 stable and 9 beta components across React and Blade.
- Inventory but defer Carousel, Chart, Command Palette, Context Menu, Drawer, Hover Card, Menubar, Navigation Menu, Resizable Panels, and Sidebar.
- Transfer six approved domain compositions as fixture-driven recipes, not supported standalone APIs.
- Transfer Device Preview Frame only as documentation infrastructure.
- Keep app shell, authentication, quote, database, role/permission, and audit-log components as reference-only; exclude generated `ImageWithFallback`.

## Framework choices

- Canonical Blade tags use `<x-ui.*>`; current production tags become thin compatibility wrappers where approved.
- Blade interaction runtime is Alpine 3 with Collapse and Focus plus Floating UI. Do not add Livewire or jQuery.
- React keeps existing names, variants, sizes, and composition conventions while removing app coupling and non-visual defects.
- React icons remain Lucide; Blade icons remain Phosphor, with semantic mappings recorded per component.
- Blade Select remains native. Blade Calendar uses a handoff-owned Alpine date-grid controller.

## Styling choices

- `tokens.json` and `brands.json` are maintained truth; CSS outputs represent them.
- Base element rules are opt-in so transfer cannot unexpectedly restyle the destination shell.
- Components consume host `.dark` and brand classes without owning persistence.
- Instrument Sans 400/500/600 is canonical.
- The handoff includes all current semantic roles, seven light/dark brand presets, and the 8px radius base.
