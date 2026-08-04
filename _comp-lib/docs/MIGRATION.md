# Migration guide

## React

Copy the selected files from `react/components`, their internal registry
dependencies, and the exact packages listed in the component manifest. Import
the React style entrypoint once in the host application.

The handoff keeps the DesignApp's existing component names and variants. The
portable copies remove application context/data dependencies and export their
public prop types.

## Laravel Blade

Copy `blade/library` into the equivalent Laravel paths. Canonical tags live in
the `ui` folder and are invoked as `<x-ui.*>`.

If migrating the production application, also copy the required files from
`blade/compatibility`. These retain legacy tags while delegating presentation
to canonical components.

Legacy action mappings are:

| Legacy | Canonical |
|---|---|
| `primary` | `default` |
| `secondary` | `outline` |
| `danger` | `destructive` |
| `base` size | `default` size |

Compatibility aliases are transitional and are not separate catalogue items.
See `catalog/blade-crosswalk.json` for every production file's disposition.

## Styles

Both stacks consume the same semantic variables. Import the relevant Tailwind
entrypoint and optionally import `foundations/css/base.css` when global element
typography is desired. The host owns `.dark` and `.brand-*` classes.
