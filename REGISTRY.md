# Scudamore's component registry

The Brand Kit serves its React components as a [shadcn registry](https://ui.shadcn.com/docs/registry):
one JSON file per item at `https://brand-kit-ashen.vercel.app/r/<name>.json`. Each file holds the
component's source plus the npm packages and other registry items it needs. Running
`npx shadcn add` in another project downloads one item, writes its files into that project and
installs its dependencies. The installed code is a plain copy of `_comp-lib/react`, unchanged.

The Laravel Blade equivalent of every item is listed below. The Blade edition ships separately as
one zip; see [Laravel Blade kit](#laravel-blade-kit).

## Set up a new React project

Tested with a fresh `npm create vite` React + TypeScript project (Vite 8, TypeScript 7,
Tailwind 4.3).

1. **Use React 18.3.1.** The library is pinned to it; `calendar` depends on
   `react-day-picker@8`, which doesn't support React 19.

   ```sh
   npm i react@18.3.1 react-dom@18.3.1 && npm i -D @types/react@18.3.28 @types/react-dom@18.3.7
   ```

2. **Keep installed versions exact.** Add an `.npmrc` containing `save-exact=true`, so the pinned
   versions from the registry aren't loosened to `^` ranges.
3. **Add Tailwind v4 and the `@` alias** as in the
   [shadcn Vite guide](https://ui.shadcn.com/docs/installation/vite): `npm i -D tailwindcss
   @tailwindcss/vite`, `@import "tailwindcss";` in `src/index.css`, the `tailwindcss()` Vite plugin,
   and `"paths": { "@/*": ["./src/*"] }` in both `tsconfig.json` and `tsconfig.app.json` plus a
   matching `resolve.alias` in `vite.config.ts`.
4. **Initialise shadcn:** `npx shadcn@4.23.0 init -b radix -p nova`. The theme item replaces the
   preset's colours, font and radius.
5. **Register the namespace** in the new `components.json`:

   ```json
   "registries": {
     "@scudamores": "https://brand-kit-ashen.vercel.app/r/{name}.json"
   }
   ```

6. **Install the theme, then the theme provider:**

   ```sh
   npx shadcn@4.23.0 add @scudamores/theme @scudamores/theme-provider
   ```

   Wrap the app in `<ThemeProvider>` (from `@/components/theme-provider`). It applies `.dark` to
   `<html>` for light, dark or system mode and remembers the choice. `useTheme()` reads and sets it.
7. **If you use `calendar`**, set `"verbatimModuleSyntax": false` in `tsconfig.app.json`. The Vite
   template enables it, and `calendar.tsx` has one type import without the `type` keyword. It's
   the only component affected; the fix belongs in the next `_comp-lib` handoff.

## Install components

```sh
npx shadcn@4.23.0 add @scudamores/button      # one component, plus what it needs
npx shadcn@4.23.0 add @scudamores/all         # theme, provider and every component
```

- Components land in `src/components/ui/` and are imported from `@/components/ui/<name>`, except
  `toast` (`@/components/ui/sonner`) and `page-container`/`page-header` (`@/components/ui/page-header`).
  `theme-scope` lands in `src/runtime/theme.tsx`, where `sonner.tsx` imports it from.
- Every component shares `src/components/ui/utils.ts` (`cn()`), installed automatically.
- **Updating:** run the same `add` command with `--overwrite`. Local edits to installed files are
  replaced, so restyle by composition (`className`) rather than by editing component files.
- Re-installing `theme` is safe; it only rewrites the token values in `src/index.css`.
- Without the namespace, use full URLs: `npx shadcn@4.23.0 add https://brand-kit-ashen.vercel.app/r/button.json`.

## Install patterns

Patterns are the 31 product-shaped recipes (booking journeys, reports, toolbars) from
`_comp-lib/recipes` and `_pattern-lib/recipes`, built from the components above.

```sh
npx shadcn@4.23.0 add @scudamores/pattern-quote-builder   # one pattern, plus what it needs
npx shadcn@4.23.0 add @scudamores/all-patterns            # every pattern
```

- A pattern lands in `src/patterns/<pattern>/react/`, with its sample data in
  `src/patterns/<pattern>/fixtures/`. The components it uses and `patterns-base` (a few dark-mode
  contrast rules, added to `src/index.css`) are installed with it.
- Each file exports the recipe component, which takes controlled props and callbacks (use it with
  real data), and a `*Preview` adapter that only wires the sample data to local state.
- Unlike components, patterns are starting points and may be adapted. Re-adding with
  `--overwrite` replaces local edits.
- `kpi-stat-grid` has an unused `import * as React from "react";` line, which fails type-checking
  when `noUnusedLocals` is on (the Vite template's default). Delete the line after installing;
  the fix belongs in the next `_pattern-lib` handoff.
- The build copies each recipe to `.registry-build/` (git-ignored) with its repo-only imports
  (`@scudamores/ui/...`, `../../../react/...`) rewritten to `@/components/ui/...`, and fails if a
  recipe imports anything else unexpected or if `registry.json` doesn't match the catalogue.

## Laravel Blade kit

Every Blade component and pattern in one zip, for rebuilding the React prototype as a Laravel 12
app. The zip is laid out like a Laravel app, so it unpacks in place. From the app root:

```sh
curl -fsSL https://brand-kit-ashen.vercel.app/blade/scudamores-blade.zip -o scudamores-blade.zip && unzip -o scudamores-blade.zip && rm scudamores-blade.zip
```

- It adds the library (`app/View/Components/Ui/`, `resources/views/components/ui/`,
  `resources/js/ui/`, `resources/css/scudamores/`), the 31 patterns as `<x-patterns.<id>>`
  components, and a `scudamores/` folder holding the agent guide, version, file manifest,
  dependency pins, examples, fixtures, pattern docs and the compatibility layer for older apps.
- **The agent guide**, `scudamores/AGENTS.md`, is also at
  <https://brand-kit-ashen.vercel.app/blade/AGENTS.md>. It covers setup, a React → Blade table for
  every component and pattern, updating, migrating an existing app, and how to feed changes back
  to the Brand Kit.
- **The developer guide**, `scudamores/README.md`, is also at
  <https://brand-kit-ashen.vercel.app/blade/README.md> (source:
  [`registry/blade-kit-README.md`](./registry/blade-kit-README.md)). It's for the developers who
  receive the app: what the kit owns, how to connect patterns to the backend (props in, events
  out), forms and validation, updating, and feeding changes back.
- The Design System's resources page has the same download button and command, and links to both
  guides.
- [`scripts/build-blade-kit.mjs`](./scripts/build-blade-kit.mjs) builds it on every deploy (and alone
  as `npm run build:blade-kit`) into `public/blade/` (git-ignored). It has no dependencies, and the
  same source always produces a byte-identical zip.
- **Fixes in the kit's copies:** the handoff Blade has bugs that break Alpine at runtime, and the
  build fixes them in the kit's copies (never in `_comp-lib` or `_pattern-lib`):
  - Blade doesn't compile `@js()`/`@json()` inside `<x-…>` tag attributes, so they become
    `{{ \Illuminate\Support\Js::from() }}`.
  - Laravel prints `"` in a component attribute as `\"`, which ends the HTML attribute early, so
    it becomes `&quot;`.
  - `report-filter-builder` has a `@foreach` inside a component tag. It's replaced with a
    JavaScript loop by an exact-match patch that fails the build once the handoff fixes it.

  The build fails if a Blade directive is left inside a component tag, or if a library stylesheet
  path isn't in its rewrite table. These bugs should be fixed upstream in the next handoff.
- `checkout-details-panel` needs `:errors` passed explicitly (`[]` when empty), because Laravel
  shares its own `$errors` with every view.

## Items

Purpose and Blade paths come from the catalogue (`_comp-lib/catalog/components/*.json`). Blade paths
are where the file goes in a Laravel app; the source is the same path under
`_comp-lib/blade/library/` in this repo. Beta items are supported, but their API may still change.

<!-- registry-items:start -->
| Item | Purpose | Maturity | Blade tag | Blade path |
|---|---|---|---|---|
| `theme` | Brand tokens (light and dark), Instrument Sans, radius scale and brand accent classes. Install first. | — | — | resources/css/index.css (imports the same foundations/css tokens) |
| `theme-provider` | App-level light/dark/system mode: toggles .dark on the html element and follows the OS setting. | — | — | React only |
| `utils` | cn() helper (clsx + tailwind-merge) imported by every component as ./utils. | — | — | React only |
| `theme-scope` | Applies dark mode or a brand accent to one subtree (previews, embedded panels). | — | — | React only |
| `accordion` | Expandable sections with optional single or multiple open items. | beta | `<x-ui.accordion>` | `resources/views/components/ui/accordion.blade.php` |
| `alert-dialog` | A modal confirmation surface for consequential actions. | stable | `<x-ui.alert-dialog>` | `resources/views/components/ui/alert-dialog.blade.php` |
| `alert` | Persistent contextual feedback with semantic variants. | stable | `<x-ui.alert>` | `resources/views/components/ui/alert.blade.php` |
| `aspect-ratio` | Constrains media or content to a stable aspect ratio. | beta | `<x-ui.aspect-ratio>` | `resources/views/components/ui/aspect-ratio.blade.php` |
| `avatar` | An image with a resilient initials or text fallback. | beta | `<x-ui.avatar>` | `resources/views/components/ui/avatar.blade.php` |
| `badge` | Compact semantic status or metadata label. | stable | `<x-ui.badge>` | `resources/views/components/ui/badge.blade.php` |
| `breadcrumb` | Hierarchical page location and navigation. | beta | `<x-ui.breadcrumb>` | `resources/views/components/ui/breadcrumb.blade.php` |
| `button` | Primary action primitive with semantic variants and sizes. | stable | `<x-ui.button>` | `resources/views/components/ui/button.blade.php` |
| `calendar` | Single-date and date-range calendar selection. | stable | `<x-ui.calendar>` | `resources/views/components/ui/calendar.blade.php` |
| `card` | Composable bordered content surface. | stable | `<x-ui.card>` | `resources/views/components/ui/card.blade.php` |
| `checkbox` | Checked, unchecked and indeterminate form control. | stable | `<x-ui.checkbox>` | `resources/views/components/ui/checkbox.blade.php` |
| `collapsible` | A single expandable content region. | stable | `<x-ui.collapsible>` | `resources/views/components/ui/collapsible.blade.php` |
| `dialog` | Modal content with focus management and composable regions. | stable | `<x-ui.dialog>` | `resources/views/components/ui/dialog.blade.php` |
| `dropdown-menu` | Keyboard-navigable action and selection menu. | stable | `<x-ui.dropdown-menu>` | `resources/views/components/ui/dropdown-menu.blade.php` |
| `form` | Framework-native form composition and validation messaging. | beta | `<x-ui.form>` | `resources/views/components/ui/form.blade.php` |
| `input-otp` | Grouped one-time-code entry slots. | stable | `<x-ui.input-otp>` | `resources/views/components/ui/input-otp.blade.php` |
| `input` | Text and native input types with semantic invalid states. | stable | `<x-ui.input>` | `resources/views/components/ui/input.blade.php` |
| `label` | Accessible label for a form control. | stable | `<x-ui.label>` | `resources/views/components/ui/label.blade.php` |
| `page-container` | Canonical responsive page width and gutters. | stable | `<x-ui.page-container>` | `resources/views/components/ui/page-container.blade.php` |
| `page-header` | Page title, subtitle and responsive action region. | stable | `<x-ui.page-header>` | `resources/views/components/ui/page-header.blade.php` |
| `pagination` | Composable page navigation links and ellipsis. | beta | `<x-ui.pagination>` | `resources/views/components/ui/pagination.blade.php` |
| `popover` | Anchored non-modal floating content. | stable | `<x-ui.popover>` | `resources/views/components/ui/popover.blade.php` |
| `progress` | Determinate progress indicator. | beta | `<x-ui.progress>` | `resources/views/components/ui/progress.blade.php` |
| `radio-group` | Mutually exclusive options with keyboard navigation. | stable | `<x-ui.radio-group>` | `resources/views/components/ui/radio-group.blade.php` |
| `scroll-area` | Styled overflow region with optional scrollbars. | stable | `<x-ui.scroll-area>` | `resources/views/components/ui/scroll-area.blade.php` |
| `select` | Single-option selection with reliable framework-native form semantics. | stable | `<x-ui.select>` | `resources/views/components/ui/select.blade.php` |
| `separator` | Horizontal or vertical visual separator. | stable | `<x-ui.separator>` | `resources/views/components/ui/separator.blade.php` |
| `sheet` | Modal panel entering from any viewport edge. | stable | `<x-ui.sheet>` | `resources/views/components/ui/sheet.blade.php` |
| `skeleton` | Placeholder surface for loading content. | beta | `<x-ui.skeleton>` | `resources/views/components/ui/skeleton.blade.php` |
| `slider` | Single or ranged numeric input. | beta | `<x-ui.slider>` | `resources/views/components/ui/slider.blade.php` |
| `stepper` | Bounded numeric increment and decrement control. | stable | `<x-ui.stepper>` | `resources/views/components/ui/stepper.blade.php` |
| `switch` | Binary setting control. | stable | `<x-ui.switch>` | `resources/views/components/ui/switch.blade.php` |
| `table` | Composable semantic table primitives. | stable | `<x-ui.table>` | `resources/views/components/ui/table.blade.php` |
| `tabs` | Segmented content navigation with keyboard support. | stable | `<x-ui.tabs>` | `resources/views/components/ui/tabs.blade.php` |
| `textarea` | Multi-line text input. | stable | `<x-ui.textarea>` | `resources/views/components/ui/textarea.blade.php` |
| `toast` | Host-neutral toast viewport and notification surface. | stable | `<x-ui.toast>` | `resources/views/components/ui/sonner.blade.php` |
| `toggle-group` | Single- or multiple-selection group of pressed actions. | stable | `<x-ui.toggle-group>` | `resources/views/components/ui/toggle-group.blade.php` |
| `toggle` | Single pressed or unpressed action. | stable | `<x-ui.toggle>` | `resources/views/components/ui/toggle.blade.php` |
| `tooltip` | Short non-essential help shown on hover or focus. | stable | `<x-ui.tooltip>` | `resources/views/components/ui/tooltip.blade.php` |
| `all` | Theme, theme provider and every component in one install. | — | — | — |

| Pattern | Purpose | Maturity | Blade source |
|---|---|---|---|
| `pattern-availability-time-picker` | Location, pricing-view, time-band, and exact-time selection for a booking. | beta | `_pattern-lib/recipes/availability-time-picker/blade/availability-time-picker.blade.php` |
| `pattern-availability-toggle-list` | Availability switches with one default item. | stable | `_comp-lib/recipes/availability-toggle-list/blade/availability-toggle-list.blade.php` |
| `pattern-booking-card` | Compact booking identity and status card. | stable | `_comp-lib/recipes/booking-card/blade/booking-card.blade.php` |
| `pattern-booking-criteria-panel` | Date, party composition, and accessibility criteria for the start of a booking journey. | beta | `_pattern-lib/recipes/booking-criteria-panel/blade/booking-criteria-panel.blade.php` |
| `pattern-booking-details-dialog` | Read and action booking-detail composition. | stable | `_comp-lib/recipes/booking-details-dialog/blade/booking-details-dialog.blade.php` |
| `pattern-booking-progress-indicator` | Complete, current, and upcoming states for a short booking journey. | beta | `_pattern-lib/recipes/booking-progress-indicator/blade/booking-progress-indicator.blade.php` |
| `pattern-booking-review-summary` | Expandable booking lines, editable actions and host-calculated totals. | beta | `_pattern-lib/recipes/booking-review-summary/blade/booking-review-summary.blade.php` |
| `pattern-capacity-product-selector` | Expandable products with tier quantities and party-capacity feedback. | beta | `_pattern-lib/recipes/capacity-product-selector/blade/capacity-product-selector.blade.php` |
| `pattern-channel-logo-picker` | Host-controlled channel logo selection. | stable | `_comp-lib/recipes/channel-logo-picker/blade/channel-logo-picker.blade.php` |
| `pattern-checkout-details-panel` | Customer contact fields, validation and optional operational metadata. | beta | `_pattern-lib/recipes/checkout-details-panel/blade/checkout-details-panel.blade.php` |
| `pattern-collection-state-panel` | Consistent loading, empty, error, and restricted states for collection surfaces. | beta | `_pattern-lib/recipes/collection-state-panel/blade/collection-state-panel.blade.php` |
| `pattern-collection-toolbar` | Wrapping search, filters, sorting, layout controls, result count, and host actions. | beta | `_pattern-lib/recipes/collection-toolbar/blade/collection-toolbar.blade.php` |
| `pattern-configuration-workbench` | A task shell combining configuration fields, options, live preview, and implementation handoff. | beta | `_pattern-lib/recipes/configuration-workbench/blade/configuration-workbench.blade.php` |
| `pattern-contextual-action-dock` | Safe-area-aware mobile workflow actions with an optional summary and total. | beta | `_pattern-lib/recipes/contextual-action-dock/blade/contextual-action-dock.blade.php` |
| `pattern-customer-booking-journey` | A public ticket, date, time, customer-details, host-payment, and confirmation flow. | beta | `_pattern-lib/recipes/customer-booking-journey/blade/customer-booking-journey.blade.php` |
| `pattern-discount-builder` | Discount entry with presets, live price preview, limits, and approval guidance. | beta | `_pattern-lib/recipes/discount-builder/blade/discount-builder.blade.php` |
| `pattern-epos-booking-journey` | Three-stage orchestration for booking criteria, availability, review and checkout. | beta | `_pattern-lib/recipes/epos-booking-journey/blade/epos-booking-journey.blade.php` |
| `pattern-grouped-results-table` | A host-aggregated results table with groups, subtotals, totals and empty state. | beta | `_pattern-lib/recipes/grouped-results-table/blade/grouped-results-table.blade.php` |
| `pattern-kpi-stat-grid` | Responsive report summary cards with machine-safe values and host-supplied trends. | beta | `_pattern-lib/recipes/kpi-stat-grid/blade/kpi-stat-grid.blade.php` |
| `pattern-mobile-bottom-navigation` | Safe-area-aware primary destinations with optional focus-trapped More-sheet overflow. | beta | `_pattern-lib/recipes/mobile-bottom-navigation/blade/mobile-bottom-navigation.blade.php` |
| `pattern-multi-query-manager` | Scrollable booking-query pills with add, remove, and clear actions. | beta | `_pattern-lib/recipes/multi-query-manager/blade/multi-query-manager.blade.php` |
| `pattern-people-popover-content` | Party quantities and accessibility selection. | stable | `_comp-lib/recipes/people-popover-content/blade/people-popover-content.blade.php` |
| `pattern-quick-launch` | Frequently used destination cards. | stable | `_comp-lib/recipes/quick-launch/blade/quick-launch.blade.php` |
| `pattern-quote-builder` | Recipient, offered-time, price-range, and expiry composition for a quote draft. | beta | `_pattern-lib/recipes/quote-builder/blade/quote-builder.blade.php` |
| `pattern-quote-lookup` | Reference lookup with ready, not-found, expired, and redeemed result states. | beta | `_pattern-lib/recipes/quote-lookup/blade/quote-lookup.blade.php` |
| `pattern-reference-redemption-journey` | Lookup, not-found, expired, review, confirm, and completion states for a saved reference. | beta | `_pattern-lib/recipes/reference-redemption-journey/blade/reference-redemption-journey.blade.php` |
| `pattern-report-breakdown-table` | A host-aggregated hierarchy of reporting groups, child items and totals. | beta | `_pattern-lib/recipes/report-breakdown-table/blade/report-breakdown-table.blade.php` |
| `pattern-report-filter-builder` | Draft and apply date and dimension filters with explicit empty-selection semantics. | beta | `_pattern-lib/recipes/report-filter-builder/blade/report-filter-builder.blade.php` |
| `pattern-report-workspace-tabs` | A responsive, scrollable tab rail for switching analytical report views. | beta | `_pattern-lib/recipes/report-workspace-tabs/blade/report-workspace-tabs.blade.php` |
| `pattern-responsive-data-collection` | The same neutral records rendered as a semantic desktop table and mobile cards. | beta | `_pattern-lib/recipes/responsive-data-collection/blade/responsive-data-collection.blade.php` |
| `pattern-visit-time-heat-map` | A day-by-hour distribution with paired controls, peak summary and accessible data table. | beta | `_pattern-lib/recipes/visit-time-heat-map/blade/visit-time-heat-map.blade.php` |
| `patterns-base` | Dark-mode contrast rules shared by the pattern recipes. Installed automatically with any pattern. | — | — |
| `all-patterns` | Pattern styles and every pattern recipe, with the components they use, in one install. | — | — |

Blade-only components (no React version yet): `container`, `error`, `field`, `heading`, `link`, `navlist`, `radio`, `search`, `stats-card`, `subheading`, `text`.
<!-- registry-items:end -->

## Gaps and caveats

- **Icons:** React components use `lucide-react`; Blade uses Phosphor (`blade-phosphor-icons`), so
  icon names differ between the two.
- **`ThemeScope`** (`theme-scope`) can force dark mode or a brand accent on a subtree, but it can't
  force light inside a dark `<html>`, because the token variables inherit.
- **Deferred** in both stacks, metadata only: carousel, chart, command-palette, context-menu,
  drawer, hover-card, menubar, navigation-menu, resizable-panels, sidebar.
- **Fonts:** the theme loads Instrument Sans only. The Brand Kit site's Gill Sans Nova display font
  comes from a domain-locked Typekit kit and isn't part of the component library.
- **Global base styles:** the optional typography reset in `_comp-lib/foundations/css/base.css`
  isn't installed; components don't need it.

## How the registry is built

- [`registry.json`](./registry.json) lists every item. File paths point into `_comp-lib/react` and
  [`registry/`](./registry) in place, so the immutable handoff is never copied or edited.
- [`scripts/build-registry.mjs`](./scripts/build-registry.mjs) runs at the start of
  `npm run build` (or alone as `npm run build:registry`). It has no dependencies and produces the
  same output as `npx shadcn build` (checked byte-for-byte with shadcn 4.23.0). It writes
  `public/r/*.json` (git-ignored, copied to `dist/r/` by Vite), regenerates the item table above and
  [`docs/prototype-claude-index.md`](./docs/prototype-claude-index.md), and fails the build if:
  - a catalogue component is missing from `registry.json`, or its npm packages or versions differ
    from the catalogue and `_comp-lib/react/dependencies.json`;
  - the theme's variables, brand classes, dark variant, font or radius differ from
    `_comp-lib/foundations/css`;
  - an item depends on something that isn't one of our items (a bare name like `button` would
    otherwise silently pull shadcn's own component);
  - a listed file is missing, or sits outside `_comp-lib/react/` and `registry/` (so a mistaken
    path such as `.env` can never be published).
- The JSON files are static. The Brand Kit's pages never load them, so site performance is
  unaffected.

**Adding a component:** add it to the catalogue handoff, then add an item to `registry.json`
following the existing ones, and run `npm run build:registry`. The build tells you what's missing.

**Testing locally:** `REGISTRY_BASE_URL=http://localhost:4173 npm run build:registry`, serve
`public/` on that port, and point a test project's `@scudamores` namespace at
`http://localhost:4173/r/{name}.json`. Run a normal build afterwards so the production URLs are
restored.

## Security

- The registry only republishes source that's already public on the Design System pages.
- The Brand Kit gains no new dependencies: the build script uses Node built-ins only.
- In consuming projects, pin the CLI (`npx shadcn@4.23.0`), keep `save-exact=true`, and review
  installed files in the diff or PR like any other change. Install while developing and commit the
  files; don't fetch from the registry during a deploy.
