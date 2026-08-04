# Form

Framework-native form composition and validation messaging.

- Catalogue ID: `form`
- Category: `forms`
- Maturity: `beta`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/form.tsx`

Exports:

- `Form`
- `FormField`
- `FormItem`
- `FormLabel`
- `FormControl`
- `FormDescription`
- `FormMessage`
- `useFormField`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `control` | `react-hook-form Control` | Yes | — |
| `name` | `FieldPath` | Yes | — |
| `className` | `string` | No | — |

Internal component dependencies:

- `label`

Exact NPM dependencies:

- `@radix-ui/react-label@2.1.2`
- `@radix-ui/react-slot@1.1.2`
- `react-hook-form@7.55.0`

Example: `react/examples/form/basic.tsx`

## Blade

Canonical tag: `<x-ui.form>`

Implementation files:

- `blade/library/resources/views/components/ui/form.blade.php`
- `blade/library/resources/views/components/ui/form/control.blade.php`
- `blade/library/resources/views/components/ui/form/description.blade.php`
- `blade/library/resources/views/components/ui/form/item.blade.php`
- `blade/library/resources/views/components/ui/form/label.blade.php`
- `blade/library/resources/views/components/ui/form/message.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `action` | `string` | No | `""` |
| `method` | `string` | No | `"get"` |
| `upload` | `bool` | No | `false` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/form/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `invalid`

## Parity notes

- React validation is client-controlled through react-hook-form; Blade preserves CSRF, method spoofing, old values, named error bags and server validation.

The React edition is the visual target. An unrecorded difference is a defect. Consumer classes may control layout and spacing; Blade visual variants and sizes remain explicit props.

## Accessibility

- Target: `WCAG 2.2 AA`
- Audit status: `passed`

- No unresolved finding is currently recorded. Check the audit status before treating this as a pass.

Visual parity is the release priority. Fix issues that do not alter the approved design and keep every unresolved WCAG issue visible in the manifest and reports.

## Provenance

- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Verified: `2026-07-28`
- Source evidence: `src/app/components/ui/form.tsx` (`b181a640358bd91b827f7e3ba610036f24a976994d4d88b480471a167770a508`)
- Machine-readable contract: `catalog/components/form.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
