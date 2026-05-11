import { SectionHeader } from '@/components/shared/SectionHeader'
import { Separator } from '@/components/ui/separator'

const CHART_TYPES = [
  { name: 'Line chart', when: 'Change over time — revenue, bookings, occupancy, growth metrics.', rule: 'Single Deep Navy line by default. Add second line in Lantern Gold only for comparing two series. Avoid more than two lines — use small multiples instead.' },
  { name: 'Bar chart (vertical)', when: 'Comparing values across discrete categories with natural order (months, quarters, tour types).', rule: 'Single colour by default. Use Lantern Gold to highlight one bar ("this month" or "highest performer").' },
  { name: 'Bar chart (horizontal)', when: 'Comparing values where labels are long — customer feedback themes, source-of-booking, college names.', rule: 'Easier to read than vertical when you have 6+ categories.' },
  { name: 'Stacked bar', when: 'Showing parts of a whole across categories — tour-type breakdown by month.', rule: 'Use navy ramp sequentially: Deep Navy at bottom, lighter tints as you stack up.' },
  { name: 'Pie / donut', when: '3 or fewer slices only.', rule: 'For more than 3, use horizontal bar chart. If donut, put the most important number in the centre.' },
  { name: 'Heatmap', when: 'Two-dimensional data — occupancy by day-of-week × hour-of-day.', rule: 'Single-hue ramp: Vapour → Mist → Cam Blue → Deep Navy → Midnight. Light = low, dark = high.' },
  { name: 'Maps', when: 'Geographic data — where customers come from.', rule: 'Navy ramp as choropleth. UK and Cambridge city maps preferred over generic world projections.' },
  { name: 'Single-stat / gauge', when: 'Headline numbers in dashboards.', rule: 'Big number in Gill Sans Bold or Inter Semibold, Deep Navy. Delta (▲/▼) in Cam Blue (positive) or Brass (negative) below.' },
]

const COLOUR_NEEDS = [
  { need: 'Highlight one data point in a series', approach: 'Keep rest Deep Navy; make highlighted point Lantern Gold (#c9a24a)' },
  { need: 'Sequential / ordered data (quarters, age brackets)', approach: 'Navy ramp: Deep Navy → Dusk → Cam Blue → Sky → Mist' },
  { need: 'Categorical data (up to 4 categories)', approach: 'Deep Navy, Lantern Gold, Cam Blue, Stone — in that priority order' },
  { need: 'Categorical data (5+ categories)', approach: 'Extend with: Deep Navy, Lantern Gold, Cam Blue, Stone, Brass, Sky' },
  { need: 'Diverging data (positive vs negative, e.g. NPS)', approach: 'Cam Blue (positive), Brass (negative), Stone (neutral)' },
  { need: 'Comparisons (us vs competitor, this year vs last)', approach: 'Deep Navy for "us / this year"; Mist or Stone for "them / last year"' },
]

const TYPE_IN_CHARTS = [
  { element: 'Chart title (above chart)', font: 'Gill Sans Bold or Inter Semibold', size: 'H3 or H4', colour: 'Deep Navy' },
  { element: 'Subtitle / context', font: 'Inter Regular', size: '14pt', colour: 'Dusk' },
  { element: 'Axis labels', font: 'Inter Medium', size: '12pt', colour: 'Dusk' },
  { element: 'Tick labels', font: 'Inter Regular (tabular figures)', size: '11pt', colour: 'Dusk' },
  { element: 'Data labels', font: 'Inter Medium (tabular figures)', size: '11pt', colour: 'Deep Navy' },
  { element: 'Legend', font: 'Inter Regular', size: '12pt', colour: 'Dusk' },
  { element: 'Source line', font: 'Inter Regular', size: '11pt', colour: 'Cam Blue' },
]

