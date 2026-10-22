# Report breakdown table

A hierarchical group-and-item table for product, channel, staff or another
host-defined reporting dimension. Group rows carry aggregated values and child
rows are visually indented without flattening their table semantics.

The host supplies the complete hierarchy, formatted display values, canonical
minor-unit money and all totals. The pattern never derives groups, averages,
commission or ordering. React accepts an optional `visualisation` ReactNode;
Blade accepts an optional named `$visualisation` slot. These are deliberately
host-owned because Chart remains deferred in the component library.

The table has a caption, column headers, group `rowgroup` headers and child row
headers. A chart placed in the optional slot must have its own accessible name
and data alternative; this breakdown table can be that alternative only when
both surfaces represent exactly the same values.
