# Textarea

Multi-line text input.

- Catalogue ID: `textarea`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/textarea.tsx`

Exports:

- `Textarea`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `aria-invalid` | `boolean \| 'true' \| 'false'` | No | `false` |
| `rows` | `number` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/textarea/basic.tsx`

## Blade

Canonical tag: `<x-ui.textarea>`

Implementation files:

- `blade/library/resources/views/components/ui/textarea.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `id` | `string \| null` | No | `null` |
| `value` | `mixed` | No | `""` |
| `label` | `string` | No | `""` |
| `bag` | `string` | No | `"default"` |
| `rows` | `int` | No | `3` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-textarea>`

Runtime dependencies:

- None.

Example: `blade/examples/textarea/basic.blade.php`

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
- Source evidence: `src/app/components/ui/textarea.tsx` (`96b97115e59d44c590f22014d23ff6e69488a122e152b24e1fb555fe7f871e73`)
- Machine-readable contract: `catalog/components/textarea.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
