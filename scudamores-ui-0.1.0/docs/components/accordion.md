# Accordion

Expandable sections with optional single or multiple open items.

- Catalogue ID: `accordion`
- Category: `disclosure`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/accordion.tsx`

Exports:

- `Accordion`
- `AccordionItem`
- `AccordionTrigger`
- `AccordionContent`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `"single" \| "multiple"` | Yes | — |
| `collapsible` | `boolean` | No | `false` |
| `defaultValue` | `string \| string[]` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-accordion@1.2.3`
- `lucide-react@0.487.0`

Example: `react/examples/accordion/basic.tsx`

## Blade

Canonical tag: `<x-ui.accordion>`

Implementation files:

- `blade/library/resources/views/components/ui/accordion.blade.php`
- `blade/library/resources/views/components/ui/accordion/content.blade.php`
- `blade/library/resources/views/components/ui/accordion/item.blade.php`
- `blade/library/resources/views/components/ui/accordion/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `"single" \| "multiple"` | No | `"single"` |
| `collapsible` | `bool` | No | `true` |
| `defaultValue` | `string \| array \| null` | No | `null` |

Slots:

- `default`

Events:

- `ui:accordion:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`
- `@alpinejs/collapse@3.15.8`

Example: `blade/examples/accordion/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `open`, `closed`

## Parity notes

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
- Source evidence: `src/app/components/ui/accordion.tsx` (`0ff6fadd3560c21aa67911d817f89d206188fd07bd57244ba59a117bd4ff9cb4`)
- Machine-readable contract: `catalog/components/accordion.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