export function Charts() {
  return (
    <div>
      <SectionHeader
        eyebrow="Charts & Data Visualisation"
        title="Charts"
        description="Minimal and editorial — closer to Financial Times than default Excel. Most of the time, less colour is more. If a chart can be read clearly with one colour, use one."
      />

      {/* Default chart */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">The Default Scudamore's Chart</h2>

        {/* Visual example */}
        <div className="rounded-xl border border-border p-6 mb-6 bg-card">
          <p className="font-sans font-semibold text-base text-navy-900 dark:text-cream-50 mb-1">Monthly Bookings</p>
          <p className="font-sans text-sm text-navy-700 dark:text-cream-300 mb-4">Jan–Jun 2024 · Chauffeured tours</p>
          <div className="flex items-end gap-2 h-32 mb-2">
            {[42, 58, 78, 95, 112, 88].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-sans text-xs text-navy-700 dark:text-cream-300 font-medium">{val}</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(val / 112) * 100}%`,
                    backgroundColor: i === 4 ? '#c9a24a' : '#14284b',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
              <div key={m} className="flex-1 text-center font-sans text-xs text-navy-700 dark:text-cream-300">{m}</div>
            ))}
          </div>
          <p className="font-sans text-xs text-navy-500 dark:text-navy-300 mt-3">Source: Scudamore's booking system, 2024</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { rule: 'Single colour: Deep Navy', detail: 'For the data. Lantern Gold only to highlight one key bar or data point.' },
            { rule: 'No chart border', detail: 'No box around the chart area. Title sits in surrounding type using the typography hierarchy.' },
            { rule: 'Minimal or no gridlines', detail: 'Pale gridlines on y-axis only — Mist (#c2d0ec) at low opacity if needed.' },
            { rule: 'Data labels only when needed', detail: 'Never as decoration. Only if they aid comprehension over the visual alone.' },
            { rule: 'Generous whitespace', detail: 'Around the plot area — charts breathe, they don\'t fill.' },
            { rule: 'Source line always', detail: 'Below the chart in Caption style. Include the date or period the data covers.' },
          ].map(item => (
            <div key={item.rule} className="rounded-xl border border-border p-4">
              <p className="font-sans font-semibold text-sm text-foreground">{item.rule}</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Colour rules */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-2">When More Colour Is Needed</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Rule of thumb: when in doubt, use one colour. The story should come from the data, not the colours.</p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Need</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COLOUR_NEEDS.map(row => (
                <tr key={row.need} className="hover:bg-muted/40">
                  <td className="px-4 py-3 text-foreground">{row.need}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.approach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Chart types */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Chart Types</h2>
        <div className="space-y-3">
          {CHART_TYPES.map(type => (
            <div key={type.name} className="rounded-xl border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <div className="sm:w-40 shrink-0 mb-2 sm:mb-0">
                  <p className="font-sans font-semibold text-sm text-foreground">{type.name}</p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-sans text-sm text-muted-foreground"><span className="font-medium text-foreground">When:</span> {type.when}</p>
                  <p className="font-sans text-sm text-muted-foreground"><span className="font-medium text-foreground">Rule:</span> {type.rule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5">
          <p className="font-sans font-semibold text-sm text-red-700 dark:text-red-400 mb-2">✗ Always avoid</p>
          <ul className="space-y-1">
            {['3D charts', 'Exploded pie slices', 'Charts with drop shadows or gradient fills', '"Speedometer" gauges with multi-colour bands', 'Anything where decoration outweighs data'].map((item, i) => (
              <li key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
                <span className="text-red-600 dark:text-red-400 shrink-0">–</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Typography in charts */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Typography in Charts</h2>
        <div className="rounded-xl border border-border overflow-hidden mb-8">
          <table className="w-full font-sans text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Element</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Font</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Colour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TYPE_IN_CHARTS.map(row => (
                <tr key={row.element} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{row.element}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.font}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.size}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.colour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-sans font-semibold text-base text-navy-900 dark:text-cream-50 mb-4">Honesty Rules</h3>
        <div className="space-y-2">
          {[
            'Y-axis starts at zero for bar charts, always. Truncating the axis to exaggerate change is misleading.',
            'Pie chart slices add to 100%. Don\'t omit "Other" silently.',
            'Don\'t dual-axis unless the two scales are genuinely related. If you have to explain why two axes share a chart, they shouldn\'t.',
            'Round consistently. Don\'t show 47.3% next to 51% in the same chart.',
          ].map((rule, i) => (
            <p key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
              <span className="text-gold-500 dark:text-gold-300 shrink-0">–</span>
              {rule}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
