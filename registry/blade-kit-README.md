# Scudamore's Blade kit: developer guide

This app's interface comes from the Scudamore's Brand Kit: Blade components (`<x-ui.*>`) and
product patterns (`<x-patterns.*>`) that match the React design prototype. The kit provides the
UI only. Data, persistence, authentication, permissions, routing, payments and calculations are
the app's job. This guide covers what's where, how to connect it to the backend, and how to keep
it up to date.

- **Kit version:** `scudamores/VERSION`
- **Agent guide:** `scudamores/AGENTS.md` (React → Blade tables, setup steps)
- **Live docs and previews:** https://brand-kit-ashen.vercel.app/design-system/components and
  https://brand-kit-ashen.vercel.app/design-system/patterns
- **Latest kit:** https://brand-kit-ashen.vercel.app/blade/scudamores-blade.zip

## What's where

| Path | What | Who owns it |
|---|---|---|
| `resources/views/components/ui/` | Components: `<x-ui.button>`, `<x-ui.card.content>` … | Brand Kit: don't edit |
| `app/View/Components/Ui/` | PHP classes behind the form components | Brand Kit: don't edit |
| `resources/js/ui/` | Alpine runtime (menus, dialogs, popovers, toasts …) | Brand Kit: don't edit |
| `resources/css/scudamores/` | Brand tokens, fonts, dark mode, component styles | Brand Kit: don't edit |
| `resources/views/components/patterns/` | 31 patterns: `<x-patterns.quote-builder>` … | The app: adapt freely |
| `scudamores/` | Guides, version, manifest, pinned dependencies | Reference |
| `scudamores/reference/` | Examples, sample data, pattern docs, migration layer | Reference |

