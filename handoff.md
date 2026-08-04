# Brand Kit next-generation UI handoff

Last updated: 2026-08-04

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
- `npm run audit:brand:visual` uses its own one-worker Playwright config and
  writes the manual route contact sheet under the git-ignored
  `artifacts/brand-visual-audit/` tree, so normal test runs do not erase it.
- Do not install packages without an explicit need and user approval. No package
  was installed during this migration.
- `_comp-lib` is the immutable scudamores-ui 0.1.0 handoff authority. Never edit
  it. `npm run verify:handoff` checks its inventory and hashes.
- `_pattern-lib` is an immutable additive 0.1.0 pattern handoff. Keep it as a
  sibling of `_comp-lib`; host integration changes belong outside both packages.
- Canonical UI copies are governed by `scripts/canonical-copies.json` and
  `npm run verify:canonical`.
- The worktree contains the active migration and is intentionally dirty. Do not
  discard or overwrite unrelated user changes.

## Current plan and status

1. Completed — namespaced routing and shared workspace shell.
2. Completed — preview-first workbench, source actions/docs, and intrinsic-width
   Calendar preview.
3. Completed — 70-entry sequential preview-review workflow (39 components and
   31 patterns).
4. Completed — searchable Components collection with URL-addressable List/Card
   views and lazy compact component previews; Card view is the default.
5. Completed — establish the working contextual expression palette, rebuild
   the supporting Brand ramps toward Water Powder/Faded Butter, and keep Deep
   Navy/Off-White locked.
6. Completed — migrate Brand pages to shared canonical application styling,
   document reusable host patterns, and audit Overview/Quick Reference,
   Identity, Expression, Activation, and Resources at route-level checkpoints.
   Supplied company heroes intentionally remain labelled placeholders until
   product-specific approved masters arrive.
7. In progress — final serialized automated validation, user-led
   module-by-module preview review, Playground treatment selection, and the
   requirement-by-requirement completion audit.

## Implemented architecture

- Shared shell, sidebar, workspace navigation, scoped command search, mobile
  modal drawer, dark-mode synchronization, and route-focus handoff.
- Brand routes under identity, expression, applications, and resources.
- Design System routes for foundations, components, patterns, roadmap,
  resources, and preview review.
- Workbench with persistent Preview/React/Blade selection, exact-file Copy and
  Download actions, and URL-addressed documentation.
- Components collection defaults to an alphabetized “All Components” Card view.
  Search and List/Card layout use `q` and `layout` URL parameters. Card thumbnails are
  compact, inert, and virtualized near the viewport so all 39 previews never
  mount together.
- The read-only `_pattern-lib` add-on contributes 25 manifest-driven recipes to
  the six base recipes. All 31 patterns are searchable and use lazy card
  previews; detail pages expose declared scenarios, exact React/Blade/fixture
  source, API/dependency/accessibility/parity notes, and collection-specific
  back/previous/next navigation.
- The two approved visual-parity accessibility findings from the add-on are
  visibly retained on the collection and affected details; their source styles
  have not been changed.
- Recipe previews contain viewport-fixed descendants inside their own canvas,
  preventing Mobile Bottom Navigation or action docks from becoming global host
  chrome in detail or card previews.
- Framework-source guardrail: absent source stays deferred or explicitly
  framework-specific; no inferred parity or copy action.
- Brand Playground at `/brand/expression/playground` for two adaptive website
  patterns, nine context-led accent families, solid or grainy-gradient accent
  surfaces, independent photographic wash/grain, Navy or White glass, full
  0–100% card-tint opacity, local draft/snapshot persistence, and experimental
  JSON/CSS export. Its explicit Brand-workspace preview cannot cross into the
  software Design System.
- On desktop, the live preview—not the long control card—is sticky within the
  workbench. Its height is viewport-aware and it releases before Saved
  Candidates/Export; mobile retains ordinary document flow.
- Earlier Cream/Gold application proposals are not shown on the Themes page or
  presented as app-ready colours. Lantern Gold remains outside the runtime
  Brand palette.
- Brand supporting ramps now hold Deep Navy `#14284b` and Off-White `#fefefd`
  byte-for-byte while transitioning lighter blues toward Water Powder
  `#a2cddb` and warm lights toward Faded Butter `#feeacd`. Downloads expose the
  core ramps plus five tonal steps for every contextual expression family.
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

- Mood Explorer is now a photography-led composition explorer for Day Tours,
  Private Tours, Weddings, Summer, Riverside, and Twilight. Every recipe keeps
  the locked anchors, assigns a leading/supporting expression family, uses a
  contrast-safe opaque glass treatment, and can load its leading setup directly
  into the full Playground.
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
- Photography now uses the supplied landscape/portrait company hero pair as
  clearly labelled placeholders for all eleven product briefs. Optimized,
  reproducible derivatives live under `public/images/brand/heroes/`; run
  `npm run generate:brand-images` to regenerate them without a download or new
  dependency. Product-specific masters remain follow-up work.
