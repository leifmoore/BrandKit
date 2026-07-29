# Dialog

Modal content with focus management and composable regions.

- Catalogue ID: `dialog`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/dialog.tsx`

Exports:

- `Dialog`
- `DialogTrigger`
- `DialogClose`
- `DialogContent`
- `DialogHeader`
- `DialogFooter`
- `DialogTitle`
- `DialogDescription`

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

- `@radix-ui/react-dialog@1.1.6`
- `lucide-react@0.487.0`

Example: `react/examples/dialog/basic.tsx`

## Blade

Canonical tag: `<x-ui.dialog>`

Implementation files:

- `blade/library/resources/views/components/ui/dialog.blade.php`
- `blade/library/resources/views/components/ui/dialog/close.blade.php`
- `blade/library/resources/views/components/ui/dialog/content.blade.php`
- `blade/library/resources/views/components/ui/dialog/description.blade.php`
- `blade/library/resources/views/components/ui/dialog/footer.blade.php`
- `blade/library/resources/views/components/ui/dialog/header.blade.php`
- `blade/library/resources/views/components/ui/dialog/title.blade.php`
- `blade/library/resources/views/components/ui/dialog/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
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

- `ui:dialog:change`

Compatibility tags:

- `<x-modal>`

Runtime dependencies:

- `alpinejs@3.15.8`
- `@alpinejs/focus@3.15.8`

Example: `blade/examples/dialog/basic.blade.php`

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
- Source evidence: `src/app/components/ui/dialog.tsx` (`3a28db523af9e98c44c2606fa1ae54362484e8e8cc3bc8aab2e372ee14986d33`)
- Machine-readable contract: `catalog/components/dialog.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
