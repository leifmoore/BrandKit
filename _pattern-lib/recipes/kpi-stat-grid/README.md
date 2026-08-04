# KPI stat grid

A two-to-four-column definition-list composition for the compact summary cards
used at the top of reports.

The host supplies already formatted display values. Monetary metrics also carry
their canonical integer `valueMinor` and ISO 4217 `currency`; non-money metrics
can carry `numericValue`. This preserves machine-safe data without making the
pattern own business calculations or localisation. Trends are descriptive
comparisons supplied by the host, not inferred by the recipe.

React and Blade render the same label/value hierarchy. Icons are decorative;
labels remain the accessible names. The host must avoid colour-only meaning and
should replace the entire metric set atomically after a report is generated so
that cards do not represent mixed filter states.
