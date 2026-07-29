# Blade accessibility status

The components use semantic elements, visible focus rings, disabled and invalid
states, labelled form relationships, live regions, Escape handling, focus traps,
and focus return. Dialog and Sheet depend on Alpine Focus; anchored overlays
depend on Floating UI. These dependencies are requirements, not enhancements.

This handoff is **not a WCAG certification**. Automated axe/browser testing must
run after the files are installed into the clean Laravel fixture. Until that
gate is complete, the catalogue must show the Blade accessibility status as
`pending-audit`, not `pass`.

Known framework differences and review flags:

- Calendar exposes every date as a keyboard-reachable button, but does not yet
  implement the WAI-ARIA grid's roving focus and arrow-key convenience pattern.
- Native Select is intentionally used for robust form submission. Its opened
  popup is operating-system UI and cannot be visually matched or inspected by
  axe in the same way as the React Radix popup.
- Scroll Area retains native scrolling and a styled native scrollbar rather
  than replacing it with a scripted scrollbar.
- Dialog, Alert Dialog, Sheet, Tooltip, and Popover require consumers to supply
  meaningful visible labels/content. Examples show the required relationships.
- Dropdown Menu supports Escape, Arrow Up/Down, Home, and End. Typeahead remains
  a documented enhancement rather than an asserted conformance feature.
- Phosphor and Lucide have different SVG paths. Accessible names belong on the
  interactive control; decorative icon instances in this handoff are hidden.

Visual parity takes priority when resolving non-semantic framework differences,
but a known WCAG failure must be reported and may not be silently accepted.
