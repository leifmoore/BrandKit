# Scudamore's UI handoff

This directory is a portable source handoff for the Developer section of the separate brand-guidelines React application. It contains canonical foundations, matched React and Laravel Blade source, searchable catalogue metadata, examples, migration context, and validation evidence. It is not the brand-kit application and does not depend on that application's current styling.

## Start here

1. Verify the release checksum described in `docs/RELEASES.md` before transfer.
2. Read `foundations/docs/tokens.md`, `foundations/docs/theming.md`, and `foundations/docs/exceptions.md` before integrating styles.
3. Load `catalog/catalog.json` to build Developer-section navigation, search, maturity badges, and framework tabs.
4. Read `docs/DEVELOPER-SECTION-CONTRACT.md` for the destination application's routing and source-display contract.
5. Follow `react/` or `blade/INSTALL.md` for framework-specific installation.

## Authority and boundaries

- `foundations/data/tokens.json` and `foundations/data/brands.json` are the maintained design-token sources of truth.
- `catalog/components/*.json` is the maintained source of truth for component metadata. `catalog/catalog.json` is its generated index.
- React source defines the approved visual and interaction target. Blade implementations preserve Laravel behavior while matching that target.
- The source snapshot is locked in `provenance/source-lock.json` at Git commit `d1511e224305585680723101a0b76be93eb9f2f0`.
- Nothing in this handoff imports from or reaches outside this directory.
- Historical audits are provenance, not runtime dependencies. Curated decisions live in `provenance/`; stale extraction dumps and product behavior are deliberately absent.

## What v0.1.0 contains

- 39 paired public components: 30 stable and 9 beta.
- 10 complex React components recorded as deferred inventory only.
- 6 paired, fixture-driven composition recipes.
- 1 Developer-section-only Device Preview Frame utility.
- A complete 80-file production Blade disposition and seven supporting PHP component records.
- Light/dark semantic tokens, seven brand presets, Tailwind v4 aliases, optional base styles, and Instrument Sans setup.

Copy source from the framework folders; do not scrape code samples from Markdown. The external site should use catalogue paths to present the real files in its code panels.
