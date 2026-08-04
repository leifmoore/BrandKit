# Collection toolbar

A compact search, select-filter, sort, layout, count, and action composition used above tabular or card collections. Controls wrap naturally rather than disappearing at narrow widths.

React is controlled through `onSearchChange`, `onFilterChange`, `onSortChange`, `onLayoutChange`, and `onReset`. Blade dispatches `ui:collection-toolbar:change` for individual fields and `ui:collection-toolbar:action` for reset. The host owns filtering, debouncing policy, result queries, URL synchronization, authorization, and persistence.

All controls have programmatic labels. The result count is a polite live region; hosts should update it after settled results rather than on every loading frame. Put destructive bulk operations outside the search landmark or supply them through the named `actions` slot with an explicit label.
