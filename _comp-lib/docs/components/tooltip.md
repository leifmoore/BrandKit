# Tooltip

Short non-essential help shown on hover or focus.

- Catalogue ID: `tooltip`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/tooltip.tsx`

Exports:

- `Tooltip`
- `TooltipTrigger`
- `TooltipContent`
- `TooltipProvider`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `delayDuration` | `number` | No | `0` |
| `open` | `boolean` | No | — |
| `onOpenChange` | `(open: boolean) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-tooltip@1.1.8`

Example: `react/examples/tooltip/basic.tsx`

## Blade

Canonical tag: `<x-ui.tooltip>`

Implementation files:

- `blade/library/resources/views/components/ui/tooltip.blade.php`
- `blade/library/resources/views/components/ui/tooltip/content.blade.php`
- `blade/library/resources/views/components/ui/tooltip/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `bool` | No | `false` |
| `placement` | `string` | No | `"top"` |
| `delay` | `int` | No | `0` |

Slots:

- `default`
- `trigger`
- `content`

Events:

- `ui:tooltip:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`
- `@floating-ui/dom@1.7.4`

Example: `blade/examples/tooltip/basic.blade.php`

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
- Source evidence: `src/app/components/ui/tooltip.tsx` (`2f3a8720fb4b75c6911450be73d0407e2a84bb5ea1ded28ccdbf955be62a0155`)
- Machine-readable contract: `catalog/components/tooltip.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
