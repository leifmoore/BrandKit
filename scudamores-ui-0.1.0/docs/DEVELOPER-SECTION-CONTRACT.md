# Developer section contract

This handoff supplies content and source for a new developer section in the
Scudamore's Brand Kit. It does not supply or prescribe the host application's
shell, authentication, deployment, or visual navigation treatment.

## Routes

| Route | Content |
|---|---|
| `/developer` | Introduction, supported stacks, installation and release status |
| `/developer/foundations/:slug` | Tokens, typography, layout, theming, icons and exceptions |
| `/developer/components/:slug` | Live React preview, React/Blade source, APIs, dependencies and parity notes |
| `/developer/patterns/:slug` | Fixture-driven React and Blade composition recipes |

## Data contract

The host reads `catalog/catalog.json`; it must not scrape Markdown to build
navigation. Each item points to a component or recipe manifest, documentation,
implementation files and examples. The host should:

1. Index `title`, `description`, `category`, `keywords` and `status` for search.
2. Dynamically import the React example named by a scenario's `preview` field.
3. Load React and Blade source paths as raw text for code tabs and copy actions.
4. Show status, dependencies, parity exceptions and accessibility findings.
5. Hide install/copy controls for `deferred` and `reference` records.

## Preview behavior

- React is the only live preview runtime in the Brand Kit.
- Blade examples are source tabs; their runtime is validated in a temporary
  Laravel fixture during handoff verification.
- Theme and brand are controlled by classes on the preview root. Components do
  not persist theme state.
- Preview controls should offer light/dark, the seven supplied brand presets,
  360/768/1280px widths, and state controls declared by each scenario.
- Source tabs always read the actual example/implementation file so displayed
  code cannot silently drift from the handoff.

## Security boundary

No Blade/PHP is evaluated in the Brand Kit. Do not add an iframe, PHP service,
dynamic code evaluation, or remote registry endpoint for v1. Authentication
and private hosting remain responsibilities of the host project.
