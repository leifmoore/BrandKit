# Scudamore's Pattern Library

This directory is a portable, patterns-only add-on for Scudamore's UI. It is
not an application and it does not replace the component handoff in
`_comp-lib`.

## Required base library

- Scudamore's UI `_comp-lib` version: `0.1.0`
- Release archive SHA-256: `3c0bd84a09952c5d261a9b5cca3289830bb5f236abedd004fe05255b2b3a1e4d`
- Read-only tree SHA-256: `50c4b09bb6ac1d25191e884057129d9ef5e9890b2cb3d52cab52876a1ca3cfea`

Copy `_pattern-lib` beside the existing `_comp-lib` directory. Read
`docs/BRAND-KIT-INTEGRATION.md` for catalogue and preview integration, then
follow the framework-specific installation guidance.

## Authority

- `catalog/recipes/*.json` is the maintained source of pattern metadata.
- `catalog/catalog.json` and `catalog/combined-catalog.json` are generated.
- `recipes/<slug>/` contains the source, neutral fixtures and documentation
  shown by the external Design System.
- React previews are live; Blade is copyable source validated offline.
- All application persistence, authentication, permissions, payments,
  reporting calculations and routing remain host responsibilities.

Nothing outside `_pattern-lib` is modified by this handoff.
