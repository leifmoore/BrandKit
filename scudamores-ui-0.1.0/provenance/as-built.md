# As-built handoff record

## Release identity

- Package: `scudamores-ui`
- Version: `0.1.0`
- Source commit: `d1511e224305585680723101a0b76be93eb9f2f0`
- Extraction aggregate: `82b55ce6513ce99a55146a1fcc81533b7ecf5e53200a088135b0e8313afc1b6d`

## Maintained layers

1. Foundation JSON owns semantic and brand values.
2. Foundation CSS exposes ready-to-consume variables, brand overrides, Tailwind aliases, fonts, and optional global defaults.
3. React and Blade folders contain copyable framework implementations and actual example source.
4. Per-component and per-recipe manifests connect the two editions, previews, dependencies, parity, provenance, and accessibility status.
5. `catalog/catalog.json` is the destination application's navigation/search index.
6. `provenance/` explains why material was paired, wrapped, referenced, deferred, or excluded.
7. `validation/` records mechanical, behavioral, visual, accessibility, isolation, and transfer evidence.

## Invariants

- No distributable import or include escapes `_comp-lib`.
- The destination renders code panels from real source/example files, not duplicated Markdown snippets.
- React previews are interactive; Blade tabs are source/documentation only in the brand-kit.
- Compatibility wrappers delegate to canonical `<x-ui.*>` components and do not maintain a second visual implementation.
- Generated releases exclude prior releases, dependency folders, caches, temporary fixtures, and build output.

Completion evidence belongs in `validation/reports/`; this record describes the delivered architecture and does not substitute for those reports.

## Version 0.1.0 verification

- React clean-install typecheck and production build passed for all 39 component examples and six recipes.
- Laravel 12 validation passed with 8 tests and 83 assertions, including all canonical examples, all six recipes, 21 compatibility aliases and required form behavior.
- React browser validation passed 13/13 interaction checks; Blade passed 15/15.
- Axe audited all 39 examples in each edition. Calendar, Separator, Slider and other non-visual issues found during validation were fixed without changing the approved design.
- Two approved-design contrast values remain accepted findings across Button, Alert Dialog and Aspect Ratio; they are recorded in both framework reports and component manifests.
- Fourteen responsive component baselines cover 360, 768 and 1280px light/dark plus 768px RTL for both editions.
- Structural validation passed 1,117 catalogue, path, hash, dependency, isolation and coverage checks before packaging.
