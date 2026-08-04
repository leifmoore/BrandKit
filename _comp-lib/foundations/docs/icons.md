# Icons

React uses Lucide. Laravel Blade uses the existing Phosphor Blade package. The two editions match meaning, rendered size, weight, colour, alignment, accessible name, and interaction—not SVG path geometry.

## Rules

- Use an icon because it carries a documented meaning, never because two glyphs merely look similar.
- Decorative icons are hidden from assistive technology (`aria-hidden="true"` or the Blade equivalent).
- An icon-only interactive control requires an accessible name supplied by `aria-label` or visible/visually-hidden text.
- Default control icons are 16px (`size-4`) unless the component manifest says otherwise.
- Icons inherit text colour. Status or brand colour is applied by the owning component, not hardcoded in a generic icon wrapper.
- Keep consistent flex alignment and prevent a leading control icon from shrinking.
- Do not ship the four production `icons/*` templates as new public APIs; compatibility wrappers delegate to mapped Phosphor icons.

## Mapping record

Each component manifest records any required mapping:

```json
{
  "meaning": "close",
  "react": "X",
  "blade": "phosphor-x",
  "size": "16px",
  "weight": "regular"
}
```

When no exact Phosphor analogue exists, choose the closest semantic glyph and record the path-shape difference under component parity. Do not silently switch either framework's icon family for v0.1.0.
