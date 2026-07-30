# Layout

The handoff packages layout primitives, not an application shell. The destination brand-kit owns its header, navigation, routing, authentication, and page frame.

## Page container

The canonical full-width content container is:

```text
mx-auto w-full max-w-7xl px-6 py-6 lg:px-8 lg:py-8
```

`PageContainer` exposes a class override for narrower contexts, but callers should not replace its core width and gutter behavior casually. A focused wizard may intentionally use `max-w-5xl`; record such exceptions in the consuming application.

## Page header

`PageHeader` is width-agnostic so it can sit in the standard container or a narrower settings column. Its contract is:

- Title and optional subtitle remain in a `min-w-0` content block.
- Actions sit opposite the title on medium and larger viewports.
- At mobile widths, actions wrap below the title instead of compressing text or overflowing.
- The title uses the foreground token; the subtitle uses muted foreground.

## Surfaces

- Application canvas: `bg-background text-foreground`.
- Cards and modal bodies: `bg-card text-card-foreground border-border`.
- Floating menus/popovers: `bg-popover text-popover-foreground`; in dark mode these intentionally sit one step lighter than cards.
- Sidebar or application-header chrome: `bg-sidebar text-sidebar-foreground border-sidebar-border`.
- Hover states: use the translucent `bg-accent` wash so they work over more than one surface.

## Responsive behavior

The component catalogue records component-specific behavior. The baseline preview widths are 360px, 768px, and 1280px. Do not equate these test widths with product breakpoints; use the Tailwind classes in the actual source as authority.

The Device Preview Frame is Developer-section infrastructure only. It changes a preview's maximum width and does not emulate a browser, input modality, user agent, or actual media-query viewport. Visual acceptance still requires real Playwright viewports.

## Direction and safe composition

Components inherit document direction. Catalogue pages only expose an RTL control for components whose manifest explicitly marks direction support. Consumer spacing classes may be composed through `className`/Blade attributes, while component-owned variants and sizes must use their declared props to avoid ambiguous Tailwind conflicts.
