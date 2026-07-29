# Validation

`scripts/validate.mjs` is the portable structural gate. It validates JSON,
catalogue coverage, implementation/example paths, boundary-safe imports,
Blade crosswalk coverage and release metadata.

Runtime verification uses disposable fixtures created outside the handoff:

- React 18.3.1 + TypeScript + Vite + Tailwind 4.
- PHP 8.2 + Laravel 12 + Tailwind 4 + the declared Alpine runtime.

Required browser captures use Chromium with Instrument Sans at 360, 768 and
1280px, in light and dark modes. Visual differences must be either resolved or
listed in a component manifest. Axe and keyboard checks are reported; remaining
WCAG issues are never hidden even though visual parity is the primary gate.

Generated fixture directories and browser traces are temporary and must not be
included in a release archive.
