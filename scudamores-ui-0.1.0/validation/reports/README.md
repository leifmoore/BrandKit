# Validation reports

These files are the retained evidence for release `0.1.0`. The clean React and
Laravel fixtures used to create them lived under `validation/tmp/`; those
fixtures are deliberately excluded from the maintained handoff and release.

| Report | Evidence |
|---|---|
| `validation-summary.json` | Release-level status, coverage and accepted findings |
| `react-build.json` | Clean install, typecheck and production build |
| `blade-validation.json` | PHP/Laravel rendering, form behavior, aliases, view cache and Tailwind build |
| `react-browser.json` | 39 React examples, interactions, axe and responsive baselines |
| `blade-browser.json` | 39 Blade examples, interactions, axe and responsive baselines |
| `recipe-validation.json` | Six paired recipes, neutral fixtures and React browser interactions |
| `structural-validation.json` | Catalogue, coverage, paths, hashes, isolation and inventory checks |
| `file-inventory.json` | Generated release file hashes |

The browser reports were captured in the same Chromium/Instrument Sans
environment at 360, 768 and 1280px in light and dark mode, plus a 768px RTL
capture. The baselines are retained under `validation/baselines/`.

Visual parity was reviewed against shared tokens, state classes and the
captured output. Framework-native DOM, example content, icon paths and the
documented native Blade Select exception mean these are review baselines, not
a claim that whole-page screenshots are byte-for-byte identical.

The only accepted WCAG findings are the approved-design contrast values listed
in `validation-summary.json` and the affected component manifests. They are
reported explicitly rather than hidden.
