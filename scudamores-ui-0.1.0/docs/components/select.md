# Select

Single-option selection with reliable framework-native form semantics.

- Catalogue ID: `select`
- Category: `forms`
- Maturity: `stable`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/select.tsx`

Exports:

- `Select`
- `SelectTrigger`
- `SelectValue`
- `SelectContent`
- `SelectGroup`
- `SelectLabel`
- `SelectItem`
- `SelectSeparator`
- `SelectScrollUpButton`
- `SelectScrollDownButton`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `string` | No | — |
| `defaultValue` | `string` | No | — |
| `onValueChange` | `(value: string) => void` | No | — |
| `disabled` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-select@2.1.6`
- `lucide-react@0.487.0`

Example: `react/examples/select/basic.tsx`

## Blade

Canonical tag: `<x-ui.select>`

Implementation files:

- `blade/library/resources/views/components/ui/select.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `id` | `string \| null` | No | `null` |
| `options` | `array \| enum class` | No | `[]` |
| `value` | `mixed` | No | `""` |
| `label` | `string` | No | `""` |
| `bag` | `string` | No | `"default"` |
| `multiple` | `bool` | No | `false` |
| `placeholder` | `string` | No | `""` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-select>`

Runtime dependencies:

- None.

Example: `blade/examples/select/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `invalid`

## Parity notes

- Blade intentionally uses a native select for form reliability. Its operating-system popup and multiple-selection mode do not visually match the React popup.
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
- Source evidence: `src/app/components/ui/select.tsx` (`568d45891a7f97b21d8968b4239be49f7fb9beb544c1d5ed0fe31bf87eed8547`)
- Machine-readable contract: `catalog/components/select.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
