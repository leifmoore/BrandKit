# Pattern authoring contract

Patterns are copyable compositions, not standalone supported component APIs.
Each pattern owns a React edition, a Blade edition, neutral fixtures, a README
and one manifest.

- React components are controlled by host data and callbacks. Preview adapters
  may keep local fixture state but must not persist it.
- Blade receives view props and emits namespaced events. Use semantic forms and
  links before adding Alpine enhancement.
- Fixtures use string IDs, ISO-8601 dates, integer minor-unit money plus a
  currency code, and fictional people or organisations.
- Layout and spacing classes may be consumer-controlled. Visual states and
  variants are explicit recipe inputs.
- Never import application contexts, SQL/database layers, routes, permissions,
  storage, payment providers or product types.
- Every scenario must name the real fixture and preview export shown by the
  external Design System.
