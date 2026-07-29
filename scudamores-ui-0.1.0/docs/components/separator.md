# Separator

Horizontal or vertical visual separator.

- Catalogue ID: `separator`
- Category: `layout`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/separator.tsx`

Exports:

- `Separator`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `orientation` | `"horizontal" \| "vertical"` | No | `"horizontal"` |
| `decorative` | `boolean` | No | `true` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-separator@1.1.2`

Example: `react/examples/separator/basic.tsx`

## Blade

Canonical tag: `<x-ui.separator>`

Implementation files:

- `blade/library/resources/views/components/ui/separator.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `orientation` | `"horizontal" \| "vertical"` | No | `"horizontal"` |
| `decorative` | `bool` | No | `true` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-separator>`

Runtime dependencies:

- None.

Example: `blade/examples/separator/basic.blade.php`

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
- Source evidence: `src/app/components/ui/separator.tsx` (`54cc34fc3ef7e445948c5bccf7307efbb2c8f9e63db0fc68dd3fa8ee54dc9812`)
- Machine-readable contract: `catalog/components/separator.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
