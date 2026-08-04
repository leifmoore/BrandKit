# Page Header

Page title, subtitle and responsive action region.

- Catalogue ID: `page-header`
- Category: `layout`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/layout/page-header.tsx`

Exports:

- `PageHeader`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `title` | `ReactNode` | Yes | — |
| `subtitle` | `ReactNode` | No | — |
| `actions` | `ReactNode` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/page-header/basic.tsx`

## Blade

Canonical tag: `<x-ui.page-header>`

Implementation files:

- `blade/library/resources/views/components/ui/page-header.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `title` | `string \| null` | No | `null` |
| `subtitle` | `string \| null` | No | `null` |

Slots:

- `default`
- `actions`

Events:

- None

Compatibility tags:

- `<x-layouts.app.page>`
- `<x-layouts.admin.page>`

Runtime dependencies:

- None.

Example: `blade/examples/page-header/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

## Parity notes

- No intentional visual or behavioral differences are recorded.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed`

- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/PageHeader.tsx` (`b2054b5f9dafa04493b47fa19c3ebb2e75033a0bd85d563f02cedba115f66529`)
- Machine-readable contract: `catalog/components/page-header.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
