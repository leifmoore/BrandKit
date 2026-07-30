# Popover

Anchored non-modal floating content.

- Catalogue ID: `popover`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/popover.tsx`

Exports:

- `Popover`
- `PopoverTrigger`
- `PopoverContent`
- `PopoverAnchor`

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

- `@radix-ui/react-popover@1.1.6`

Example: `react/examples/popover/basic.tsx`

## Blade

Canonical tag: `<x-ui.popover>`

Implementation files:

- `blade/library/resources/views/components/ui/popover.blade.php`
- `blade/library/resources/views/components/ui/popover/anchor.blade.php`
- `blade/library/resources/views/components/ui/popover/content.blade.php`
- `blade/library/resources/views/components/ui/popover/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `bool` | No | `false` |
| `placement` | `string` | No | `"bottom-start"` |

Slots:

- `default`
- `trigger`

Events:

- `ui:popover:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`
- `@floating-ui/dom@1.7.4`

Example: `blade/examples/popover/basic.blade.php`

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
- Source evidence: `src/app/components/ui/popover.tsx` (`0acc8ef7974cb132c8ed9226eb6a26fa12d66f76ba55dcfd07d39c99d9d5d21c`)
- Machine-readable contract: `catalog/components/popover.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