"Don't edit" files are replaced wholesale on every update. To restyle, pass `class`, which is
added to the component's own classes (it doesn't remove conflicting utilities), or wrap the
component. If a component itself needs to change,
see [Feeding changes back](#feeding-changes-back).

## Setup checklist

The agent that built the app should already have done this. Check it if something looks unstyled
or doesn't respond to clicks:

- `composer.json` has `codeat3/blade-phosphor-icons` and `package.json` has the exact versions in
  `scudamores/dependencies.json` (Alpine, Floating UI, Tailwind, tw-animate-css, Instrument Sans).
- `resources/css/app.css` imports `./scudamores/ui.css` and `./scudamores/patterns.css`, directly
  below `@import 'tailwindcss';`.
- `resources/js/app.js` imports `Alpine` from `./ui/index.js` and starts it once. Don't add
  Livewire or jQuery.
- The layout loads both through `@vite(...)` and has `x-data` on `<body>`. Several patterns rely
  on the page's Alpine scope to dispatch their events.
- Dark mode is the `dark` class on `<html>`. The app decides when to set it (user setting,
  `prefers-color-scheme` …).

## Connecting to the backend

**Data in: props.** Each pattern takes plain PHP arrays as props. The sample data in
`scudamores/reference/fixtures/<pattern>/` shows the exact shape, so build the same structure in
your controller or view model, for example:

```blade
<x-patterns.quote-builder
    :summary="$quote->summary()"
    :time-bands="$timeBands"
    :expiry-options="$expiryOptions"
    :default-expiry-option-id="$defaultExpiry"
/>
```

Pass props one attribute at a time; fixtures can contain preview-only keys that aren't props.
Each pattern's `@props([...])` block at the top of its file lists what it accepts. Check its doc
for units: where stated, money is integer minor units (pence) and dates are ISO-8601.

**Actions out: events.** Patterns don't save anything themselves. When the user does something,
they dispatch a browser event, usually `ui:<pattern>:change` (a value changed) or
`ui:<pattern>:action` (submit, delete, look up …). The payload for each one is documented in
`scudamores/reference/patterns/<pattern>.md`. You have two options:

1. **Listen and call the backend.** Use this for in-page updates. The example needs
   `<meta name="csrf-token" content="{{ csrf_token() }}">` in the layout's `<head>`:

   ```js
   window.addEventListener('ui:quote-builder:action', async ({ detail }) => {
       if (detail.action !== 'submit') return;
       await fetch('/quotes', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
           },
           body: JSON.stringify(detail.draft),
       });
   });
   ```

2. **Use a normal form.** Wrap the pattern, or your adapted copy of it, in `<x-ui.form>` and post
   to a controller. Patterns are allowed to be adapted for this; several docs note where a
   Laravel form action can replace the Alpine event.

**Forms and validation.** `<x-ui.form action="..." method="put">` adds the CSRF token and method
spoofing for you; add `upload` for file uploads. `<x-ui.input>`, `checkbox`, `radio`, `select`, `textarea` and `error` are class-backed:
they refill `old()` values and show validation errors from Laravel's error bag automatically,
including nested names and named bags. Validate on the server as usual.

**What stays in the app:** persistence, authorisation and permission checks, routing and
redirects, pricing and availability calculations, email, payments and audit logs. Patterns may
show prices or totals, but treat any client-side figure as display only and recompute it on the
server.

## Writing new Blade with the kit

- Build pages from `<x-ui.*>` components first. Usage examples for each one are in
  `scudamores/reference/examples/<component>/`.
- Icons are Phosphor: `<x-phosphor-check class="size-4" aria-hidden="true" />`. Names differ from
  the Lucide icons in the React prototype.
- Inside a component tag (`<x-…>`), Blade doesn't compile `@js()`, `@json()` or `@foreach`, and
  Laravel prints `"` as `\"`. To pass PHP values into Alpine there, use
  `{{ \Illuminate\Support\Js::from($value) }}`, and use single quotes or `&quot;` for JavaScript
  strings. Plain HTML elements can use `@js()` as normal.
- `<x-patterns.checkout-details-panel>` must always get `:errors` (`[]` when there are none).
  Laravel shares its own `$errors` with every view, and without the attribute the pattern receives
  that object instead of an array and fails.

## Updating the kit

New versions come from the same download link. Follow the "Updating" steps in
`scudamores/AGENTS.md`. In short:

1. Unpack the new zip into a temporary folder and compare `scudamores/VERSION`.
2. Copy the Brand Kit-owned folders (above) and `scudamores/` over the app's copies.
3. For patterns, compare each file's sha256 with `scudamores/manifest.json`. Unchanged files can
   be replaced; files the app has adapted need merging by hand.
4. Reinstall dependencies if `scudamores/dependencies.json` changed, then run `npm run build` and
   `php artisan view:clear`.

## Existing apps

When moving an older app over, `scudamores/reference/compatibility/` keeps the old component tags
working: they delegate to `<x-ui.*>`. `scudamores/reference/migration-crosswalk.json` maps each old
file to its replacement. See "Existing apps" in `scudamores/AGENTS.md`, and remove the
compatibility files once nothing uses them.

## Feeding changes back

Don't fix or extend Brand Kit-owned files in place; the next update overwrites them. Instead,
note the change in `scudamores/FEEDBACK.md`: what, where, why, and the code if you wrote a local
version (for example, as a new component under `resources/views/components/app/`). Send that file
to the Brand Kit owner. The change is then made in both the React and Blade editions and shipped in
a new kit, so the prototype and the app stay in step.

## Known issues

These are fixed or worked around in this kit, and are due to be fixed at source:

- Handoff Blade used `@js()`/`@json()` inside component tags, which Blade never compiles. The kit
  rewrites them to `Js::from()` in its copies.
- A component attribute containing `"` broke `customer-booking-journey`. The kit's copy uses
  `&quot;`.
- `report-filter-builder` had a Blade loop inside a component tag. The kit's copy uses a
  JavaScript loop.
- `checkout-details-panel` needs `:errors` passed explicitly (see above).

For anything else, check `scudamores/reference/docs/` (the original install and accessibility
notes), then raise it through `scudamores/FEEDBACK.md`.
