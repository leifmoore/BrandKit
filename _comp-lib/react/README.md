# React handoff

Portable React source for the 39 approved design-system entries: 30 stable
components and nine copyable beta components. The source is intentionally
host-neutral and contains no product routes, data, contexts, or persistence.

## Install

Use the exact versions in `dependencies.json`. React and React DOM are peers;
the remaining `dependencies` are installed only when a copied component needs
them. Import `styles/index.css` once after copying the shared foundation CSS.
The opt-in global reset remains at `../foundations/css/base.css`.

```tsx
import { Button, ThemeScope } from "./react";
import "./react/styles/index.css";

export function Preview() {
  return (
    <ThemeScope mode="dark" brand="blue" className="bg-background p-6 text-foreground">
      <Button>Continue</Button>
    </ThemeScope>
  );
}
```

The host owns mode/brand persistence and can apply `.dark` and `.brand-*`
classes itself. `ThemeScope` is a local preview adapter; it never changes the
document or reads browser storage. `Toaster` accepts an explicit Sonner theme
and otherwise follows the nearest scope.

## Copy model

- Browse `registry.json` for shadcn-compatible file/dependency metadata.
- Copy the listed implementation and its `registryDependencies`.
- Copy `examples/<slug>/basic.tsx` for a working starting point.
- Treat beta entries as supported handoff source whose API may still change.
- The ten deferred entries are metadata only in `dependencies.json`; no source
  for them is distributed here.

Baseline: `d1511e224305585680723101a0b76be93eb9f2f0`.
