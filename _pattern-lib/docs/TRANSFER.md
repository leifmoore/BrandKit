# Transfer checklist

The pattern handoff is an add-on, not a standalone application. Transfer it
beside the existing Scudamore's UI component handoff.

## Verify the downloads

1. Keep `scudamores-ui-0.1.0.zip` and
   `scudamores-patterns-0.1.0.zip` as separate archives.
2. Run `sha256sum --check <archive>.sha256` for each archive before extraction.
3. Confirm the component archive SHA-256 matches the lock in
   `catalog/base-library.json`.
4. Extract each archive into its own `_comp-lib/` or `_pattern-lib/` directory.
   The archives contain directory contents, not the outer directory itself.
5. Keep the two directories as siblings. Pattern sources intentionally import
   the component package aliases documented by the base-library lock.

## Verify the extracted pattern handoff

`export-manifest.json` lists every released file except itself. For each entry,
verify both `bytes` and `sha256`; its `rootSha256` covers the ordered set of
paths, sizes and hashes. A file absent from the manifest was not part of the
validated release.

The release intentionally excludes:

- `releases/` and any previously generated archive;
- `node_modules/` and Composer `vendor/` dependencies;
- `tmp/`, `dist/`, `build/`, `coverage/` and tool caches.

Install dependencies afresh from the included lockfiles when rerunning the
validation suite. Do not copy a dependency or cache directory from this
workspace.

## Integrate into the design-system project

1. Read `START-HERE.md` and `docs/BRAND-KIT-INTEGRATION.md`.
2. Load `catalog/catalog.json` for the 25 new patterns, or
   `catalog/combined-catalog.json` for the base recipes plus these patterns.
3. Use `react/preview-registry.tsx` for live React previews.
4. Read React and Blade code tabs from the exact files declared by each recipe
   manifest; do not duplicate source snippets in page content.
5. Preserve the host responsibilities and parity exceptions recorded in each
   manifest and README.
6. Run the consumer application's own typecheck, build, visual review and
   accessibility suite after wiring its shell, routes and theme controls.

## Release evidence

The release command runs catalogue generation, structural/schema/import
checks, Blade compilation and Laravel rendering, strict React typechecking,
React build/smoke/a11y and targeted interaction checks, hashed visual-baseline
verification, and the workspace boundary check before packaging. It then
generates the final inventory, creates the ZIP twice from a normalized staging
tree, compares the bytes, tests and extracts the ZIP, verifies every extracted
file against the manifest, and verifies the published checksum.

Generated reports live in `validation/reports/`. Review them for documented
findings; a report's presence alone is not evidence that its checks passed.
