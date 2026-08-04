# Blade render fixture

This is a deliberately small Laravel 12 application used only to validate the
Blade half of `_pattern-lib`. It reads the canonical UI component views and all
seven supporting form component classes (the six concrete controls plus their
shared base) directly from the sibling `_comp-lib` handoff. It never copies or
edits those sources.

The fixture reuses the locked dependencies installed by
`_pattern-lib/validation/composer.json`. Run the validator from the repository
root:

```sh
php _pattern-lib/validation/scripts/validate-blade-render.php
```

For a direct Laravel cache check, after the validation dependencies have been
installed:

```sh
php _pattern-lib/validation/blade-fixture/artisan view:cache
php _pattern-lib/validation/blade-fixture/artisan view:clear
```

The render validator discovers the 25 pattern manifests, renders every unique
documented scenario fixture, rejects unresolved Blade component tags, and writes
`validation/reports/blade-render.json`.

Phosphor Blade icons are represented by a local accessible SVG stub. This keeps
the fixture independent from the production icon package while proving that all
icon aliases resolve. Browser-side Alpine behaviour, focus management, and
Floating UI positioning are outside this server-rendering check and are covered
by the interaction/visual validation tracks.
