# Pagination

Composable page navigation links and ellipsis.

- Catalogue ID: `pagination`
- Category: `navigation`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/pagination.tsx`

Exports:

- `Pagination`
- `PaginationContent`
- `PaginationItem`
- `PaginationLink`
- `PaginationPrevious`
- `PaginationNext`
- `PaginationEllipsis`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `aria-label` | `string` | No | `"pagination"` |
| `className` | `string` | No | — |

Internal component dependencies:

- `button`

Exact NPM dependencies:

- `lucide-react@0.487.0`

Example: `react/examples/pagination/basic.tsx`

## Blade

Canonical tag: `<x-ui.pagination>`

Implementation files:

- `blade/library/resources/views/components/ui/pagination.blade.php`
- `blade/library/resources/views/components/ui/pagination/content.blade.php`
- `blade/library/resources/views/components/ui/pagination/ellipsis.blade.php`
- `blade/library/resources/views/components/ui/pagination/item.blade.php`
- `blade/library/resources/views/components/ui/pagination/link.blade.php`
- `blade/library/resources/views/components/ui/pagination/next.blade.php`
- `blade/library/resources/views/components/ui/pagination/previous.blade.php`

### Props and defaults

This component adds no local props beyond the underlying element or primitive contract.

Slots:

- `default`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/pagination/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

## Parity notes

- React uses Lucide and Blade uses Phosphor; semantic glyph, rendered size, weight, colour and alignment match while path shapes may differ.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed`

- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/pagination.tsx` (`10bad2279ea5120ade645a1a834ed74f2471cde0fe7f3e9457fcb4918b7d0bc3`)
- Machine-readable contract: `catalog/components/pagination.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
