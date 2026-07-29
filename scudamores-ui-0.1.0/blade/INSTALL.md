# Laravel Blade installation

This directory is a portable Laravel 12 implementation of Scudamore's UI. It
uses the same semantic tokens and visual states as the React edition while
retaining Laravel form semantics.

## Requirements

- PHP 8.2 or newer and Laravel 12.
- Tailwind CSS 4.
- Alpine 3 with Collapse and Focus.
- Floating UI DOM for anchored overlays.
- `codeat3/blade-phosphor-icons` for icon parity.

Install the dependencies listed in `../dependencies.json`, then copy:

1. `library/app/View/Components/Ui/*` to `app/View/Components/Ui/`.
2. `library/resources/views/components/ui/*` to
   `resources/views/components/ui/`.
3. `library/resources/js/ui/*` to `resources/js/ui/` and import its `index.js`
   once from the application entry point.
4. `library/resources/css/index.css` or `tailwind.css` from the application
   Tailwind entry point. Adjust the documented relative imports after copying.

Laravel discovers the `App\\View\\Components\\Ui` classes automatically. The
anonymous files resolve to tags such as `<x-ui.button>`, `<x-ui.card>`, and
`<x-ui.dialog.content>`.

## Runtime setup

The provided JavaScript registers the UI Alpine data factories but deliberately
does not call `Alpine.start()`. Import the configured `Alpine` export and start
that instance once, or call `registerUi` against the host's existing instance
before it starts.

```js
import { Alpine } from './ui/index.js';
window.Alpine = Alpine;
Alpine.start();
```

There is intentionally no Livewire or jQuery dependency.

## Forms and validation

`Input`, `Checkbox`, `Radio`, `Select`, `Textarea`, and `Error` are class-backed
components. They preserve `old()` values, nested field names, named error bags,
enum options, multiple selects, stable IDs, and accessible error relationships.
Use `<x-ui.form>` to retain CSRF, method spoofing, and multipart handling.

## Compatibility layer

Copy `compatibility/resources/views/components` only while migrating an existing
application. The 21 files keep legacy tags operational by delegating to the
canonical `x-ui.*` API. They contain no application/domain source.

Variant mappings are `primary -> default`, `secondary -> outline`,
`danger -> destructive`, and `base -> default`.

## Theme ownership

The host owns the `.dark` and `.brand-*` classes. Components never write theme
state to storage. Include the shared foundation token files before this Blade
entry point. `base.css` is opt-in because it contains global element rules.

## Blade-specific parity notes

- Select uses a native `<select>` so browser popup rendering can differ from the
  React Radix popup. Multiple-select and form submission remain reliable.
- Phosphor and Lucide glyph paths differ; size, weight, meaning, colour, and
  alignment are matched.
- Interactive roots dispatch `ui:<component>:change` where state is changed.
- Blade previews are validated in Laravel; the external documentation site
  displays their source rather than embedding a Laravel runtime.

Read `ACCESSIBILITY.md` before publishing catalogue status. It records the
required audit gate and the current keyboard/OS-control review flags.
