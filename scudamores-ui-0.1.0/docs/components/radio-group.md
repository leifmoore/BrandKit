# Radio Group

Mutually exclusive options with keyboard navigation.

- Catalogue ID: `radio-group`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/radio-group.tsx`

Exports:

- `RadioGroup`
- `RadioGroupItem`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `string` | No | — |
| `defaultValue` | `string` | No | — |
| `onValueChange` | `(value: string) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-radio-group@1.2.3`
- `lucide-react@0.487.0`

Example: `react/examples/radio-group/basic.tsx`

## Blade

Canonical tag: `<x-ui.radio-group>`

Implementation files:

- `blade/library/resources/views/components/ui/radio-group.blade.php`
- `blade/library/resources/views/components/ui/radio-group/item.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `label` | `string \| null` | No | `null` |
| `name` | `string` | Yes | — |
| `value` | `mixed` | No | `""` |
| `bag` | `string` | No | `"default"` |
| `checked` | `bool` | No | `false` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-radio>`

Runtime dependencies:

- None.

Example: `blade/examples/radio-group/basic.blade.php`

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
- Source evidence: `src/app/components/ui/radio-group.tsx` (`3bd663b3c91237f264469ba500109f502e587468b4f77390af8877a8e9974c3f`)
- Machine-readable contract: `catalog/components/radio-group.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
