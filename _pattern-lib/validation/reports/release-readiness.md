# Release-readiness evidence

Status: all pre-package validation gates passed with two documented
visual-parity accessibility findings.

Verified evidence for version 0.1.0:

- exactly 25 paired add-on patterns and 31 patterns in the combined catalogue;
- 25/25 React previews built and mounted with no console or page errors;
- strict TypeScript `noEmit` validation passed across every React pattern;
- 50 isolated axe scans completed in light and dark mode;
- seven targeted interaction checks passed, including modal focus return;
- 25 primary Blade patterns and 42 fixture scenarios rendered in Laravel 12,
  with 241 compiled views cached successfully;
- 150 React visual baselines cover 360, 768 and 1280px in light and dark mode;
- npm and Composer advisory audits reported zero current vulnerabilities;
- source and `_comp-lib` locks match, with no tracked mutation outside
  `_pattern-lib/**`.

The machine-readable roll-up is
`validation/reports/validation-summary.json`. The two retained contrast choices
are detailed in `docs/ACCESSIBILITY.md` and
`validation/reports/accessibility-review.json`.

The release pipeline now provides these gates:

- validators complete before `export-manifest.json` is generated;
- the manifest allow-lists every payload file and records size and SHA-256;
- dependency, cache, build, temporary and prior-release directories are
  excluded during inventory traversal;
- the maintained source tree is copied to an isolated staging directory;
- staged file modes and timestamps are normalized using `SOURCE_DATE_EPOCH`;
- two independently created ZIPs must be byte-identical;
- ZIP integrity and the complete extracted file set are checked;
- each extracted file's size and hash, plus the manifest root hash, is checked;
- the final sidecar checksum is checked from the release directory.

This file records the state immediately before deterministic packaging. The
published archive and its external `.sha256` sidecar are the authority for the
final payload bytes.
