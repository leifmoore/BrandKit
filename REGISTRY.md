# Scudamore's component registry

The Brand Kit serves its React components as a [shadcn registry](https://ui.shadcn.com/docs/registry):
one JSON file per item at `https://brand-kit-ashen.vercel.app/r/<name>.json`. Each file holds the
component's source plus the npm packages and other registry items it needs. Running
`npx shadcn add` in another project downloads one item, writes its files into that project and
installs its dependencies. The installed code is a plain copy of `_comp-lib/react`, unchanged.

The Laravel Blade equivalent of every item is listed below. Blade installs aren't served by the
registry yet; copy them from `_comp-lib/blade/library/` as described in
[`_comp-lib/blade/INSTALL.md`](./_comp-lib/blade/INSTALL.md).

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

Blade-only components (no React version yet): `container`, `error`, `field`, `heading`, `link`, `navlist`, `radio`, `search`, `stats-card`, `subheading`, `text`.
<!-- registry-items:end -->

## Gaps and caveats

- **Icons:** React components use `lucide-react`; Blade uses Phosphor (`blade-phosphor-icons`), so
  icon names differ between the two.
- **Patterns** (the 31 recipes in `_comp-lib/recipes` and `_pattern-lib`) aren't in the registry
  yet. They're planned as a second phase.
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
