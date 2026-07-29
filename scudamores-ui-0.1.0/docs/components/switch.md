# Switch

Binary setting control.

- Catalogue ID: `switch`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/switch.tsx`

Exports:

- `Switch`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `checked` | `boolean` | No | — |
| `defaultChecked` | `boolean` | No | — |
| `onCheckedChange` | `(checked: boolean) => void` | No | — |
| `disabled` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-switch@1.1.3`

Example: `react/examples/switch/basic.tsx`

## Blade

Canonical tag: `<x-ui.switch>`

Implementation files:

- `blade/library/resources/views/components/ui/switch.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `checked` | `bool` | No | `false` |
| `value` | `string` | No | `"1"` |
| `label` | `string \| null` | No | `null` |
| `disabled` | `bool` | No | `false` |

Slots:

- `default`

Events:

- `ui:switch:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/switch/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `checked`

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
- Source evidence: `src/app/components/ui/switch.tsx` (`d4c744131c6161300510909aafe2c2cb6d819f2c7a8c2aeb75d4317004c7eff7`)
- Machine-readable contract: `catalog/components/switch.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
