# Typography

Instrument Sans is the canonical interface typeface. The supported weights are 400, 500, and 600.

## Installation

The supplied `fonts.css` uses `@fontsource/instrument-sans` so previews and copied applications can run without a remote font service:

```sh
npm install @fontsource/instrument-sans
```

Import `foundations/css/fonts.css` before any styles that refer to `--font-sans`. A host may self-host equivalent Instrument Sans files instead, provided it loads normal styles for weights 400, 500, and 600 and retains the included SIL Open Font License.

The fallback stack is:

```text
Instrument Sans, ui-sans-serif, system-ui, sans-serif,
Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji
```

## Scale and weight

| Role | Tailwind expression | Guidance |
|---|---|---|
| Page title | `text-2xl font-medium leading-6` or component-owned equivalent | One per page region; keep concise |
| Section title | `text-xl font-medium` | Major content grouping |
| Subsection title | `text-lg font-medium` | Cards and local groupings |
| Body | `text-base font-normal` | Default reading copy |
| Compact UI | `text-sm` | Tables, controls, supporting copy |
| Caption | `text-xs text-muted-foreground` | Metadata and non-essential hints |
| Emphasis | `font-medium` or `font-semibold` | Use 600 sparingly for values/names, not whole paragraphs |

The optional `base.css` establishes the current h1-h4, label, button, and input defaults. It is opt-in because global element selectors can affect an existing brand-kit shell. Components remain complete without it because their critical sizes and weights are explicit.

## Accessibility

- Do not encode hierarchy through size or colour alone; preserve semantic heading levels.
- Labels use a real association (`for`/`id`) or the framework primitive's equivalent.
- Muted text is for secondary information, not required instructions or error messages.
- Do not reduce control text below `text-sm` merely to fit content; allow wrapping or revise the layout.
- Font loading must not block access to content. The fallback stack should remain usable during load or failure.