- `docs/repo-context-map.md` maps routes, source authority, component ownership,
  Brand/Design boundaries, the photography pipeline, and principal test
  evidence for quick maintainer orientation.
- The application document/root are viewport-locked, main content owns vertical
  scrolling with overscroll containment, and the mobile top bar is sticky. This
  prevents wheel input at a route bottom from moving the shell into blank body
  space while preserving sidebar and anchor behavior.
- Overview/Quick Reference human-audit checkpoint: Overview retained its clean
  Navy/White authored specimens. Quick Reference now distinguishes locked,
  working-expression, and still-experimental treatment values; “Current scheme”
  was corrected to “Identity + current draft,” and copy actions were compacted.
- Identity human-audit checkpoint: Logo, Colour, and Typography were reviewed
  at top, middle, and bottom states. Logo guidance now permits only the supplied
  Solid Deep Navy, White Outline, or Full Colour artwork rather than ambiguously
  allowing expression-palette recolouring. Typography's tracking and apostrophe
  rules were corrected; the rendered Gill Sans Nova/Instrument Sans hierarchy,
  compact expression ramps, contextual use table, accessibility tools, and Mood
  Explorer were otherwise retained.
- Expression human-audit checkpoint: Voice, Photography, Graphics, and the
  Playground were reviewed at top, middle, and bottom states. Voice now follows
  its own smart-punctuation rule and no longer promises an unapproved Claude
  implementation; the future checker explicitly leaves provider, evaluation,
  privacy, and human review undecided. Photography consent guidance is marked
  as an operational draft requiring legal/privacy/HR ownership rather than
  making blanket rights claims. Graphics now limits grainy gradients to reviewed
  expression surfaces instead of contradicting the Playground, and its icon
  table exposes a visible Status heading. The Playground labels its intensity-
  adjusted output as a derived accent rather than a source tone.
- Activation human-audit checkpoint: Applications now presents a working
  inventory rather than claiming planning metadata is delivery proof. Digital
  examples use canonical software components and the separately governed chart
  palette, while Booking guidance points to canonical forms and date pickers.
  Social dimensions are explicitly rechecked against current platform
  requirements before export. Resources has aligned in-page navigation and
  exports locked identity anchors, supporting ramps, and documented expression
  ramps without implying that experimental Playground compositions are
  approved assets.
- Removed the old Lantern Gold ramp from live Brand tokens, Tailwind theme
  variables, command search, and the contrast checker. Historical Gold remains
  isolated to the Themes comparison. The live checker now covers the current
  supporting ramps and all nine expression families.
- Remembered workspace routes are checked against actual immutable catalogue
  records. A syntactically plausible but nonexistent component, pattern, or
  roadmap URL can no longer overwrite the user’s last real Design System page.
- Source Copy and Download popovers are now mutually exclusive and close after
  successful actions. Their clipboard status remains in a persistent live
  region, and browser coverage scopes each exact-file action to its active
  menu so Radix exit animations cannot create an ambiguous locator.

## Website-expression decision gate

Deep Navy `#14284b`, Off-White `#fefefd`, the Water Powder/Faded Butter ramp
directions, and the nine-family contextual expression model are settled as the
current working Brand direction. Continue reviewing real compositions until
the accent intensity, card tone/opacity, canvas warmth, photographic wash,
solid versus grainy gradient, and grain treatment feel right. Exported
Playground CSS/JSON remains experimental. Promoting stable website patterns
into a separately governed website design system is a later decision. Never
recolour shell, focus, status, charts, or other software semantics as a side
effect of Brand expression.

## Open decisions and follow-up

- Brand display typography now uses the user-supplied Adobe Fonts web project
  `iia4izu` and its exact `gill-sans-nova` family (Regular/Bold, upright/italic).
  Adobe files are not copied or self-hosted. The user approved Instrument Sans
  for Brand body copy as well as the software interface; it remains supplied by
  the existing pinned Fontsource package. No package was installed.
- Quick Reference was rebuilt at `/brand/quick-reference`. It reads the current
  Playground draft, separates locked and experimental values, documents the
  approved Gill Sans Nova/Instrument Sans pairing, and links to full guidance.
  The unused legacy navigation inventory in `src/lib/tokens.ts` was removed.
- Product-specific Photography masters remain a later asset-replacement task;
  the current supplied landscape and portrait company heroes are deliberately
  labelled as shared placeholders rather than silently treated as final.
