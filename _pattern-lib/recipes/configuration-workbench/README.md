# Configuration workbench

A reusable editor shell that keeps configuration details, optional controls, a live preview, and implementation handoff in one surface. It is based on the shared structure of sales-channel and embed configuration tools, not their product rules.

React accepts host-rendered `details`, `options`, `preview`, and `handoff` nodes. Blade exposes equivalent named slots and fixture-friendly fallbacks. The host owns validation, permissions, save/archive operations, preview computation, embed security, clipboard access, and persistence. React callbacks and the Blade `ui:configuration-workbench:change` / `ui:configuration-workbench:action` events carry neutral field or action IDs only.

Tabs remain keyboard-operable through the base Tabs component. A dirty indicator is supplementary to the disabled Save state. Preview content must remain inert when its controls would mutate real data, and generated handoff snippets must be escaped and validated by the host.
