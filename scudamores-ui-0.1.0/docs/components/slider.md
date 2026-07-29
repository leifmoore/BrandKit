# Slider

Single or ranged numeric input.

- Catalogue ID: `slider`
- Category: `forms`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/slider.tsx`

Exports:

- `Slider`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `number[]` | No | — |
| `defaultValue` | `number[]` | No | — |
| `min` | `number` | No | `0` |
| `max` | `number` | No | `100` |
| `step` | `number` | No | `1` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-slider@1.2.3`

Example: `react/examples/slider/basic.tsx`

## Blade

Canonical tag: `<x-ui.slider>`

Implementation files:

- `blade/library/resources/views/components/ui/slider.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `value` | `float` | No | `0` |
| `min` | `float` | No | `0` |
| `max` | `float` | No | `100` |
| `step` | `float` | No | `1` |
| `label` | `string` | No | `"Value"` |

Slots:

- `default`

Events:

- `ui:slider:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/slider/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`

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
- Source evidence: `src/app/components/ui/slider.tsx` (`19dd9d8b758f41fa61967d1a0540ea34ed989727258d23eef9a50cdebcab805b`)
- Machine-readable contract: `catalog/components/slider.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
