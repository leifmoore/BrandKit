# Alert Dialog

A modal confirmation surface for consequential actions.

- Catalogue ID: `alert-dialog`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/alert-dialog.tsx`

Exports:

- `AlertDialog`
- `AlertDialogTrigger`
- `AlertDialogContent`
- `AlertDialogHeader`
- `AlertDialogFooter`
- `AlertDialogTitle`
- `AlertDialogDescription`
- `AlertDialogAction`
- `AlertDialogCancel`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `boolean` | No | — |
| `defaultOpen` | `boolean` | No | `false` |
| `onOpenChange` | `(open: boolean) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- `button`

Exact NPM dependencies:

- `@radix-ui/react-alert-dialog@1.1.6`

Example: `react/examples/alert-dialog/basic.tsx`

## Blade

Canonical tag: `<x-ui.alert-dialog>`

Implementation files:

- `blade/library/resources/views/components/ui/alert-dialog.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/action.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/cancel.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/content.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/description.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/footer.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/header.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/title.blade.php`
- `blade/library/resources/views/components/ui/alert-dialog/trigger.blade.php`

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
- `footer`

Events:

- `ui:alert-dialog:change`
- `ui:alert-dialog:confirm`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`
- `@alpinejs/focus@3.15.8`

Example: `blade/examples/alert-dialog/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `open`, `closed`

## Parity notes

- No intentional visual or behavioral differences are recorded.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed-with-findings`

- **serious:** React — Elements must meet minimum color contrast ratio thresholds (`accepted`)
- **serious:** Blade — Elements must meet minimum color contrast ratio thresholds (`accepted`)

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/alert-dialog.tsx` (`0cb29c237388cf17f30ed7676afbd6b88b484f0600123715622e4e1a12a732a8`)
- Machine-readable contract: `catalog/components/alert-dialog.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
