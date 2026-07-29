# Aspect Ratio

Constrains media or content to a stable aspect ratio.

- Catalogue ID: `aspect-ratio`
- Category: `layout`
- Maturity: `beta`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/aspect-ratio.tsx`

Exports:

- `AspectRatio`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `ratio` | `number` | No | `1` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-aspect-ratio@1.1.2`

Example: `react/examples/aspect-ratio/basic.tsx`

## Blade

Canonical tag: `<x-ui.aspect-ratio>`

Implementation files:

- `blade/library/resources/views/components/ui/aspect-ratio.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `ratio` | `string \| float` | No | `"16 / 9"` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/aspect-ratio/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

## Parity notes

- React follows Radix's 1:1 default ratio; Blade defaults to 16:9. Pass an explicit ratio when cross-framework output must match.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed-with-findings`

- **serious:** React — Elements must meet minimum color contrast ratio thresholds (`accepted`)
- **serious:** Blade — Elements must meet minimum color contrast ratio thresholds (`accepted`)

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/aspect-ratio.tsx` (`7706745e217bebbc2d7bdf6697e9c6d484061146ae771755c9b6f240762c7217`)
- Machine-readable contract: `catalog/components/aspect-ratio.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
