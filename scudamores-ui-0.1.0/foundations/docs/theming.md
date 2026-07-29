# Theming and brands

Components read host classes and CSS variables; they do not store or choose the active theme.

## Host contract

Apply the mode and brand classes to the same stable host element, normally `<html>`:

```html
<html class="dark brand-blue">
```

Supported brand classes are `brand-default`, `brand-blue`, `brand-emerald`, `brand-red`, `brand-orange`, `brand-slate`, and `brand-violet`. If no brand class is present, the base default values from `tokens.css` apply. If no `dark` class is present, light values apply.

Brand presets alter only `--primary`, `--primary-foreground`, and `--ring`. They do not recolour status, destructive, EPOS, chart, or surface semantics.

## Custom brand

A host may provide a custom class or inline values for the same three variables:

```css
.brand-custom {
  --primary: oklch(0.58 0.19 252);
  --primary-foreground: #fff;
  --ring: oklch(0.58 0.19 252);
}

.dark.brand-custom {
  --primary: oklch(0.78 0.13 252);
  --primary-foreground: #0b1021;
  --ring: oklch(0.78 0.13 252);
}
```

Validate contrast for both pairs; the library cannot infer a readable foreground from an arbitrary primary value.

## React integration

Use the supplied host-neutral adapter to apply caller-owned `mode` and `brand` state. It is SSR-safe and does not touch local storage. The brand-kit may connect it to its existing context, server preference, or URL control.

## Blade integration

Render the classes on `<html>` from server state. If the browser may override that state before hydration, the optional bootstrap example applies a previously chosen class before paint. Persistence keys and authorization remain the application's responsibility.

## Preview behavior

The Developer section should render every preview inside an isolated class boundary so switching the catalogue controls cannot inadvertently restyle its own navigation. Preview controls must expose light/dark and all seven presets; default snapshots use `brand-default`.
