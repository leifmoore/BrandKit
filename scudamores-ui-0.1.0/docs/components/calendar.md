# Calendar

Single-date and date-range calendar selection.

- Catalogue ID: `calendar`
- Category: `forms`
- Maturity: `stable`
- Parity: `documented-exception`

## React

Implementation files:

- `react/components/ui/calendar.tsx`

Exports:

- `Calendar`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `mode` | `"single" \| "range"` | No | — |
| `selected` | `Date \| DateRange` | No | — |
| `onSelect` | `selection callback` | No | — |
| `showOutsideDays` | `boolean` | No | `true` |
| `showYearMonthDropdowns` | `boolean` | No | `false` |
| `className` | `string` | No | — |

Internal component dependencies:

- `button`
- `select`

Exact NPM dependencies:

- `date-fns@3.6.0`
- `lucide-react@0.487.0`
- `react-day-picker@8.10.1`

Example: `react/examples/calendar/basic.tsx`

## Blade

Canonical tag: `<x-ui.calendar>`

Implementation files:

- `blade/library/resources/views/components/ui/calendar.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `name` | `string` | No | `"date"` |
| `value` | `string` | No | `""` |
| `min` | `string \| null` | No | `null` |
| `max` | `string \| null` | No | `null` |
| `label` | `string` | No | `"Choose date"` |

Slots:

- `default`

Events:

- `ui:calendar:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/calendar/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`

## Parity notes

- React uses React DayPicker; Blade uses the library-owned Alpine date-grid controller while preserving the same visible calendar contract.
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
- Source evidence: `src/app/components/ui/calendar.tsx` (`72d2a470dc2e044c97db0c8b28627c4b83ef45f6b7fcaf4535c325c27f23f4fa`)
- Machine-readable contract: `catalog/components/calendar.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
