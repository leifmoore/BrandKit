# Tokens

`foundations/data/tokens.json` is the maintained source of truth. `tokens.css` and `tailwind-theme.css` are deterministic CSS representations for consumers that do not want to build their own token pipeline.

## Loading order

For Tailwind v4 projects, load styles in this order:

```css
@import 'tailwindcss' source(none);
@source '../path-to-copied-components/**/*.{js,ts,jsx,tsx,php,blade.php}';
@import 'tw-animate-css';
@import './foundations/css/fonts.css';
@import './foundations/css/tokens.css';
@import './foundations/css/brands.css';
@import './foundations/css/tailwind-theme.css';
/* Optional: @import './foundations/css/base.css'; */
```

Adjust `@source` paths after copying. Tailwind must scan the copied React, Blade, PHP, and JavaScript files; paths in the handoff entrypoints are examples, not assumptions about the destination repository.

## Semantic roles

| Family | Variables | Use |
|---|---|---|
| Canvas and text | `--background`, `--foreground` | Application canvas and default copy |
| Contained surfaces | `--card*`, `--popover*` | Cards/modals and floating menus respectively; dark popovers intentionally sit lighter than dark cards |
| Actions | `--primary*`, `--secondary*`, `--destructive*` | Primary, bordered secondary, and destructive actions |
| Quiet interaction | `--muted*`, `--accent*` | Quiet fills/secondary copy and translucent hover states |
| Controls | `--input`, `--input-background`, `--switch-background`, `--ring` | Form borders/fills and visible keyboard focus |
| Structure | `--border`, `--radius` | Standard borders and the 8px base radius |
| Shell | `--sidebar*` | Sidebar and application-header surfaces |
| Domain and status | `--epos-accent*`, `--status-*`, `--info*` | EPOS identity, success/warning/danger, and informational messaging |
| Data visualisation | `--chart-1` through `--chart-5` | Ordered chart series |

Always author components with semantic utilities (`bg-card`, `text-muted-foreground`, `border-border`) rather than raw palette classes. Raw colours are permitted only for an explicitly recorded exception such as a colour picker swatch.

## Radius

The base is `--radius: 0.5rem` (8px at the default root size). Tailwind aliases preserve the production scale:

| Utility | Effective value |
|---|---|
| `rounded-sm` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |

Use `rounded-lg` for standard buttons, inputs, cards, and popover panels. Use a smaller or larger step only where the component contract specifies it.

## Status versus destructive

`--destructive` is the solid destructive-action colour. `--status-danger` is the base hue for tinted status treatment. Do not substitute one for the other: their dark-mode behavior and foreground roles differ. Status backgrounds should normally derive from the base hue with an opacity modifier, while their `*-foreground` token carries readable text.

## Provenance and deliberate additions

The surface, text, border, typography, EPOS, and status values are the current DesignApp representation of production styling. Focus rings are an intentional accessibility addition because production had no consistent focus-ring convention. Switch and chart values are retained prototype tokens because production had no equivalent. These facts are surfaced in the JSON metadata and the exceptions register rather than implied to be production-derived.

When a token changes, update `tokens.json` or `brands.json`, run `node foundations/scripts/generate-css.mjs --write` from `_comp-lib`, review the generated CSS diff, update visual baselines, and record the change in `CHANGELOG.md`. Running the same command without `--write` is a non-mutating freshness check.
