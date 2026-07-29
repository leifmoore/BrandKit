# Badge

Compact semantic status or metadata label.

- Catalogue ID: `badge`
- Category: `data-display`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/badge.tsx`

Exports:

- `Badge`
- `badgeVariants`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `BadgeVariant` | No | `"default"` |
| `asChild` | `boolean` | No | `false` |
| `dot` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-slot@1.1.2`
- `class-variance-authority@0.7.1`

Example: `react/examples/badge/basic.tsx`

## Blade

Canonical tag: `<x-ui.badge>`

Implementation files:

- `blade/library/resources/views/components/ui/badge.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `string` | No | `"default"` |
| `dot` | `bool` | No | `false` |
| `href` | `string \| null` | No | `null` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-badge>`
- `<x-ref-badge>`
- `<x-source-badge>`
- `<x-users.status-badge>`

Runtime dependencies:

- None.

Example: `blade/examples/badge/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `tint`
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
- Source evidence: `src/app/components/ui/badge.tsx` (`10bca91ba0519571d0f32eeccab928d93bc1c50f2875c0696c694a763f49302a`)
- Machine-readable contract: `catalog/components/badge.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
