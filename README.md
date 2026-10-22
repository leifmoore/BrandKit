# Scudamore’s Brand Kit

The application has two peer workspaces in one shell:

- **Brand** at `/brand` for identity, expression, applications, assets, and the
  experimental website-expression Playground.
- **Design System** at `/design-system` for the developer-ready software
  component library, foundations, patterns, roadmap, resources, and preview
  review.

The Design System is built from two immutable sibling handoffs: Scudamore’s UI
0.1.0 in [`_comp-lib`](./_comp-lib) and the additive Scudamore’s Pattern Library
0.1.0 in [`_pattern-lib`](./_pattern-lib). The pattern package adds 25 patterns
to the six supplied by the base library, producing one 31-pattern catalogue.

Legacy `/developer/*` links remain replace redirects to `/design-system/*`;
new links and documentation should use the canonical Design System routes.

## Runtime and package manager

- Vite 7.3.6 requires Node.js `^20.19.0 || >=22.12.0`.
- The current verified Codespace toolchain is Node.js `24.14.0` with npm
  `11.9.0`. Use that pairing for the closest reproduction of the checked
  results.
- npm is the package manager; `package-lock.json` is authoritative.

Install the checked-in dependency graph and the matching Playwright browser:

```sh
npm ci
./node_modules/.bin/playwright install chromium
```

Start the local app with:

```sh
npm run dev
```

## Supply-chain boundary

The project pins direct dependency versions and commits the npm lockfile. Use
`npm ci` for routine setup: do not add, upgrade, or replace packages as part of
component-library work unless that change is separately reviewed. Before an
approved dependency change, review its registry origin, integrity data,
lifecycle scripts, signatures/attestations, and audit result. Do not use
`npm audit fix --force` to rewrite this dependency set.

Installing Chromium through the checked-in local Playwright executable
downloads the browser matched to the pinned `@playwright/test` version; it does
not add an npm dependency.

## Design System component library

The `/design-system` workspace is catalog-driven and includes:

- interactive React previews for supported components and patterns;
- React and Laravel Blade source displayed as inert, copyable text;
- manifest-declared fixture/example source and scenario controls for patterns;
- foundations, seven preview-only brand themes, responsive widths, direction,
  scenario states, search, accessibility findings, and parity contracts;
- explicit deferred inventory with no preview, copy, download, or install
  actions.

Version 1 is copy-only. It has no hosted shadcn registry, remote code execution,
Blade/PHP runtime, or preview iframe. `_comp-lib` and `_pattern-lib` remain
separate immutable inputs; edit the Brand Kit integration instead and run the
handoff verifier to detect drift. React previews are live, while Blade is
copyable source and documentation only.

The full destination contract is in
[`_comp-lib/docs/DEVELOPER-SECTION-CONTRACT.md`](./_comp-lib/docs/DEVELOPER-SECTION-CONTRACT.md).
The selective migration decisions and host-owned exceptions are recorded in
[`docs/design-system-migration.md`](./docs/design-system-migration.md).

## Verification

The release gate runs serially to keep Codespace CPU and browser use
predictable:

```sh
npm run verify:handoff
npm run verify:canonical
npm run typecheck
npm run build
npm run test:production
npm run test:e2e
```

`test:production` serves the already-built `dist` directory and verifies both
the Brand root and a direct Design System deep link with lazy preview and source
chunks. Run `npm run build` before invoking it by itself.

The same sequence is available as one command:

```sh
npm run verify:developer
```

Focused browser lanes are available as `npm run test:a11y` and
`npm run test:visual`.

The opt-in Brand route contact sheet uses its own one-worker configuration and
writes only to the git-ignored `artifacts/brand-visual-audit/` directory:

```sh
npm run audit:brand:visual
```

## Visual snapshot policy

Developer preview baselines live beside the visual spec in
`tests/developer.visual.spec.ts-snapshots/` and are reviewed as source
artifacts. Update them only for an intentional, approved visual change:

```sh
./node_modules/.bin/playwright test tests/developer.visual.spec.ts --update-snapshots
```

Inspect every image diff before committing it, commit the baseline with the
source change that required it, and do not update snapshots merely to make a
failing gate green. The checked-in baselines target the pinned Chromium build
on Linux with the repository's local fonts.
