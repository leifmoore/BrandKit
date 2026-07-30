# Brand Kit next-generation UI handoff

Last updated: 2026-07-30

## Objective

Implement a cohesive next-generation Brand Kit information architecture and UI
with Brand and Design System workspaces, a preview-first component workbench,
canonical component styling, reviewed Brand colour decisions, and staged
validation including the Calendar intrinsic-width fix.

This goal is active. Do not mark it complete until the colour decision, Brand
page migration, and final module-by-module audit are finished and evidenced.

## Settled product decisions

- Use two peer workspaces in one shared shell: **Brand** and **Design System**.
  Design and Developer are not separate top-level modes.
- Use the compact workspace switcher and remember the last valid route in each
  workspace.
- Public routes are namespaced under `/brand` and `/design-system`; legacy URLs
  remain replace redirects.
- Component and pattern pages are preview-first: Preview, React, and Blade are
  at the top; detailed documentation opens in a URL-addressable sheet.
- The first release is fully interactive and copy-only. It does not ship a
  shadcn registry or install packages for consumers.
- Continue the later Brand-page migration within this same active goal.
- New host patterns must be documented, but must not claim React/Blade parity
  without the original source and behavioural contracts.
- At the end, review every module manually and automatically before completing
  the goal.

## Safety and environment constraints

- Codespace capacity is 2 CPU cores, 8 GB RAM, 32 GB storage.
- Run browser tests serially with `--workers=1`; do not run suites or dev servers
  concurrently, and check that temporary servers exit.
- Do not install packages without an explicit need and user approval. No package
  was installed during this migration.
- `_comp-lib` is the immutable scudamores-ui 0.1.0 handoff authority. Never edit
  it. `npm run verify:handoff` checks its inventory and hashes.
- Canonical UI copies are governed by `scripts/canonical-copies.json` and
  `npm run verify:canonical`.
- The worktree contains the active migration and is intentionally dirty. Do not
  discard or overwrite unrelated user changes.

## Current plan and status

1. Completed — namespaced routing and shared workspace shell.
2. Completed — preview-first workbench, source actions/docs, and intrinsic-width
   Calendar preview.
3. Completed — 45-entry sequential preview-review workflow (39 components and
   6 patterns).
4. Completed — searchable Components collection with URL-addressable List/Card
   views and lazy compact component previews.
5. Pending user review — choose one of four Brand colour candidates, set its
   scope, or reject all four.
6. In progress — migrate Brand pages to shared canonical styling and document
   reusable host patterns.
7. Pending — serialized module-by-module manual and automated bug audit,
   production verification, accessibility checks, and completion audit.

## Implemented architecture

- Shared shell, sidebar, workspace navigation, scoped command search, mobile
  modal drawer, dark-mode synchronization, and route-focus handoff.
- Brand routes under identity, expression, applications, and resources.
- Design System routes for foundations, components, patterns, roadmap,
  resources, and preview review.
- Workbench with persistent Preview/React/Blade selection, exact-file Copy and
  Download actions, and URL-addressed documentation.
- Components collection defaults to an alphabetized “All Components” List view,
  structurally following https://ui.shadcn.com/docs/components. Search and
  List/Card layout use `q` and `layout` URL parameters. Card thumbnails are
  compact, inert, and virtualized near the viewport so all 39 previews never
  mount together.
- Framework-source guardrail: absent source stays deferred or explicitly
  framework-specific; no inferred parity or copy action.
- Four applied Brand colour candidates at
  `/design-system/foundations/themes#brand-workspace-candidates`, documented in
  `docs/brand-colour-review.md`. Cream and Gold remain unapproved for app UI.
- Calendar preview now hugs its content and fits the mobile preview canvas.
- Route destinations retain programmatic focus for accessibility without a
  visible outline on non-interactive headings. Interactive controls retain
  normal focus rings.

## Current Brand migration checkpoint

- Added host-owned `PageHeader` in `src/components/shared/PageHeader.tsx`.
- Brand `SectionHeader` and Design System `DeveloperPageHeader` now share that
  implementation.
- `SectionSubNav` now composes the canonical Button, uses semantic roles,
  exposes `aria-current`, supports horizontal overflow, and respects reduced
  motion.
- These patterns are documented as host patterns in
  `docs/design-system-migration.md`; they are not canonical handoff components.
- Brand Overview is being migrated so application framing/navigation use
  semantic Design System styling while the logo, tagline, mission, Navy, and
  Off-White remain inside explicit authored Brand specimens.
- Added host-owned `GuidanceTable`: labelled, captioned, keyboard-scrollable,
  and overflow-safe without hiding columns on mobile. Applications, Voice,
  Photography, Graphics, and Logo tables now use it.
- Applications status badges now use canonical semantic Badge variants instead
  of emoji plus hardcoded colour utilities.

## Defects fixed during the current Brand migration

- Mood Explorer now selects the highest-contrast supplied token for every
  palette. Removed its background transition because it created a real
  transient contrast failure while the text colour changed immediately.
- Mood swatches have stable widths; all swatch labels use the approved Deep
  Navy on opaque Off-White pairing, including Brass.
- `ColourRamp` no longer emits empty headings and Colour's in-page navigation
  order now matches document order.
- Replaced invalid foreground use of the translucent `accent` surface role.
- Removed doubled Voice quotation marks, fixed Photography's nonexistent
  `text-navy-400`, improved Logo instructional alternatives, and removed
  duplicate DownloadButton icon spacing.
- Restored the Brand landing statement to an authored Deep Navy specimen with
  the approved White Outline logo and Off-White copy. The surrounding
  application header and navigation remain neutral and semantic.
