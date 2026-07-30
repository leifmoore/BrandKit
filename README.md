# Scudamore's Brand Kit

The Brand Kit is the source of truth for Scudamore's visual and verbal brand
guidance. It also contains a developer-facing component library at
`/developer`, built from the immutable Scudamore's UI 0.1.0 handoff in
[`_comp-lib`](./_comp-lib).

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

## Developer component library

The `/developer` section is catalog-driven and includes:

- interactive React previews for supported components and patterns;
- React and Laravel Blade source displayed as inert, copyable text;
- foundations, seven preview-only brand themes, responsive widths, direction,
  scenario states, search, accessibility findings, and parity contracts;
- explicit deferred inventory with no preview, copy, download, or install
  actions.

Version 1 is copy-only. It has no hosted shadcn registry, remote code execution,
Blade/PHP runtime, or preview iframe. `_comp-lib` is immutable input; edit the
Brand Kit integration instead and run the handoff verifier to detect drift.

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
the Brand Kit root and a direct Developer deep link with lazy preview and source
chunks. Run `npm run build` before invoking it by itself.

The same sequence is available as one command:

```sh
npm run verify:developer
```

Focused browser lanes are available as `npm run test:a11y` and
`npm run test:visual`.

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
