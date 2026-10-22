# Blade installation

1. Install the locked `_comp-lib` Blade library first and verify its canonical
   `<x-ui.*>` tags render.
2. Copy the required pattern Blade files into the consumer or register the
   copied directory as an anonymous component/view namespace.
3. Load Alpine 3 and only the plugins declared by each pattern manifest.
4. Add `@source` coverage for the copied pattern Blade files to the consumer's
   Tailwind v4 entrypoint.
5. Keep persistence, authorization, routes and server-side calculations in the
   host. Listen for the documented `ui:<pattern>:change` and
   `ui:<pattern>:action` events where client enhancement is required.

Blade examples are progressively enhanced where practical. They remain usable
as semantic forms and links without relying on a hosted Blade preview in the
Design System.
