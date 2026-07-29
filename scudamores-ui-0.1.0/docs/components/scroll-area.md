# Scroll Area

Styled overflow region with optional scrollbars.

- Catalogue ID: `scroll-area`
- Category: `layout`
- Maturity: `stable`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/scroll-area.tsx`

Exports:

- `ScrollArea`
- `ScrollBar`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `"auto" \| "always" \| "scroll" \| "hover"` | No | `"hover"` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-scroll-area@1.2.3`

Example: `react/examples/scroll-area/basic.tsx`

## Blade

Canonical tag: `<x-ui.scroll-area>`

Implementation files:

- `blade/library/resources/views/components/ui/scroll-area.blade.php`
- `blade/library/resources/views/components/ui/scroll-area/bar.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | No | `"vertical"` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/scroll-area/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

## Parity notes

- Blade retains native overflow and scrollbar semantics; React delegates the viewport and scrollbar parts to Radix.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed`

- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/scroll-area.tsx` (`5bd9bb1d6909467b431283e96d2a9c83003bca1aa043d149dcfed8e81de51986`)
- Machine-readable contract: `catalog/components/scroll-area.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
