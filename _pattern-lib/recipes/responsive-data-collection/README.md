# Responsive data collection

One neutral dataset rendered as a semantic table on larger viewports and readable cards on small screens. This avoids squeezing wide operational tables into unusable mobile layouts.

The host supplies formatted cell strings, status variants, sorting, pagination, authorization, and row actions. React invokes `onActivate(id)`; Blade dispatches `ui:responsive-data-collection:action` with `{ action: "activate", id }`. Do not put route URLs, permission checks, or database models into recipe DTOs.

The desktop view includes a real table caption and headers. Mobile cards use headings and description lists, not a visual table with broken semantics. Preserve the same information and action availability in both renderings; `hideOnMobile` is only for genuinely redundant fields.
