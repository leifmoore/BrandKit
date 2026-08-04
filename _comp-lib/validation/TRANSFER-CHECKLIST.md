# Transfer checklist

Use this checklist when moving the handoff into the private brand-kit project.

- Verify `releases/scudamores-ui-0.1.0.zip` against its adjacent SHA-256 file.
- Unpack into a clean directory and confirm `catalog/catalog.json` parses.
- Preserve the relative paths in `export-manifest.json`; code tabs read those actual files.
- Load shared tokens before either framework entrypoint and make `base.css` an explicit host choice.
- Install only the dependencies declared for the chosen framework and components.
- Mount the React theme adapter from host-controlled theme and brand state.
- Follow `blade/INSTALL.md` for Laravel component namespaces, assets, and optional pre-paint theme bootstrap.
- Exercise all copied examples in the destination build rather than rendering Markdown snippets.
- Keep deferred and reference-only records out of copy actions.
- Carry parity exceptions and unresolved accessibility findings into the Developer UI.
- Re-run the validation scripts after any maintained-source change and generate a new semantic version.

The separate site owns routing, navigation, authentication, deployment, and visual integration around the Developer section. This archive does not overwrite those concerns.
