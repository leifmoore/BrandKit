# Collapsible

A single expandable content region.

- Catalogue ID: `collapsible`
- Category: `disclosure`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/collapsible.tsx`

Exports:

- `Collapsible`
- `CollapsibleTrigger`
- `CollapsibleContent`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `boolean` | No | — |
| `defaultOpen` | `boolean` | No | `false` |
| `onOpenChange` | `(open: boolean) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-collapsible@1.1.3`

Example: `react/examples/collapsible/basic.tsx`

## Blade

Canonical tag: `<x-ui.collapsible>`

Implementation files:

- `blade/library/resources/views/components/ui/collapsible.blade.php`
- `blade/library/resources/views/components/ui/collapsible/content.blade.php`
- `blade/library/resources/views/components/ui/collapsible/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `bool` | No | `false` |

Slots:

- `default`

Events:

- `ui:collapsible:change`

Compatibility tags:

- `<x-toggle-button>`

Runtime dependencies:

- `alpinejs@3.15.8`
- `@alpinejs/collapse@3.15.8`

Example: `blade/examples/collapsible/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `open`, `closed`

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
- Source evidence: `src/app/components/ui/collapsible.tsx` (`b763764ebced561c04e2e6ada9dc53375bb90b9f4bcb91b0f3d5de7381aaf0cb`)
- Machine-readable contract: `catalog/components/collapsible.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
