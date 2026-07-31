# Brand workspace colour review

Status: the contextual expression palette and its supporting blue/warm ramps
are accepted as a working Brand direction. Deep Navy and Off-White are locked;
exact intensity, solid/gradient treatment, and composition-level use remain
subject to manual visual review.

## Fixed boundaries

- Deep Navy `#14284b` and Off-White `#fefefd` are official Brand identity
  colours and the default pairing. Neither moves as supporting ramps evolve.
- The lighter blue ramp now transitions from Deep Navy toward Water Powder
  `#a2cddb`. The warm-light ramp transitions from Off-White toward Faded Butter
  `#feeacd`.
- Nine context-led expression families are documented on the Colour page:
  Faded Rose, River Coral, Sunlit Apricot, Punt Sand, Faded Butter, Riverside
  Sage, Water Powder, Evening Periwinkle, and Dusk Violet.
- Expression colours are not nine competing primary colours. Use one dominant
  family per composition, with Deep Navy and Off-White carrying recognition.
- Shared software chrome and canonical components use Design System semantic
  roles. Brand colours do not replace focus, status, destructive, validation,
  chart, or other software semantics.
- The stable software chart palette remains independently governed. It does
  not inherit the authored Water Powder/Faded Butter ramps.
- The immutable `_comp-lib` 0.1.0 token source is never edited.

## Authored ramps

The Brand token exports and Colour guidance use these current ramps:

- Blue: Midnight `#0a1530`, Deep Navy `#14284b`, River Dusk `#435e7b`,
  River Blue `#7295aa`, Water Powder `#a2cddb`, Water Mist `#d5e8ee`, and
  Water Vapour `#eaf3f6`.
- Warm light: Off-White `#fefefd`, Butter Vellum `#fefaf4`, Butter Cream
  `#fef7ec`, Soft Butter `#fef2e1`, Butter `#feeed7`, and Faded Butter
  `#feeacd`.

Every expression family also exposes compact `50`, `100`, `300`, `500`, and
`700` tonal steps. Source values sit at `500`; lighter steps mix toward
Off-White and the `700` step mixes toward Deep Navy. Downloads export these
working ramps for CSS, JSON, and SCSS.

## Context recipes

The Colour page Mood Explorer now previews six real contexts against supplied
photography: Day Tours, Private Tours, Weddings, Summer, Riverside, and
Twilight. Each recipe combines the locked anchors with one leading expression
family and one supporting family. An explicit action loads the leading accent,
glass tone, and grainy-gradient treatment into the full Brand Playground.

## Interactive exploration

`/brand/expression/playground` holds the two identity anchors fixed while
allowing live comparison of:

- all nine expression accent families and adjustable intensity;
- solid or grainy-gradient accent surfaces with independent tonal range and
  grain controls;
- Water Powder-led expressive blue depth and Faded Butter-led canvas warmth;
- Navy or White frosted cards, colour opacity from `0–100%`, and blur;
- a separate photographic colour wash and separate image grain;
- booking-hero and product-feature patterns at landscape and portrait widths.

At 0% frosted-card opacity the tint is genuinely transparent. The interface
warns that low-opacity copy depends on the photograph and must be tested on
every responsive crop.

Drafts and up to twelve named snapshots persist only in the browser. JSON and
CSS exports preserve the full state. An explicit “Preview across Brand
workspace” switch applies the selected solid/gradient accent treatment to
Brand primary actions and authored cues. It never crosses into the Design
System or changes status, focus, chart, or canonical component definitions.
Quick Reference reflects the same draft.

## Historical comparisons

`/design-system/foundations/themes#brand-workspace-candidates` retains four
early neutral/Cream/Gold treatments for migration history. Lantern Gold remains
an unapproved historical proposal and is not part of the contextual expression
family.

## Remaining decision gate

The palette family and ramp direction are settled enough to use in the current
Brand workspace. Manual review must still record which intensity, card tone,
opacity, gradient, grain, and photography treatment is appropriate for each
real composition before any recipe is described as a production website
standard. A separately governed website design system remains a later decision.
