# Label

Accessible label for a form control.

- Catalogue ID: `label`
- Category: `forms`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/label.tsx`

Exports:

- `Label`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `htmlFor` | `string` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-label@2.1.2`

Example: `react/examples/label/basic.tsx`

## Blade

Canonical tag: `<x-ui.label>`

Implementation files:

- `blade/library/resources/views/components/ui/label.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `for` | `string \| null` | No | `null` |
| `value` | `string \| null` | No | `null` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-label>`

Runtime dependencies:

- None.

Example: `blade/examples/label/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

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
- Source evidence: `src/app/components/ui/label.tsx` (`5ed157f039340cedaa59a888931db608667827170ae9538513a50ccf2ca65a9f`)
- Machine-readable contract: `catalog/components/label.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
