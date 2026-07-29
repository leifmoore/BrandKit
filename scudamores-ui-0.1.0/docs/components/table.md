# Table

Composable semantic table primitives.

- Catalogue ID: `table`
- Category: `data-display`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/table.tsx`

Exports:

- `Table`
- `TableHeader`
- `TableBody`
- `TableFooter`
- `TableHead`
- `TableRow`
- `TableCell`
- `TableCaption`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/table/basic.tsx`

## Blade

Canonical tag: `<x-ui.table>`

Implementation files:

- `blade/library/resources/views/components/ui/table.blade.php`
- `blade/library/resources/views/components/ui/table/body.blade.php`
- `blade/library/resources/views/components/ui/table/caption.blade.php`
- `blade/library/resources/views/components/ui/table/cell.blade.php`
- `blade/library/resources/views/components/ui/table/footer.blade.php`
- `blade/library/resources/views/components/ui/table/head.blade.php`
- `blade/library/resources/views/components/ui/table/header.blade.php`
- `blade/library/resources/views/components/ui/table/row.blade.php`

### Props and defaults

This component adds no local props beyond the underlying element or primitive contract.

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-table.wrapper>`
- `<x-table.org-th>`
- `<x-table.org-td>`
- `<x-table.dash-th>`
- `<x-table.dash-td>`
- `<x-table.responsive.table>`
- `<x-table.responsive.tr>`
- `<x-table.responsive.td>`

Runtime dependencies:

- None.

Example: `blade/examples/table/basic.blade.php`

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
- Source evidence: `src/app/components/ui/table.tsx` (`e4ec7d3be042efd0fa363a57dd0e649a7831b86f975d4ec5192ebbfdd66e0f95`)
- Machine-readable contract: `catalog/components/table.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