- Charts now uses semantic application roles for axes, grids, and tooltips;
  offers keyboard-operable month highlighting; responds to dark mode; and
  provides visible equivalent data tables for every visualisation.
- Neutral guidance clusters in Overview, Typography, Photography, Graphics,
  Voice, Downloads, and Charts now compose the canonical Card surface. Authored
  logo/colour/type/photo canvases and Deep Navy Brand statements remain
  deliberately separate. Card titles were promoted to real document headings
  where needed.

## Colour decision gate

Review the four treatments on the Themes foundation page:

1. Neutral boundary.
2. Cream canvas.
3. Gold editorial cue.
4. Cream + Gold expression.

Record one candidate or reject all four, and state whether the choice applies to
all Brand pages or only expressive templates. Until then, do not recolour shell,
cards, controls, focus, status, charts, or other software semantics with Brand
values.

## Known issues requiring follow-up

High-priority issues found during the Brand module audit:

- Brand typography guidance repeatedly names Inter and Lato, but the running app
  loads Instrument Sans and neither font asset/package is present. This needs an
  explicit Brand decision; do not silently install a font package.
- Quick Reference is unmounted/stale; decide whether to restore it as a Brand
  route or remove it.

## Validation evidence so far

- `npm run verify:canonical` — passed: 16 exact canonical files, 2 classified
  host adapters.
- `npm run verify:handoff` — passed: 494 immutable files, 39 components,
  10 deferred records, 6 recipes, 6 foundations.
- `npm run verify:developer` — its handoff, canonical, typecheck, and build
  stages pass. The aggregate command cannot launch its final preview server in
  the restricted command sandbox (`listen EPERM`); the identical production
  smoke passes when invoked through the already approved direct Playwright
  command. Do not treat this as an application failure or install anything.
- `npm run typecheck` — passed after the Brand hero correction and component-card
  virtualization change.
- `npm run build` — passed after the Deep Navy Brand hero, cross-page canonical
  Card migration, and Charts accessibility work. Vite still reports the known
  large main-chunk warning (about 1.5 MB minified); treat code-splitting as a
  measured performance task, not part of the visual migration by accident.
- Production smoke — passed against the current build for the Brand root and a
  direct Button deep link, including live preview/source-tab readiness and no
  runtime or asset errors. Its stale root-heading assertion was updated for the
  new `Scudamore’s Brand` H1 while retaining an assertion for the slogan inside
  the labelled dark Brand statement region.
- Focus regression tests — 2 passed; focus handoff remains and route-heading
  outline style is explicitly asserted as `none`.
- Shared PageHeader/SectionSubNav browser regression — passed.
- Mood Explorer regression — passed across all four palettes, with every text
  sample at least 4.5:1 and every swatch at least 120 px wide.
- Mobile GuidanceTable regression — passed across Applications, Voice, and
  Photography, including keyboard horizontal scrolling and formerly hidden
  columns.
- Components collection — 4 focused tests passed for alphabetized List view,
  URL search/empty recovery, lazy Card previews, and WCAG A/AA in both layouts.
- Virtualized component-card regression — passed after changing previews to
  unmount again when they leave the extended viewport.
- Existing collection-route/navigation compatibility check — passed after the
  Components collection upgrade.
- Charts keyboard highlighting, theme-aware axes, and visible equivalent data
  tables — focused regression passed again after canonical Card/heading
  migration.
- Canonical Brand/Design System responsive route and WCAG A/AA audit — passed
  after the Charts migration, Deep Navy Brand hero correction, and multi-page
  Card migration (one worker, most recent run 23.3 seconds).
- Canonical Brand/Design System route and catalogue suite — 6 passed with one
  worker after the shared-header/navigation change (1.9 minutes).
- Earlier focused suites passed for all components, patterns, foundations,
  roadmap entries, portals, interactions, behaviour, accessibility, Calendar,
  workbench, preview review, shell, and visual snapshots.

Do not treat the earlier broad passes as proof of final completion: Brand pages
are still changing and the final module-by-module audit remains outstanding.

The grouped final-audit run was interrupted by a Codespace shutdown before it
returned a result. No result should be inferred from that interrupted run. At
the next session, resume serially with:

```sh
./node_modules/.bin/playwright test tests/workspace.shell.spec.ts tests/calendar.preview.spec.ts tests/component.collection.spec.ts tests/design-system.workbench.spec.ts tests/preview-review.spec.ts tests/brandkit.migration.spec.ts tests/brandkit.routes.spec.ts --workers=1
```

There were no lingering Vite, Playwright, or agent processes after recovery,
and `git diff --check` passed.

## Next safe actions

1. Continue the remaining Brand-page canonical Card/content-pattern migration.
2. Resolve or explicitly gate the typography authority mismatch.
3. Ask for the four-candidate colour decision when the manual preview is ready.
4. Decide whether stale Quick Reference should return as a Brand route or be
   removed.
5. Run the serialized build, production smoke, full accessibility/route suites,
   and module-by-module completion audit once implementation settles.
6. Update this file after each meaningful implementation/validation checkpoint.

## Useful references

- `docs/workspace-shell-decision.md`
- `docs/design-system-migration.md`
- `docs/brand-colour-review.md`
- `src/config/workspaces.ts`
- `src/router.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/features/developer/docs/Workbench.tsx`
- `src/features/review/PreviewReviewPage.tsx`
- `tests/workspace.shell.spec.ts`
- `tests/design-system.workbench.spec.ts`
- `tests/preview-review.spec.ts`
- `tests/calendar.preview.spec.ts`
