# Alert

Persistent contextual feedback with semantic variants.

- Catalogue ID: `alert`
- Category: `feedback`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/alert.tsx`

Exports:

- `Alert`
- `AlertTitle`
- `AlertDescription`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `"default" \| "destructive"` | No | `"default"` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `class-variance-authority@0.7.1`

Example: `react/examples/alert/basic.tsx`

## Blade

Canonical tag: `<x-ui.alert>`

Implementation files:

- `blade/library/resources/views/components/ui/alert.blade.php`
- `blade/library/resources/views/components/ui/alert/description.blade.php`
- `blade/library/resources/views/components/ui/alert/title.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `string` | No | `"default"` |

Slots:

- `default`
- `title`
- `description`

Events:

- None

Compatibility tags:

- `<x-action-message>`
- `<x-auth-session-status>`
- `<x-session-status>`

Runtime dependencies:

- None.

Example: `blade/examples/alert/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`, `destructive`
- Sizes: None
- Documented states: `default`, `disabled`, `focus-visible`

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
- Source evidence: `src/app/components/ui/alert.tsx` (`19835c5f03b78e8915b5e8900a0681ddfb83e3bcc0c9930e62f31c01e4dfb129`)
- Machine-readable contract: `catalog/components/alert.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
