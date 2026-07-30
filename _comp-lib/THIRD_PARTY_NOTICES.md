# Third-party notices

This handoff contains or expects software distributed under the licences below. Consumers remain responsible for retaining upstream copyright and licence notices when redistributing copied source.

| Dependency or source | Purpose | Licence |
|---|---|---|
| shadcn/ui-derived component patterns | Component source structure and conventions | MIT |
| Radix UI | React accessibility and interaction primitives | MIT |
| React and React DOM | React component runtime | MIT |
| Tailwind CSS | Utility CSS and theme compilation | MIT |
| `tw-animate-css` | State animation utilities | MIT |
| Lucide | React icon set | ISC |
| Phosphor Icons / Blade Icons | Laravel Blade icon set | MIT |
| Alpine.js, Focus and Collapse | Blade component state and focus management | MIT |
| Floating UI | Blade overlay positioning | MIT |
| Instrument Sans | Canonical typeface | SIL Open Font License 1.1 |
| class-variance-authority, clsx and tailwind-merge | React class composition | MIT |
| Sonner | React toast behavior | MIT |
| React DayPicker and date-fns | React calendar behavior | MIT |
| Input OTP | React one-time-password input behavior | MIT |

Exact runtime packages and versions are declared separately by the React and Blade dependency manifests. Component catalogue entries narrow those dependencies to the files that actually require them.

The Instrument Sans licence text is included at `foundations/licenses/OFL-1.1.txt`. No font binaries are bundled: both integration paths install or self-host the font through the consuming project.

No source or styling is taken from the separate WIP brand-kit website.