- The latest production build is healthy but Vite reports a roughly 1.55 MB
  minified main chunk. Treat code splitting as a measured performance follow-up
  rather than mixing it into the remaining visual review.

## Validation evidence so far

- Pattern add-on integration checkpoint (2026-08-04) — both immutable handoff
  verifiers pass (494 base files and 367 add-on release files), with 25 add-on
  patterns / 31 combined patterns and exactly two retained findings. Typecheck,
  production build, built-SPA smoke, and the final one-worker browser suite pass;
  the browser result is 77 passed with the opt-in Brand capture intentionally
  skipped. The suite covers all 25 generated add-on previews, manifest scenarios,
  exact React/Blade/fixture sources, 70 review entries, cyclic detail navigation,
  fixed-pattern containment, dark mode, and the full catalogue axe sweep.
- `npm run verify:canonical` — passed: 16 exact canonical files, 2 classified
  host adapters.
- `npm run verify:handoff` — passed: 494 immutable files, 39 components,
  10 deferred records, 6 recipes, 6 foundations; generated foundation CSS and
  all six paired recipe contracts also validate.
- `npm run verify:developer` — its handoff, canonical, typecheck, and build
  stages pass. The aggregate command cannot launch its final preview server in
  the restricted command sandbox (`listen EPERM`); the identical production
  smoke passes when invoked through the already approved direct Playwright
  command. Do not treat this as an application failure or install anything.
- `npm run typecheck` — passed after the final live-colour cleanup and
  catalogue-backed remembered-route validation.
- `npm run build` — passed against the current source after the Activation and
  Resources audit. Vite reports the known main-chunk warning described above.
- Production smoke — passed against that current build on 2026-07-31 for the Brand root and a
  direct Button deep link, including live preview/source-tab readiness and no
  runtime or asset errors. Its stale root-heading assertion was updated for the
  new `Scudamore’s Brand` H1 while retaining an assertion for the slogan inside
  the labelled dark Brand statement region.
- Focus regression tests — 2 passed; focus handoff remains and route-heading
  outline style is explicitly asserted as `none`.
- Shared PageHeader/SectionSubNav browser regression — passed.
- Mood Explorer regression — passed across all six contextual recipes,
  including locked text anchors, four compact core swatches, five-step tonal
  ranges, and direct persisted handoff into the Playground.
- Mobile GuidanceTable regression — passed across Applications, Voice, and
  Photography, including keyboard horizontal scrolling and formerly hidden
  columns.
- Components collection — 4 focused tests passed for alphabetized default Card
  view, URL search/empty recovery, lazy previews, and WCAG A/AA in both layouts.
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
- Resumed cross-workspace completion lane — 31 passed with one worker (2.6
  minutes): Brand migration, responsive/a11y routes, Calendar intrinsic width,
  component collection, workbench, the then-current review queue, and workspace shell.
- Complete catalogue behaviour lane — 23 passed with one worker (2.7 minutes):
  all supported components, recipes, foundations, roadmap records, source
  fidelity, preview states, 13 interaction fixtures, 6 recipe callbacks, and 9
  scoped portal integrations with axe/cleanup checks.
- Full Design System accessibility lane — 2 passed with one worker (2.6
  minutes): every catalogue route matched the exact recorded WCAG A/AA result,
  and the mobile shell remained keyboard-labelled.
- Visual lane — all 6 Button baselines passed at 360, 768, and 1280 widths in
  the recorded light/dark/LTR/RTL combinations.
- Brand Playground and temporary Photography assets — 5 focused tests passed
  with one worker: pattern and viewport switching, responsive image art
  direction, a visible sticky preview at the lowest controls, control
  persistence, named save/load/delete, JSON export, cross-Brand accent preview
  with Design System isolation, live Quick Reference, eleven placeholder cards,
  mobile overflow, and WCAG A/AA.
- Affected colour/shell lane — 25 passed with one worker (2.0 minutes): all
  Playground behavior, Water Powder/Faded Butter-powered Colour controls,
  six-context Mood Explorer, chart semantic isolation, downloads, legacy route
  replacement, workspace persistence/search/drawer, and desktop/mobile
  overscroll containment. The dedicated bottom-wheel regression proves
  `window.scrollY` remains zero and the shell retains viewport bounds.
- Identity checkpoint lane — 5 passed with one worker after the Logo and type
  guidance corrections: licensed Brand typography, shared Colour framing, Mood
  Explorer, mobile Colour controls, and Logo clear-space behavior.
- Expression checkpoint lane — 2 passed with one worker for experimental-policy
  boundaries, consent qualification, table semantics, product-hero section
  flow, adaptive patterns, art direction, and the renamed derived token.
