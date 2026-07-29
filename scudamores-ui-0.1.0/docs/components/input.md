# Input

Text and native input types with semantic invalid states.

- Catalogue ID: `input`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/input.tsx`

Exports:

- `Input`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `HTMLInputTypeAttribute` | No | `"text"` |
| `aria-invalid` | `boolean \| 'true' \| 'false'` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/input/basic.tsx`

## Blade

Canonical tag: `<x-ui.input>`

Implementation files:

- `blade/library/resources/views/components/ui/input.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `id` | `string \| null` | No | `null` |
| `type` | `string` | No | `"text"` |
| `value` | `mixed` | No | `""` |
| `label` | `string` | No | `""` |
| `bag` | `string` | No | `"default"` |
| `size` | `"default" \| "sm" \| "xs"` | No | `"default"` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-input>`

Runtime dependencies:

- None.

Example: `blade/examples/input/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `invalid`

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
- Source evidence: `src/app/components/ui/input.tsx` (`e3278294350e1ed7daf843a770688057e488cfbed1df82a9685fc63123441480`)
- Machine-readable contract: `catalog/components/input.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
