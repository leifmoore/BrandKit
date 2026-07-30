# Avatar

An image with a resilient initials or text fallback.

- Catalogue ID: `avatar`
- Category: `data-display`
- Maturity: `beta`
- Parity: `framework-equivalent`

## React

Implementation files:

- `react/components/ui/avatar.tsx`

Exports:

- `Avatar`
- `AvatarImage`
- `AvatarFallback`

### Props and defaults

| Prop | Type | Required | Default |
| --- | --- | :---: | --- |
| `className` | `string` | No | — |

Internal component dependencies:

- None

Exact NPM dependencies:

- `@radix-ui/react-avatar@1.1.3`

Example: `react/examples/avatar/basic.tsx`

## Blade

Canonical tag: `<x-ui.avatar>`

Implementation files:

- `blade/library/resources/views/components/ui/avatar.blade.php`
- `blade/library/resources/views/components/ui/avatar/fallback.blade.php`
- `blade/library/resources/views/components/ui/avatar/image.blade.php`

### Props and defaults

This component adds no local props beyond the underlying element or primitive contract.

Slots:

- `default`
- `image`
- `fallback`

Events:

- None

Compatibility tags:

- None

Runtime dependencies:

- None.

Example: `blade/examples/avatar/basic.blade.php`

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
- Source evidence: `src/app/components/ui/avatar.tsx` (`d40b1cbabe71c094c6bcf089ac5702ec77623dbc75c770ca9f86530e03d6fea1`)
- Machine-readable contract: `catalog/components/avatar.json`

The destination Developer section must read implementation and example paths from the catalogue. It must not duplicate source snippets in Markdown.