- Activation checkpoint lane — 2 passed with one worker for Applications and
  Resources claims, section navigation, canonical component boundaries, and
  the live expression palette in search/contrast tooling.
- Workspace shell regression — 8 passed with one worker after catalogue-backed
  route validation, including a valid-shaped nonexistent component URL that
  must not overwrite remembered navigation.
- Final pre-review serial sweep — 71 passed and the opt-in Brand capture test
  skipped as intended. It exposed one Copy/Download popover exit-animation
  race in the workbench test. The product state and locator were corrected;
  the affected workbench lane then passed 3/3 against the current source.
- Fresh integrity/build gate — handoff, canonical copies, TypeScript, production
  build, and whitespace validation all pass. The fresh built SPA production
  smoke passes 1/1 after the Source Actions and remembered-route changes.
- Latest Brand visual audit — regenerated successfully from the current source:
  33 top/middle/bottom route captures and the contact sheet are under
  `artifacts/brand-visual-audit/`.
- Dedicated Brand visual audit — passed after adding shell-readiness frames and
  regenerated 33 route-position captures plus the contact sheet with one worker.
- Repeatable Brand visual audit — passed with one worker via
  `npm run audit:brand:visual`; 33 route-position captures and a contact sheet
  persist under the git-ignored dedicated artifact tree. The subsequent focused
  Quick Reference/Brand accent regression passed after its audit corrections.
- Brand typography boundary — focused regression passed: the Adobe kit link and
  Gill Sans Nova display stack are present while software headings retain
  Instrument Sans. The test does not download Adobe font files in CI.
- Canonical Brand/Design System responsive route sweep — passed again with the
  new Playground route and optimized Photography images; no unexpected console,
  overflow, or WCAG A/AA findings (one worker, 26.6 seconds).
- Earlier focused suites passed for all components, patterns, foundations,
  roadmap entries, portals, interactions, behaviour, accessibility, Calendar,
  workbench, preview review, shell, and visual snapshots.

Do not treat the earlier broad passes as proof of final completion: the final
module-by-module user review and Playground treatment choice remain
outstanding.

The previously interrupted grouped audit was rerun from the clean recovery
checkpoint and passed all 31 tests. No long-running process was left behind.

## Safe pause checkpoint — 2026-07-31

- The worktree contains the complete active migration; it is intentionally
  uncommitted and must not be reset or cleaned.
- No package was installed, no dependency manifest changed for an install, and
  no dev server, preview server, browser, or test worker is intentionally left
  running.
- The latest handoff/canonical verifiers, TypeScript check, production build,
  production smoke, whitespace check, and Brand visual capture pass.
- The 73-test pre-review sweep produced 71 passes, one intentional opt-in skip,
  and one Source Actions popover race. That race was fixed and its complete
  workbench file now passes 3/3. Defer the next eight-minute aggregate rerun
  until after human findings so the two-core Codespace is not used twice for
  the same final gate.
- Resume with `docs/human-review-checklist.md`: review Brand routes, choose and
  save a Playground treatment, then work through the 70-entry Design System
  queue. Fix flagged modules before the final complete serial rerun.
- The active goal is not complete. Human colour-treatment selection and
  module-by-module review remain explicit completion gates.

## Next safe actions

1. Run the remaining final Brand and Design System browser lanes serially with
   one worker, including the full catalogue accessibility and visual suites.
2. Use `/design-system/review/previews` for the user-led 70-entry component and
   pattern review; record/fix every flagged defect module by module.
3. Review `/brand`, `/brand/quick-reference`, Identity, Expression, Activation,
   and Resources using the contact sheet and live routes.
4. Compare Navy/White glass, 0–100% opacity, solid/grainy accents, and the six
   Mood Explorer handoffs; save and choose a composition treatment before
   promoting any Playground export.
5. Rerun affected checks after human findings, then perform the explicit
   requirement-by-requirement completion audit. Keep the goal active until the
   human colour and module-review gates are evidenced.

## Useful references

- `docs/workspace-shell-decision.md`
- `docs/repo-context-map.md`
- `docs/human-review-checklist.md`
- `docs/design-system-migration.md`
- `docs/brand-colour-review.md`
- `src/config/workspaces.ts`
- `src/router.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/features/developer/docs/Workbench.tsx`
- `src/features/review/PreviewReviewPage.tsx`
- `src/pages/BrandPlayground.tsx`
- `src/pages/QuickReference.tsx`
- `src/features/brand-playground/`
- `tests/brand-playground.spec.ts`
- `tests/workspace.shell.spec.ts`
- `tests/design-system.workbench.spec.ts`
- `tests/preview-review.spec.ts`
- `tests/calendar.preview.spec.ts`
