# Sheet

Modal panel entering from any viewport edge.

- Catalogue ID: `sheet`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/sheet.tsx`

Exports:

- `Sheet`
- `SheetTrigger`
- `SheetClose`
- `SheetContent`
- `SheetHeader`
- `SheetFooter`
- `SheetTitle`
- `SheetDescription`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `boolean` | No | — |
| `defaultOpen` | `boolean` | No | `false` |
| `onOpenChange` | `(open: boolean) => void` | No | — |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | No | `"right"` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-dialog@1.1.6`
- `lucide-react@0.487.0`

Example: `react/examples/sheet/basic.tsx`

## Blade

Canonical tag: `<x-ui.sheet>`

Implementation files:

- `blade/library/resources/views/components/ui/sheet.blade.php`
- `blade/library/resources/views/components/ui/sheet/close.blade.php`
- `blade/library/resources/views/components/ui/sheet/content.blade.php`
- `blade/library/resources/views/components/ui/sheet/description.blade.php`
- `blade/library/resources/views/components/ui/sheet/footer.blade.php`
- `blade/library/resources/views/components/ui/sheet/header.blade.php`
- `blade/library/resources/views/components/ui/sheet/title.blade.php`
- `blade/library/resources/views/components/ui/sheet/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | No | `"right"` |
| `open` | `bool` | No | `false` |

Slots:

- `default`
- `trigger`
- `header`
- `title`
- `description`
- `content`
- `footer`

Events:

- `ui:sheet:change`

Compatibility tags:

- `<x-sidebar>`
- `<x-sidebar.toggle>`

Runtime dependencies:

- `alpinejs@3.15.8`
- `@alpinejs/focus@3.15.8`

Example: `blade/examples/sheet/basic.blade.php`

## Variants, sizes, and states

- Variants: `top`, `right`, `bottom`, `left`
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
- Source evidence: `src/app/components/ui/sheet.tsx` (`877cc293bc6106533d71a9fc59890bf6fbfa787e1377f8cf999d0488db01a4cc`)
- Machine-readable contract: `catalog/components/sheet.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
