# Visit-time heat map

A paired day-by-hour heat map with visit/transaction axis and
bookings/revenue controls. It follows the Reporting page's visual model while
correcting its reliance on cell titles for accessible values.

The host supplies four already aggregated matrices. Revenue values are integer
minor units and `currency` is an ISO 4217 code. The recipe only calculates the
visual intensity and peak summary; it does not aggregate transactions. React
can receive a host `formatValue` callback. Blade accepts host locale/currency
configuration for `Intl.NumberFormat`.

Both editions provide:

- Native pressed-state buttons for axis and measure.
- A concise live peak summary.
- A visual heat map marked as one described image rather than dozens of noisy
  pseudo-controls.
- An expandable, captioned data table with scoped row and column headers.

The host must supply complete rectangular matrices and should validate that
values are finite and non-negative before rendering.
