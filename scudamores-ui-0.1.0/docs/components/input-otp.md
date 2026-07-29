# Input OTP

Grouped one-time-code entry slots.

- Catalogue ID: `input-otp`
- Category: `forms`
- Maturity: `stable`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/input-otp.tsx`

Exports:

- `InputOTP`
- `InputOTPGroup`
- `InputOTPSlot`
- `InputOTPSeparator`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `maxLength` | `number` | Yes | — |
| `value` | `string` | No | — |
| `onChange` | `(value: string) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `input-otp@1.4.2`
- `lucide-react@0.487.0`

Example: `react/examples/input-otp/basic.tsx`

## Blade

Canonical tag: `<x-ui.input-otp>`

Implementation files:

- `blade/library/resources/views/components/ui/input-otp.blade.php`
- `blade/library/resources/views/components/ui/input-otp/group.blade.php`
- `blade/library/resources/views/components/ui/input-otp/separator.blade.php`
- `blade/library/resources/views/components/ui/input-otp/slot.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | Yes | — |
| `length` | `int` | No | `6` |
| `value` | `string` | No | `""` |
| `label` | `string` | No | `"One-time password"` |

Slots:

- `default`

Events:

- `ui:input-otp:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/input-otp/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `invalid`

## Parity notes

- The Blade edition uses a library-owned Alpine controller instead of the React input-otp package.
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
- Source evidence: `src/app/components/ui/input-otp.tsx` (`b15b03f71841b176baa6e0294a0790eea1ffe9264c55003fbbc9039d8457057b`)
- Machine-readable contract: `catalog/components/input-otp.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
