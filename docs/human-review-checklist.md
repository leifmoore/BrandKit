# Brand Kit human review checklist

Use this checklist after the automated pre-review gates pass. It records the
remaining product judgement that browser tests cannot supply. Keep the active
goal open until findings are fixed, a Playground treatment is selected, and the
final serial test run is clean.

## Start the local app

Run the existing project without installing anything:

```sh
npm run dev -- --host 127.0.0.1 --port 4173
```

Stop the server when the review session ends. The Codespace has two CPU cores,
so do not run Playwright at the same time as a manual review server.

## Brand route pass

Review desktop first, then spot-check at 360px. Check hierarchy, warmth,
spacing, text accuracy, horizontal overflow, keyboard focus, dark mode where
relevant, and whether authored Brand specimens remain distinct from neutral
application UI.

| Area | Route | Decision focus |
|---|---|---|
| Overview | `/brand` | Navy/White statement, editorial warmth, entry-point clarity |
| Quick Reference | `/brand/quick-reference` | Locked versus draft values, compactness, live Playground accent |
| Logo | `/brand/identity/logo` | Approved artwork only, clear space, misuse examples, downloads |
| Colour | `/brand/identity/colour` | Locked anchors, supporting ramps, nine expression families, Mood Explorer |
| Typography | `/brand/identity/typography` | Gill Sans Nova display hierarchy, Instrument Sans body, live preview |
| Voice | `/brand/expression/voice` | Smart punctuation, channel guidance, checker caveats |
| Photography | `/brand/expression/photography` | Hero art direction, placeholder labels, consent draft |
| Graphics | `/brand/expression/graphics` | Icon status, decoration rules, reviewed-gradient boundary |
| Playground | `/brand/expression/playground` | See the treatment comparison below |
| Applications | `/brand/applications` | Working-status clarity, software/Brand semantic boundary |
| Resources | `/brand/resources` | Export claims, ramp completeness, section navigation |

The current contact sheet is
`artifacts/brand-visual-audit/brand.visual-audit-capture-4944b-middle-and-bottom-positions-chromium/brand-route-audit/contact-sheet.png`.
Use the live routes for final judgement; the sheet is an orientation aid.

## Playground treatment decision

Compare both realistic patterns and mobile/desktop art direction. Save the best
two or three named candidates before choosing one.

- Try Navy and White glass.
- Check tint opacity at 0%, a useful middle value, and 100%.
- Compare solid and grainy-gradient accent surfaces.
- Compare several contextual accents rather than forcing one accent globally.
- Tune accent intensity, canvas warmth, photo wash, and grain.
- Confirm buttons remain readable and the photograph still leads the scene.
- Export the chosen candidate as JSON and CSS, but keep it experimental until
  the review explicitly promotes it.

Record the selected candidate name and intended contexts in `handoff.md`.

## Design System module pass

1. Open `/design-system/components`; check search plus List and Card layouts.
2. Open `/design-system/review/previews`; work through all 70 component and
   pattern entries, recording Pass or Flagged notes. The queue stores progress
   in the current browser and can export Markdown or JSON.
3. For flagged modules, note the theme, viewport, direction, state, and exact
   interaction that failed.
4. Spot-check Preview/React/Blade, Fixture/example, Documentation, Copy, and
   Download on a supported pattern. Source must remain byte-exact, scenario
   controls must follow its manifest, and Blade must remain source-only.
5. Confirm Calendar hugs its content on desktop and remains bounded on mobile.
6. Confirm component and pattern details return to their respective collection
   and cycle through siblings with Previous/Next controls.
7. Confirm the Patterns list visibly reports both retained visual-parity
   accessibility findings without changing their handed-off styling.

## Finding format

```text
Route/module:
Viewport/theme/state:
Severity: blocker | significant | polish
Expected:
Observed:
Screenshot or reproduction:
```

After findings are fixed, rerun only affected tests first, then the complete
one-worker Playwright suite, integrity checks, build, and production smoke.
