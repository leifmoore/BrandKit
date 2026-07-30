# Checkbox

Checked, unchecked and indeterminate form control.

- Catalogue ID: `checkbox`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/checkbox.tsx`

Exports:

- `Checkbox`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `checked` | `boolean \| 'indeterminate'` | No | — |
| `defaultChecked` | `boolean` | No | — |
| `onCheckedChange` | `(checked) => void` | No | — |
| `disabled` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-checkbox@1.1.4`
- `lucide-react@0.487.0`

Example: `react/examples/checkbox/basic.tsx`

## Blade

Canonical tag: `<x-ui.checkbox>`

Implementation files:

- `blade/library/resources/views/components/ui/checkbox.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `id` | `string \| null` | No | `null` |
| `value` | `mixed` | No | `"1"` |
| `label` | `string` | No | `""` |
| `bag` | `string` | No | `"default"` |
| `checked` | `bool` | No | `false` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-checkbox>`

Runtime dependencies:

- None.

Example: `blade/examples/checkbox/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `checked`, `invalid`

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
- Source evidence: `src/app/components/ui/checkbox.tsx` (`754e4e5e6d739547b12bb6e8d760a893b77ee9a0ff38a6d82cb9d3b3b40a0761`)
- Machine-readable contract: `catalog/components/checkbox.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
