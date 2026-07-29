# Page Container

Canonical responsive page width and gutters.

- Catalogue ID: `page-container`
- Category: `layout`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/layout/page-header.tsx`

Exports:

- `PageContainer`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `children` | `ReactNode` | Yes | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/page-container/basic.tsx`

## Blade

Canonical tag: `<x-ui.page-container>`

Implementation files:

- `blade/library/resources/views/components/ui/page-container.blade.php`

### Props and defaults

This component adds no local props beyond the underlying element or primitive contract.

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-container>`

Runtime dependencies:

- None.

Example: `blade/examples/page-container/basic.blade.php`

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
- Machine-readable contract: `catalog/components/page-container.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
