# Brand Kit integration

This document describes ingestion into the separate Brand Kit. It does not
implement that application.

## Directory contract

Keep `_pattern-lib` beside the existing `_comp-lib`. Verify
`catalog/base-library.json` before accepting the add-on. Do not overlay or
replace files in `_comp-lib`.

## Catalogue contract

1. Load `_comp-lib/catalog/catalog.json` and `_pattern-lib/catalog/catalog.json`.
2. Merge pattern entries by ID and fail on duplicates.
3. Keep component entries from the base catalogue unchanged.
4. Derive counts from the merged arrays rather than hard-coding six recipes.
5. Index title, description, category and search terms for pattern search.

`catalog/combined-catalog.json` is generated validation evidence and a useful
reference; the maintained sources remain the two package catalogues.

## Preview and source contract

- Import `react/preview-registry.tsx` and map each scenario to the existing
  workbench.
- Resolve `@scudamores/ui/*` to `_comp-lib/react/*`.
- Add raw-source imports for `_pattern-lib/recipes/**` so React, Blade, fixtures
  and README files can be copied or downloaded exactly.
- React remains the live runtime. Do not evaluate Blade/PHP in the browser.
- Expose viewport, light/dark, seven base brands, LTR/RTL and manifest-declared
  states through the current preview controls.

## Routes and deployment

Use `/design-system/patterns/:slug`. The current Vercel deployment requires an
SPA rewrite/fallback so a hard refresh of that route does not return 404.
