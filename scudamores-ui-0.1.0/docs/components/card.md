# Card

Composable bordered content surface.

- Catalogue ID: `card`
- Category: `data-display`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/card.tsx`

Exports:

- `Card`
- `CardHeader`
- `CardFooter`
- `CardTitle`
- `CardAction`
- `CardDescription`
- `CardContent`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- None beyond shared React/style dependencies.

Example: `react/examples/card/basic.tsx`

## Blade

Canonical tag: `<x-ui.card>`

Implementation files:

- `blade/library/resources/views/components/ui/card.blade.php`
- `blade/library/resources/views/components/ui/card/action.blade.php`
- `blade/library/resources/views/components/ui/card/content.blade.php`
- `blade/library/resources/views/components/ui/card/description.blade.php`
- `blade/library/resources/views/components/ui/card/footer.blade.php`
- `blade/library/resources/views/components/ui/card/header.blade.php`
- `blade/library/resources/views/components/ui/card/title.blade.php`

### Props and defaults

This component adds no local props beyond the underlying element or primitive contract.

Slots:

- `default`
- `header`
- `title`
- `description`
- `action`
- `content`
- `footer`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/card/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`
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
- Source evidence: `src/app/components/ui/card.tsx` (`8a94ee07640a8970cb1c32d4233f921cf337b296d9828ba047fee7ddfa173de9`)
- Machine-readable contract: `catalog/components/card.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
