# Toast / Sonner

Host-neutral toast viewport and notification surface.

- Catalogue ID: `toast`
- Category: `feedback`
- Maturity: `stable`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/sonner.tsx`

Exports:

- `Toaster`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `theme` | `"light" \| "dark" \| "system"` | No | `"system"` |
| `position` | `ToasterPosition` | No | `"bottom-right"` |
| `className` | `string` | No | — |

Internal component dependencies:

- `theme`

Exact NPM dependencies:

- `sonner@2.0.3`

Example: `react/examples/toast/basic.tsx`

## Blade

Canonical tag: `<x-ui.toast>`

Implementation files:

- `blade/library/resources/views/components/ui/sonner.blade.php`
- `blade/library/resources/views/components/ui/sonner/toast.blade.php`
- `blade/library/resources/views/components/ui/toast.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `"default" \| "destructive"` | No | `"default"` |
| `duration` | `int` | No | `5000` |
| `title` | `string \| null` | No | `null` |

Slots:

- `default`

Events:

- `ui:toast:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/toast/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

## Parity notes

- React uses Sonner; Blade uses the library-owned Alpine toast store and event lifecycle.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed`

- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/sonner.tsx` (`cb523ee7ca1b933a9ed30f7bcbe5c5ce7fec73157b07ac4abcf15ed533ebbbca`)
- Machine-readable contract: `catalog/components/toast.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
