# Toggle Group

Single- or multiple-selection group of pressed actions.

- Catalogue ID: `toggle-group`
- Category: `actions`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/toggle-group.tsx`

Exports:

- `ToggleGroup`
- `ToggleGroupItem`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `"single" \| "multiple"` | Yes | — |
| `variant` | `ToggleVariant` | No | `"default"` |
| `size` | `ToggleSize` | No | `"default"` |
| `value` | `string \| string[]` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- `toggle`

Exact NPM dependencies:

- `@radix-ui/react-toggle-group@1.1.2`
- `class-variance-authority@0.7.1`

Example: `react/examples/toggle-group/basic.tsx`

## Blade

Canonical tag: `<x-ui.toggle-group>`

Implementation files:

- `blade/library/resources/views/components/ui/toggle-group.blade.php`
- `blade/library/resources/views/components/ui/toggle-group/item.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `type` | `"single" \| "multiple"` | No | `"single"` |
| `value` | `string \| array` | No | — |
| `variant` | `string` | No | `"default"` |
| `size` | `string` | No | `"default"` |

Slots:

- `default`

Events:

- `ui:toggle-group:change`

Compatibility tags:

- `<x-button.group>`

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/toggle-group/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`, `outline`
- Sizes: `default`, `sm`, `lg`
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`, `checked`

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
- Source evidence: `src/app/components/ui/toggle-group.tsx` (`43e56c5487ed93a2e0d418dcf944a646c716b8c8c55d050fcda1d5cd1248cce6`)
- Machine-readable contract: `catalog/components/toggle-group.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
