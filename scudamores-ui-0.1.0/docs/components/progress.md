# Progress

Determinate progress indicator.

- Catalogue ID: `progress`
- Category: `feedback`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/progress.tsx`

Exports:

- `Progress`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `number \| null` | No | `null` |
| `max` | `number` | No | `100` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-progress@1.1.2`

Example: `react/examples/progress/basic.tsx`

## Blade

Canonical tag: `<x-ui.progress>`

Implementation files:

- `blade/library/resources/views/components/ui/progress.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `float` | No | `0` |
| `max` | `float` | No | `100` |
| `label` | `string \| null` | No | `null` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/progress/basic.blade.php`

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
- Source evidence: `src/app/components/ui/progress.tsx` (`956cf4b485bcf57684caac10df2aa2a72387d0736d8f4cd1315c49ebd2da4615`)
- Machine-readable contract: `catalog/components/progress.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
