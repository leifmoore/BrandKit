# Workspace shell decision record

Status: adopted for the Brand Kit application-shell milestone.

## Product boundary

The application has two peer workspaces inside one shared shell:

- **Brand** owns identity, expression, applications, and brand assets.
- **Design System** owns semantic interface foundations, components, patterns,
  accessibility, source guidance, and release evidence.

Design and Developer are not separate top-level modes. Their shared foundations,
components, accessibility guidance, and implementation assets form one Design
System workspace for a cross-functional audience.

## Routing contract

- Public routes are namespaced under `/brand` and `/design-system`.
- A first visit to `/` opens `/brand`. Later visits restore the last valid route
  in the last active workspace from versioned local storage.
- Switching workspaces restores that workspace's own last valid route.
- Existing unnamespaced Brand routes and `/developer/*` are compatibility aliases
  implemented with replace redirects. Query strings and fragment identifiers are
  preserved.
- `/design-system/foundations/themes` is the public theme route. The handoff's
  internal `brands` foundation identifier is a compatibility alias, not public
  information architecture.
- Data visualisation remains a host-owned Brand Kit page at the Design System
  foundation route while the chart implementation is outside handoff 0.1.0.
- Invalid or malformed persisted values fall back to the relevant workspace
  overview and never become navigation destinations.

The persistence key is `scud-workspace-state-v1`. The existing
`scud-dark-mode` key and its ownership are unchanged.

## Shell and navigation contract

- Both workspaces use one neutral semantic-token shell and one category-first
  navigation tree.
- Desktop uses a fixed sidebar. Mobile uses a modal drawer with focus entry,
  trapping, Escape dismissal, background isolation, and focus restoration.
- The workspace switcher is a compact group of real links so standard browser
  link behaviour remains available.
- Command search is scoped to the active workspace. Brand search exposes Brand
  routes, page anchors, and identity colours; Design System search exposes its
  foundations and catalogue entries.
- Instrument Sans is the shell and documentation face. Brand page typography is
  still content-owned pending the later Brand migration.

## Source and parity guardrail

The existence of a preview, local wrapper, inferred API, or similarly named
component is not evidence of implementation parity. A component can be labelled
as React/Blade parity only when the original implementation sources and their
behavioural contract are available and reviewed. If either framework source is
missing:

- keep the entry on the reasoned roadmap or label it framework-specific;
- do not fabricate the absent implementation from a screenshot or counterpart;
- do not expose copy/download actions that imply a canonical missing source; and
- record what source or product evidence is required before promotion.

The immutable `_comp-lib` 0.1.0 handoff remains the authority for shipped
copy-only component source. Host shell patterns may be documented as incubating,
but they are not canonical library components and do not claim framework parity.

## Integration boundary

This milestone establishes the public routes, shell, navigation, scoped search,
and persistence model. Existing Brand pages are mounted at their new routes so
their content can be migrated incrementally. The lazy-loaded catalogue is
mounted below `/design-system/*`; its former nested navigation has been removed
in favour of the shared shell, and its component and pattern pages use the
preview-first workbench.
