# Brand workspace colour review

Status: applied candidates ready for manual review; no Cream or Gold application
role is approved yet.

## Fixed boundaries

- Deep Navy `#14284b` and Off-White `#fefefd` are official Brand identity
  colours. They remain available for authored assets, identity examples, and
  intentional Brand expression.
- Shared software chrome and canonical components use Design System semantic
  roles. Brand hex values do not silently replace `primary`, `ring`, status,
  destructive, chart, or accessibility semantics.
- The immutable `_comp-lib` 0.1.0 token source is never edited. The destination
  records two `muted-foreground` accessibility corrections: `#626b7b` in light
  mode and `#b0b8c4` in dark mode.

## Applied candidates

The public `/design-system/foundations/themes#brand-workspace-candidates` route
shows the same Brand guidance card in four treatments:

1. **Neutral boundary** — current baseline; Brand colour stays inside authored
   identity content.
2. **Cream canvas** — Cream 100 warms the Brand content canvas, while shell,
   cards, controls, focus, and status remain neutral.
3. **Gold editorial cue** — Lantern Gold appears only as restrained non-text
   rules, dividers, or authored highlights.
4. **Cream + gold expression** — combines the two candidate content roles
   without recolouring software chrome.

## Decision gate

Manual preview review comes first. After that review, record one candidate (or
reject all four) before migrating Brand page backgrounds and editorial accents.
The decision must also state whether it applies to every Brand page or only to
specific expressive templates. Until then, existing Brand specimens remain
authored examples rather than precedent for application chrome.
