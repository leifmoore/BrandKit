# Tabs

Segmented content navigation with keyboard support.

- Catalogue ID: `tabs`
- Category: `navigation`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/tabs.tsx`

Exports:

- `Tabs`
- `TabsList`
- `TabsTrigger`
- `TabsContent`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `value` | `string` | No | — |
| `defaultValue` | `string` | No | — |
| `onValueChange` | `(value: string) => void` | No | — |
| `orientation` | `"horizontal" \| "vertical"` | No | `"horizontal"` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-tabs@1.1.3`

Example: `react/examples/tabs/basic.tsx`

## Blade

Canonical tag: `<x-ui.tabs>`

Implementation files:

- `blade/library/resources/views/components/ui/tabs.blade.php`
- `blade/library/resources/views/components/ui/tabs/content.blade.php`
- `blade/library/resources/views/components/ui/tabs/list.blade.php`
- `blade/library/resources/views/components/ui/tabs/trigger.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `defaultValue` | `string` | Yes | — |

Slots:

- `default`
- `list`
- `content`

Events:

- `ui:tabs:change`

Compatibility tags:

- `<x-tabs>`
- `<x-tab-panel>`

Runtime dependencies:

- `alpinejs@3.15.8`

Example: `blade/examples/tabs/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`, `controlled`, `uncontrolled`

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
- Source evidence: `src/app/components/ui/tabs.tsx` (`933b8f421bd84b21a22e3fd11cd62fbf4fd8b6fb7252f42ea706b9cd29255051`)
- Machine-readable contract: `catalog/components/tabs.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
