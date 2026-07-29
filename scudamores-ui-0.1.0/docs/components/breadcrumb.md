# Breadcrumb

Hierarchical page location and navigation.

- Catalogue ID: `breadcrumb`
- Category: `navigation`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/breadcrumb.tsx`

Exports:

- `Breadcrumb`
- `BreadcrumbList`
- `BreadcrumbItem`
- `BreadcrumbLink`
- `BreadcrumbPage`
- `BreadcrumbSeparator`
- `BreadcrumbEllipsis`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-slot@1.1.2`
- `lucide-react@0.487.0`

Example: `react/examples/breadcrumb/basic.tsx`

## Blade

Canonical tag: `<x-ui.breadcrumb>`

Implementation files:

- `blade/library/resources/views/components/ui/breadcrumb.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/ellipsis.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/item.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/link.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/list.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/page.blade.php`
- `blade/library/resources/views/components/ui/breadcrumb/separator.blade.php`

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

Example: `blade/examples/breadcrumb/basic.blade.php`

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
- Source evidence: `src/app/components/ui/breadcrumb.tsx` (`c9fcf4df692c80c06ccc38c32f7045d1f389197c503edac32941cde64bada62e`)
- Machine-readable contract: `catalog/components/breadcrumb.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
