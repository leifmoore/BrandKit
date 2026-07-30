# Button

Primary action primitive with semantic variants and sizes.

- Catalogue ID: `button`
- Category: `actions`
- Maturity: `stable`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/button.tsx`

Exports:

- `Button`
- `buttonVariants`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `ButtonVariant` | No | `"default"` |
| `size` | `ButtonSize` | No | `"default"` |
| `asChild` | `boolean` | No | `false` |
| `type` | `ButtonHTMLType` | No | `"button"` |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-slot@1.1.2`
- `class-variance-authority@0.7.1`

Example: `react/examples/button/basic.tsx`

## Blade

Canonical tag: `<x-ui.button>`

Implementation files:

- `blade/library/resources/views/components/ui/button.blade.php`
- `blade/library/resources/views/components/ui/button/group.blade.php`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `variant` | `string` | No | `"default"` |
| `size` | `string` | No | `"default"` |
| `type` | `string` | No | `"button"` |
| `href` | `string \| null` | No | `null` |
| `disabled` | `bool` | No | `false` |

Slots:

- `default`

Events:

- None

Compatibility tags:

- `<x-button>`
- `<x-button.action>`
- `<x-button.link>`

Runtime dependencies:

- None.

Example: `blade/examples/button/basic.blade.php`

## Variants, sizes, and states

- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sizes: `default`, `sm`, `lg`, `icon`
- Documented states: `default`, `disabled`, `focus-visible`

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
- Source evidence: `src/app/components/ui/button.tsx` (`b6a630aad6ccd5f8d5584ba2a1769b652b8e10455cece233eb59fc68954460a2`)
- Machine-readable contract: `catalog/components/button.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
