import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell,
  PieChart, Pie, ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Separator } from '@/components/ui/separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// ── Brand palette constants ──────────────────────────────────────────────────
const NAVY    = '#14284b'
const GOLD    = '#c9a24a'
const CAM     = '#3d68b0'
const MIST    = '#c2d0ec'
const DUSK    = '#26467d'

// ── Data ─────────────────────────────────────────────────────────────────────
const MONTHLY = [
  { month: 'Jan', bookings: 42 },
  { month: 'Feb', bookings: 58 },
  { month: 'Mar', bookings: 78 },
  { month: 'Apr', bookings: 95 },
  { month: 'May', bookings: 112 },
  { month: 'Jun', bookings: 88 },
]

const SOURCES = [
  { source: 'Direct web',    bookings: 1240 },
  { source: 'OTA partners',  bookings:  870 },
  { source: 'Walk-in',       bookings:  430 },
  { source: 'Groups',        bookings:  210 },
  { source: 'Corporate',     bookings:  180 },
]

const TOUR_STACK = [
  { month: 'Jan', chauffeured: 28, selfHire: 10, private: 4 },
  { month: 'Feb', chauffeured: 36, selfHire: 14, private: 8 },
  { month: 'Mar', chauffeured: 48, selfHire: 20, private: 10 },
  { month: 'Apr', chauffeured: 58, selfHire: 26, private: 11 },
  { month: 'May', chauffeured: 70, selfHire: 30, private: 12 },
  { month: 'Jun', chauffeured: 54, selfHire: 24, private: 10 },
]

const BOOKING_SOURCE = [
  { name: 'Direct',   value: 58, fill: NAVY },
  { name: 'Partners', value: 31, fill: CAM  },
  { name: 'Walk-in',  value: 11, fill: MIST },
]

// ── Shared axis style ─────────────────────────────────────────────────────────
const axisStyle = { fontSize: 11, fill: DUSK, fontFamily: 'Inter, sans-serif' }

// ── Interactive bar chart (default Scudamore's chart) ────────────────────────
function BrandBarChart() {
  const [highlighted, setHighlighted] = useState(4) // May default

  return (
    <div className="rounded-xl border border-border p-6 mb-6 bg-card">
      <p className="font-sans font-semibold text-base text-navy-900 dark:text-cream-50 mb-1">
        Monthly Bookings
      </p>
      <p className="font-sans text-sm text-navy-700 dark:text-cream-300 mb-1">
        Jan–Jun 2024 · Chauffeured tours
      </p>
      <p className="font-sans text-xs text-muted-foreground mb-4">
        Click any bar to highlight it.
      </p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-44 w-full aspect-auto"
      >
        <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={MIST} strokeOpacity={0.5} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <ChartTooltip
            cursor={{ fill: MIST, fillOpacity: 0.3 }}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="bookings"
            radius={[3, 3, 0, 0]}
            cursor="pointer"
            onClick={(_data, index) => setHighlighted(index)}
          >
            {MONTHLY.map((_entry, i) => (
              <Cell key={i} fill={i === highlighted ? GOLD : NAVY} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <p className="font-sans text-xs text-navy-500 dark:text-navy-300 mt-3">
        Source: Scudamore's booking system, 2024
      </p>
    </div>
  )
}

// ── Line chart example ────────────────────────────────────────────────────────
function LineChartExample() {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <p className="font-sans font-semibold text-sm text-foreground mb-1">Line chart</p>
      <p className="font-sans text-xs text-muted-foreground mb-3">Trend over time</p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-32 w-full aspect-auto"
      >
        <LineChart data={MONTHLY} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={MIST} strokeOpacity={0.5} />
          <XAxis dataKey="month" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: MIST }}
            contentStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif', border: '1px solid hsl(var(--border))', borderRadius: 8, background: 'hsl(var(--background))' }}
            labelStyle={{ color: NAVY, fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke={NAVY}
            strokeWidth={2}
            dot={{ fill: NAVY, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: GOLD }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

// ── Horizontal bar chart example ──────────────────────────────────────────────
function HorizontalBarExample() {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <p className="font-sans font-semibold text-sm text-foreground mb-1">Horizontal bar chart</p>
      <p className="font-sans text-xs text-muted-foreground mb-3">Category comparison</p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-40 w-full aspect-auto"
      >
        <BarChart
          data={SOURCES}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke={MIST} strokeOpacity={0.5} />
          <XAxis type="number" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="source"
            width={76}
            tick={{ ...axisStyle, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: MIST, fillOpacity: 0.3 }}
            contentStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif', border: '1px solid hsl(var(--border))', borderRadius: 8, background: 'hsl(var(--background))' }}
          />
          <Bar dataKey="bookings" fill={NAVY} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

// ── Stacked bar chart example ─────────────────────────────────────────────────
function StackedBarExample() {
  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <p className="font-sans font-semibold text-sm text-foreground mb-1">Stacked bar chart</p>
      <p className="font-sans text-xs text-muted-foreground mb-3">Parts of a whole</p>
      <ChartContainer
        config={{
          chauffeured: { label: 'Chauffeured', color: NAVY },
          selfHire:    { label: 'Self-hire',   color: CAM  },
          private:     { label: 'Private',     color: MIST },
        }}
        className="h-36 w-full aspect-auto"
      >
        <BarChart data={TOUR_STACK} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={MIST} strokeOpacity={0.4} />
          <XAxis dataKey="month" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: MIST, fillOpacity: 0.2 }}
            contentStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif', border: '1px solid hsl(var(--border))', borderRadius: 8, background: 'hsl(var(--background))' }}
          />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: DUSK, paddingTop: 4 }}
          />
          <Bar dataKey="chauffeured" stackId="a" fill={NAVY} />
          <Bar dataKey="selfHire"    stackId="a" fill={CAM}  />
          <Bar dataKey="private"     stackId="a" fill={MIST} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

// ── Donut chart example ───────────────────────────────────────────────────────
function DonutChartExample() {
  const total = BOOKING_SOURCE.reduce((s, d) => s + d.value, 0)

  return (
    <div className="rounded-xl border border-border p-5 bg-card">
      <p className="font-sans font-semibold text-sm text-foreground mb-1">Donut chart</p>
      <p className="font-sans text-xs text-muted-foreground mb-3">3 slices max</p>
      <div className="relative h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={BOOKING_SOURCE}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {BOOKING_SOURCE.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif', border: '1px solid hsl(var(--border))', borderRadius: 8, background: 'hsl(var(--background))' }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-display font-bold text-xl text-navy-900 dark:text-cream-50 leading-none">{total}%</p>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">total</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {BOOKING_SOURCE.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: d.fill }} />
            <span className="font-sans text-xs text-muted-foreground">{d.name} {d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Static data tables ────────────────────────────────────────────────────────
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

// ── Page ──────────────────────────────────────────────────────────────────────
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

        <BrandBarChart />

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

      {/* Chart type gallery */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-2">Chart Types</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Interactive examples — hover to explore data. All use the Scudamore's colour palette.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <LineChartExample />
          <HorizontalBarExample />
          <StackedBarExample />
          <DonutChartExample />
        </div>

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
              <span className="text-navy-500 dark:text-navy-300 shrink-0">–</span>
              {rule}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
