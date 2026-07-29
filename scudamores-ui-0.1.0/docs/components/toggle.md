# Toggle

Single pressed or unpressed action.

- Catalogue ID: `toggle`
- Category: `actions`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/toggle.tsx`

Exports:

- `Toggle`
- `toggleVariants`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `ToggleVariant` | No | `"default"` |
| `size` | `ToggleSize` | No | `"default"` |
| `pressed` | `boolean` | No | — |
| `onPressedChange` | `(pressed: boolean) => void` | No | — |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-toggle@1.1.2`
- `class-variance-authority@0.7.1`

Example: `react/examples/toggle/basic.tsx`

## Blade

Canonical tag: `<x-ui.toggle>`

Implementation files:

- `blade/library/resources/views/components/ui/toggle.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `pressed` | `bool` | No | `false` |
| `variant` | `string` | No | `"default"` |
| `size` | `string` | No | `"default"` |

Slots:

- `default`

Events:

- `ui:toggle:change`

Compatibility tags:

- None

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/toggle/basic.blade.php`

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
- Source evidence: `src/app/components/ui/toggle.tsx` (`a4aa131bd69af6b81dbddd4c806753dc3e77c466c0c983ec65da520fc0946a21`)
- Machine-readable contract: `catalog/components/toggle.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
