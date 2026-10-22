# Releases

Run `validation/scripts/release.sh` only after generation and validation pass.
The archive contains `_pattern-lib` content only; it never embeds `_comp-lib`.

For transfer validation, unpack the locked Scudamore's UI 0.1.0 archive and the
pattern archive as sibling directories, verify both checksums, merge their
catalogues, and build the React and Blade fixtures.
