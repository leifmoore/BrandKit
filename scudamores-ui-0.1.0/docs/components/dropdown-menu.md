# Dropdown Menu

Keyboard-navigable action and selection menu.

- Catalogue ID: `dropdown-menu`
- Category: `overlays`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/dropdown-menu.tsx`

Exports:

- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `DropdownMenuCheckboxItem`
- `DropdownMenuRadioGroup`
- `DropdownMenuRadioItem`
- `DropdownMenuLabel`
- `DropdownMenuSeparator`
- `DropdownMenuShortcut`
- `DropdownMenuGroup`
- `DropdownMenuSub`
- `DropdownMenuSubTrigger`
- `DropdownMenuSubContent`

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

- `@radix-ui/react-dropdown-menu@2.1.6`
- `lucide-react@0.487.0`

Example: `react/examples/dropdown-menu/basic.tsx`

## Blade

Canonical tag: `<x-ui.dropdown-menu>`

Implementation files:

- `blade/library/resources/views/components/ui/dropdown-menu.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/checkbox-item.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/content.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/group.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/item.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/label.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/radio-group.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/radio-item.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/separator.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/shortcut.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/sub-content.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/sub-trigger.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/sub.blade.php`
- `blade/library/resources/views/components/ui/dropdown-menu/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `open` | `bool` | No | `false` |
| `placement` | `string` | No | `"bottom-start"` |

Slots:

- `default`
- `trigger`

Events:

- `ui:dropdown-menu:change`

Compatibility tags:

- `<x-popover>`
- `<x-popover.item>`
- `<x-popover.separator>`

Runtime dependencies:

- `alpinejs@3.15.8`
- `@floating-ui/dom@1.7.4`

Example: `blade/examples/dropdown-menu/basic.blade.php`

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
- Source evidence: `src/app/components/ui/dropdown-menu.tsx` (`e00419a2aa59b6797f4c71eba29e05715be8627ba854bc3328eae4125108937f`)
- Machine-readable contract: `catalog/components/dropdown-menu.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
