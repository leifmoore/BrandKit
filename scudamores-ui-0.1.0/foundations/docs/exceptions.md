# Intentional exceptions and parity differences

This register contains only differences that survive into the portable handoff. Historical page-specific exceptions that were not transferred are recorded in `provenance/excluded.json`, not here.

| ID | Area | Exception | Required treatment |
|---|---|---|---|
| `foundation-focus-ring` | Tokens | Production had no consistent focus-ring convention; the handoff retains a visible `--ring` treatment. | Keep it. This is an accessibility improvement, not a visual-parity defect. |
| `foundation-prototype-tokens` | Tokens | Chart and unchecked-switch values have no production counterpart. | Label their provenance in catalogue data; revisit when a real product source exists. |
| `blade-native-select` | Select | Blade uses a native `<select>`; its opened popup and multiple-selection UI are operating-system rendered and cannot pixel-match Radix Select. | Match the closed control and documented states; record the open-state difference in the Select manifest. |
| `calendar-runtime` | Calendar | React uses React DayPicker; Blade uses the library Alpine date-grid controller. | Match visual states, keyboard contract, locale/date semantics, and emitted value—not framework DOM. |
| `icon-family` | All icon-bearing components | React uses Lucide while Blade uses Phosphor. | Match semantic glyph, rendered size, weight, colour, alignment, and accessible labeling; accept path-shape differences. |
| `overlay-runtime` | Dialog, Alert Dialog, Sheet, Popover, Dropdown Menu, Tooltip | React relies on Radix primitives; Blade uses Alpine Focus and Floating UI. | Match public behavior, focus, dismissal, placement, and states; DOM/portal structure may differ. |
| `quick-launch-palette` | Quick Launch recipe | The recipe retains a fixed multi-hue card palette rather than converting every hue to the active brand. | Treat colours as categorical decoration, provide sufficient contrast, and do not expose them as global semantic tokens. |
| `device-preview-simulation` | Developer utility | Device Preview Frame constrains width but is not a real viewport/device emulator. | Use real browser viewports for acceptance and accessibility testing. |

Visual parity is the first release priority, but it never permits hiding accessibility defects. Every unresolved WCAG 2.2 AA finding belongs in its component manifest and validation report with severity and status.
