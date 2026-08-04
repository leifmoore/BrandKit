# Accessibility evidence and release policy

Visual parity with the verified DesignApp target is the release priority.
Semantic defects that do not change the approved appearance are corrected in
the handoff. A retained visual issue is never hidden: it appears in the owning
manifest and in `validation/reports/accessibility-review.json`.

## Automated evidence

- React: all 25 patterns are mounted in isolation and scanned with axe-core
  4.11 in both light and dark modes: 50 scans in total. The ruleset includes
  WCAG 2.0 A/AA, 2.1 A/AA, and 2.2 AA tags. Raw selectors, computed styles, and
  ancestor diagnostics remain in `validation/reports/react.json`.
- Blade: all 25 primary examples and all 42 fixture scenarios render in the
  clean Laravel 12 fixture. The fixture also caches 241 compiled views without
  failure. This is server-render and compilation evidence; it is not a claim
  that Alpine interactions have run in a browser.
- Catalogue: release validation rejects an accessibility status of `pending`.
  Each manifest is released as `passed` or `passed-with-findings`.

## Retained WCAG contrast findings

Two visual-parity choices remain below the WCAG AA 4.5:1 threshold for normal
text:

1. `availability-time-picker` uses `--epos-accent` for 12px discounted-price
   text. The measured contrast is 3.66:1 in light mode and 4.01:1 in dark mode.
   The approved colour is retained for visual parity. Consumers must retain the
   original-and-discounted price treatment so that discount meaning is not
   conveyed by colour alone.
2. `multi-query-manager` and its composition in `epos-booking-journey` use
   `--epos-accent-foreground` over `--epos-accent` for 14px selected-query
   pills. The measured contrast is 3.66:1 in both themes. The approved styling
   is retained for visual parity; selection is also programmatically exposed
   with `aria-pressed`.

These are deliberate release findings, not axe suppressions. A later token or
component revision can resolve them without changing the evidence for v0.1.0.

## Reviewed axe OKLCH results

axe-core 4.11 reported additional `color-contrast` results where its
legacy-sRGB conversion did not match the browser's computed OKLCH colour and
alpha stack. They were independently calculated from the locked tokens:

- `capacity-product-selector`: danger foreground over its 15% tint is 5.83:1;
  neutral foreground over the dark surface is 9.98:1.
- `grouped-results-table`: foreground over the dark card is 9.98:1.
- `quote-lookup` and `visit-time-heat-map`: foreground over the dark 3% input
  tint is at least 7.07:1 using conservative linear-light alpha compositing.
- `report-workspace-tabs`: foreground over the dark muted surface is 7.00:1.
- `responsive-data-collection`: success and warning foregrounds over their 15%
  tints are 6.84:1 and 6.93:1; neutral foreground over the dark surface is
  9.98:1.

These results are classified as independently cleared in
`validation/reports/accessibility-review.json`. The raw axe nodes and browser
diagnostics remain available in `validation/reports/react.json` for audit.

## Consumer responsibilities

The isolated scans cannot prove accessibility after a host replaces fixture
content, translates labels, introduces async behavior, changes breakpoints or
tokens, or supplies custom slots. The manifest for each affected pattern names
its specific integration caveat. In particular, consumers must test keyboard
operation and focus return for Alpine behaviors, error focus and announcements
for server or async flows, native date controls in supported browsers, payment
iframes, zoom/reflow with production data, and any host-supplied chart.

Data visualisations retain a tabular, non-colour equivalent. Host content around
fixed action docks must reserve enough safe-area/bottom space to prevent focus
targets from being obscured.
