# Stepper

Bounded numeric increment and decrement control.

- Catalogue ID: `stepper`
- Category: `navigation`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/stepper.tsx`

Exports:

- `Stepper`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `number` | Yes | — |
| `onChange` | `(value: number) => void` | Yes | — |
| `min` | `number` | No | `0` |
| `max` | `number \| null` | No | `null` |
| `disabled` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- `button`

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/stepper/basic.tsx`

## Blade

Canonical tag: `<x-ui.stepper>`

Implementation files:

- `blade/library/resources/views/components/ui/stepper.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `value` | `float` | No | `0` |
| `min` | `float` | No | `0` |
| `max` | `float \| null` | No | `null` |
| `step` | `float` | No | `1` |
| `label` | `string` | No | `"Quantity"` |
| `disabled` | `bool` | No | `false` |

Slots:

- `default`

Events:

- `ui:stepper:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/stepper/basic.blade.php`

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
- Source evidence: `src/app/components/ui/stepper.tsx` (`188fd860cad078aab5119850a8746e0fe3463fd230f4b23bced7fe97ee7d9f5f`)
- Machine-readable contract: `catalog/components/stepper.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
