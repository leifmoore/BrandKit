# Authoring and maintenance

## Sources of truth

1. `foundations/data/tokens.json` and `brands.json` own theme values.
2. A component's manifest owns its public catalogue metadata.
3. React and Blade implementations are intentionally hand-authored peers; one
   is never generated from the other.
4. `catalog/catalog.json` and CSS token outputs are generated artifacts.

## Adding or changing a component

1. Update both framework implementations and their basic example.
2. Update the component manifest: APIs, dependencies, tokens, parity and WCAG
   notes must be explicit.
3. Regenerate the catalogue and foundation CSS.
4. Run `node validation/scripts/validate.mjs` from `_comp-lib`.
5. Run the React and Laravel fixture checks described in `validation/README.md`.
6. Review light/dark and responsive captures before changing the version.

## Status policy

- `stable`: exercised by the DesignApp and supported in both frameworks.
- `beta`: copyable and tested in both frameworks but not proven in product use.
- `deferred`: inventoried only; no distributable implementation is claimed.
- `reference`: application-bound evidence, not portable source.
- `deprecated`: compatibility surface only; use the declared replacement.

## Boundary rule

All maintenance writes stay under `_comp-lib`. Upstream paths are immutable
evidence. If their hashes change, refresh provenance through an explicit audit
rather than copying changes automatically.
