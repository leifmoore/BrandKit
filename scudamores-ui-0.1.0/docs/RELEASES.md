# Releases

The maintained source is `_comp-lib`; archives are generated outputs.

## Build a release

Run from `_comp-lib`:

```bash
bash validation/scripts/release.sh
```

The release script verifies generated foundation CSS, recipe structure, the
catalogue, source isolation and the approved upstream lock. It then reads
`VERSION`, excludes `releases/`, caches and temporary validation fixtures, and
writes a ZIP plus SHA-256 checksum under `releases/`. Never edit an archive by
hand.

Browser/build reports are produced in clean disposable React and Laravel
fixtures before release. Read `validation/reports/README.md` and
`validation/reports/validation-summary.json` for the retained evidence.

Version `0.1.0` is the initial reviewed handoff. Subsequent releases use
semantic versioning: breaking public API changes are major, additive components
or variants are minor, and compatible fixes/docs are patch releases.
