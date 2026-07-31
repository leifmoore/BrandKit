import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell,
  PieChart, Pie, ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// ── Governed software data-visualisation palette ─────────────────────────────
// This stable chart palette is intentionally independent from the authored
// Brand Water Powder/Faded Butter ramps and Playground expression accents.
const NAVY    = '#14284b'
const CAM     = '#3d68b0'
const MIST    = '#c2d0ec'

// Application chrome around authored Brand series uses semantic UI roles.
const UI_GRID = 'var(--border)'
const UI_AXIS = 'var(--muted-foreground)'
const UI_SURFACE = 'var(--popover)'
const UI_FOREGROUND = 'var(--popover-foreground)'
const UI_FONT = "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"

const SUB_NAV = [
  { label: 'Default Chart', anchor: 'default-chart' },
  { label: 'Chart Types', anchor: 'chart-types' },
  { label: 'Colour', anchor: 'chart-colour' },
  { label: 'Typography', anchor: 'chart-typography' },
]

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
const axisStyle = { fontSize: 11, fill: UI_AXIS, fontFamily: UI_FONT }

interface ChartColumn<Row extends object> {
  key: keyof Row
  label: string
}

function ChartDataDisclosure<Row extends object>({
  label,
  rows,
  columns,
}: {
  label: string
  rows: readonly Row[]
  columns: readonly ChartColumn<Row>[]
}) {
  return (
    <details className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
      <summary className="cursor-pointer rounded-sm font-sans text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        View data table
      </summary>
      <GuidanceTable label={label} className="mt-3 bg-card" tableClassName="min-w-[28rem]">
        <thead className="bg-muted">
          <tr>
            {columns.map(column => (
              <th key={String(column.key)} scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(column => (
                <td key={String(column.key)} className="px-3 py-2 text-sm text-foreground">
                  {String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </GuidanceTable>
    </details>
  )
}

// ── Interactive bar chart (default Scudamore’s chart) ────────────────────────
function BrandBarChart() {
  const [highlighted, setHighlighted] = useState(4) // May default

  return (
    <Card className="mb-6 gap-0 p-6">
      <h3 className="mb-1 font-sans text-base font-semibold text-foreground">
        Monthly Bookings
      </h3>
      <p className="mb-1 font-sans text-sm text-muted-foreground">
        Jan–Jun 2024 · Chauffeured tours
      </p>
      <p className="font-sans text-xs text-muted-foreground mb-4">
        Select a month below or click a bar to highlight it.
      </p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-44 w-full aspect-auto"
        role="img"
        aria-label="Monthly chauffeured-tour bookings from January to June 2024"
      >
        <BarChart data={MONTHLY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={UI_GRID} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <ChartTooltip
            cursor={{ fill: UI_GRID, fillOpacity: 0.35 }}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="bookings"
            radius={[3, 3, 0, 0]}
            cursor="pointer"
            onClick={(_data, index) => setHighlighted(index)}
          >
            {MONTHLY.map((_entry, i) => (
              <Cell key={i} fill={i === highlighted ? CAM : NAVY} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Highlight booking month">
        {MONTHLY.map((entry, index) => (
          <Button
            key={entry.month}
            type="button"
            size="sm"
            variant={index === highlighted ? 'default' : 'outline'}
            aria-pressed={index === highlighted}
            onClick={() => setHighlighted(index)}
          >
            {entry.month}
          </Button>
        ))}
      </div>
      <p className="mt-2 font-sans text-xs text-muted-foreground" role="status" aria-live="polite">
        Highlighted: {MONTHLY[highlighted].month}, {MONTHLY[highlighted].bookings} bookings.
      </p>
      <p className="mt-3 font-sans text-xs text-muted-foreground">
        Source: Scudamore’s booking system, 2024
      </p>
      <ChartDataDisclosure
        label="Monthly chauffeured-tour bookings, January to June 2024"
        rows={MONTHLY}
        columns={[
          { key: 'month', label: 'Month' },
          { key: 'bookings', label: 'Bookings' },
        ]}
      />
    </Card>
  )
}

// ── Line chart example ────────────────────────────────────────────────────────
function LineChartExample() {
  return (
    <Card className="gap-0 p-5">
      <h3 className="font-sans font-semibold text-sm text-foreground mb-1">Line chart</h3>
      <p className="font-sans text-xs text-muted-foreground mb-3">Trend over time</p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-32 w-full aspect-auto"
        role="img"
        aria-label="Line chart of monthly bookings from January to June"
      >
        <LineChart data={MONTHLY} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={UI_GRID} />
          <XAxis dataKey="month" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: UI_GRID }}
            contentStyle={{ color: UI_FOREGROUND, fontSize: 11, fontFamily: UI_FONT, border: '1px solid var(--border)', borderRadius: 8, background: UI_SURFACE }}
            labelStyle={{ color: UI_FOREGROUND, fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke={NAVY}
            strokeWidth={2}
            dot={{ fill: NAVY, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: CAM }}
          />
        </LineChart>
      </ChartContainer>
      <ChartDataDisclosure
        label="Monthly bookings trend"
        rows={MONTHLY}
        columns={[
          { key: 'month', label: 'Month' },
          { key: 'bookings', label: 'Bookings' },
        ]}
      />
    </Card>
  )
}

// ── Horizontal bar chart example ──────────────────────────────────────────────
function HorizontalBarExample() {
  return (
    <Card className="gap-0 p-5">
      <h3 className="font-sans font-semibold text-sm text-foreground mb-1">Horizontal bar chart</h3>
      <p className="font-sans text-xs text-muted-foreground mb-3">Category comparison</p>
      <ChartContainer
        config={{ bookings: { label: 'Bookings', color: NAVY } }}
        className="h-40 w-full aspect-auto"
        role="img"
        aria-label="Horizontal bar chart comparing bookings by source"
      >
        <BarChart
          data={SOURCES}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke={UI_GRID} />
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
            cursor={{ fill: UI_GRID, fillOpacity: 0.35 }}
            contentStyle={{ color: UI_FOREGROUND, fontSize: 11, fontFamily: UI_FONT, border: '1px solid var(--border)', borderRadius: 8, background: UI_SURFACE }}
          />
          <Bar dataKey="bookings" fill={NAVY} radius={[0, 3, 3, 0]} />
        </BarChart>
      </ChartContainer>
      <ChartDataDisclosure
        label="Bookings by source"
        rows={SOURCES}
        columns={[
          { key: 'source', label: 'Source' },
          { key: 'bookings', label: 'Bookings' },
        ]}
      />
    </Card>
  )
}

// ── Stacked bar chart example ─────────────────────────────────────────────────
function StackedBarExample() {
  return (
    <Card className="gap-0 p-5">
      <h3 className="font-sans font-semibold text-sm text-foreground mb-1">Stacked bar chart</h3>
      <p className="font-sans text-xs text-muted-foreground mb-3">Parts of a whole</p>
      <ChartContainer
        config={{
          chauffeured: { label: 'Chauffeured', color: NAVY },
          selfHire:    { label: 'Self-hire',   color: CAM  },
          private:     { label: 'Private',     color: MIST },
        }}
        className="h-36 w-full aspect-auto"
        role="img"
        aria-label="Stacked bar chart of tour types by month"
      >
        <BarChart data={TOUR_STACK} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={UI_GRID} />
          <XAxis dataKey="month" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: UI_GRID, fillOpacity: 0.25 }}
            contentStyle={{ color: UI_FOREGROUND, fontSize: 11, fontFamily: UI_FONT, border: '1px solid var(--border)', borderRadius: 8, background: UI_SURFACE }}
          />
          <Legend
            iconType="square"
            iconSize={8}
            wrapperStyle={{ fontSize: 10, fontFamily: UI_FONT, color: UI_AXIS, paddingTop: 4 }}
          />
          <Bar dataKey="chauffeured" stackId="a" fill={NAVY} />
          <Bar dataKey="selfHire"    stackId="a" fill={CAM}  />
          <Bar dataKey="private"     stackId="a" fill={MIST} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <ChartDataDisclosure
        label="Tour types by month"
        rows={TOUR_STACK}
        columns={[
          { key: 'month', label: 'Month' },
          { key: 'chauffeured', label: 'Chauffeured' },
          { key: 'selfHire', label: 'Self-hire' },
          { key: 'private', label: 'Private' },
        ]}
      />
    </Card>
  )
}

// ── Donut chart example ───────────────────────────────────────────────────────
function DonutChartExample() {
  const total = BOOKING_SOURCE.reduce((s, d) => s + d.value, 0)

  return (
    <Card className="gap-0 p-5">
      <h3 className="font-sans font-semibold text-sm text-foreground mb-1">Donut chart</h3>
      <p className="font-sans text-xs text-muted-foreground mb-3">3 slices max</p>
      <div className="relative h-36" role="img" aria-label="Donut chart showing booking source percentages">
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
              contentStyle={{ color: UI_FOREGROUND, fontSize: 11, fontFamily: UI_FONT, border: '1px solid var(--border)', borderRadius: 8, background: UI_SURFACE }}
              formatter={(value, name) => [`${Number(value ?? 0)}%`, String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-sans text-xl font-semibold leading-none text-foreground">{total}%</p>
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
      <ChartDataDisclosure
        label="Booking source percentages"
        rows={BOOKING_SOURCE}
        columns={[
          { key: 'name', label: 'Source' },
          { key: 'value', label: 'Percentage' },
        ]}
      />
    </Card>
  )
}

// ── Static data tables ────────────────────────────────────────────────────────
const CHART_TYPES = [
  { name: 'Line chart', when: 'Change over time — revenue, bookings, occupancy, growth metrics.', rule: 'Single Deep Navy line by default. Add a second line in governed Software Blue only for a direct comparison. Avoid more than two lines — use small multiples instead.' },
  { name: 'Bar chart (vertical)', when: 'Comparing values across discrete categories with natural order (months, quarters, tour types).', rule: 'Single colour by default. Use governed Software Blue to highlight one bar ("this month" or "highest performer").' },
  { name: 'Bar chart (horizontal)', when: 'Comparing values where labels are long — customer feedback themes, source-of-booking, college names.', rule: 'Easier to read than vertical when you have 6+ categories.' },
  { name: 'Stacked bar', when: 'Showing parts of a whole across categories — tour-type breakdown by month.', rule: 'Use the governed software blue ramp sequentially: Deep Navy at bottom, lighter tints as you stack up.' },
  { name: 'Pie / donut', when: '3 or fewer slices only.', rule: 'For more than 3, use horizontal bar chart. If donut, put the most important number in the centre.' },
  { name: 'Heatmap', when: 'Two-dimensional data — occupancy by day-of-week × hour-of-day.', rule: 'Use the stable single-hue software ramp from pale Software Mist through Software Blue to Deep Navy. Light = low, dark = high.' },
  { name: 'Maps', when: 'Geographic data — where customers come from.', rule: 'Use the governed software blue ramp as a choropleth. UK and Cambridge city maps are preferred over generic world projections.' },
  { name: 'Single-stat / gauge', when: 'Headline numbers in dashboards.', rule: 'Big number in Gill Sans Nova Bold or the approved body semibold, Deep Navy. Use semantic status styling for deltas.' },
]

const COLOUR_NEEDS = [
  { need: 'Highlight one data point in a series', approach: 'Keep the rest Deep Navy; make the highlighted point governed Software Blue (#3d68b0)' },
  { need: 'Sequential / ordered data (quarters, age brackets)', approach: 'Use the governed software blue ramp; do not import the Brand expression ramps as data semantics' },
  { need: 'Categorical data (up to 4 categories)', approach: 'Deep Navy and stable software-blue tints in their recorded priority order' },
  { need: 'Categorical data (5+ categories)', approach: 'Extend the stable software ramp before introducing a reviewed external data palette' },
  { need: 'Diverging data (positive vs negative, e.g. NPS)', approach: 'Use governed semantic success, danger, and neutral tokens rather than Brand accents' },
  { need: 'Comparisons (us vs competitor, this year vs last)', approach: 'Deep Navy for "us / this year"; governed Software Mist or a semantic neutral for "them / last year"' },
]

const TYPE_IN_CHARTS = [
  { element: 'Chart title (above chart)', font: 'Gill Sans Nova Bold or approved body semibold', size: 'H3 or H4', colour: 'Deep Navy' },
  { element: 'Subtitle / context', font: 'Instrument Sans Regular', size: '14pt', colour: 'Semantic muted foreground' },
  { element: 'Axis labels', font: 'Instrument Sans Medium', size: '12pt', colour: 'Semantic muted foreground' },
  { element: 'Tick labels', font: 'Instrument Sans Regular (tabular figures)', size: '11pt', colour: 'Semantic muted foreground' },
  { element: 'Data labels', font: 'Instrument Sans Medium (tabular figures)', size: '11pt', colour: 'Deep Navy' },
  { element: 'Legend', font: 'Instrument Sans Regular', size: '12pt', colour: 'Semantic muted foreground' },
  { element: 'Source line', font: 'Instrument Sans Regular', size: '11pt', colour: 'Semantic muted foreground' },
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

      <SectionSubNav items={SUB_NAV} />

      {/* Default chart */}
      <section id="default-chart" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">The Default Scudamore’s Chart</h2>

        <BrandBarChart />

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { rule: 'Single colour: Deep Navy', detail: 'For the data. Governed Software Blue may highlight one key bar or data point.' },
            { rule: 'No chart border', detail: 'No box around the chart area. Title sits in surrounding type using the typography hierarchy.' },
            { rule: 'Minimal or no gridlines', detail: 'Semantic border gridlines on the y-axis only, at low emphasis if needed.' },
            { rule: 'Data labels only when needed', detail: 'Never as decoration. Only if they aid comprehension over the visual alone.' },
            { rule: 'Generous whitespace', detail: 'Around the plot area — charts breathe, they don\'t fill.' },
            { rule: 'Source line always', detail: 'Below the chart in Caption style. Include the date or period the data covers.' },
          ].map(item => (
            <Card key={item.rule} className="gap-0 p-4">
              <h3 className="font-sans font-semibold text-sm text-foreground">{item.rule}</h3>
              <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Chart type gallery */}
      <section id="chart-types" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Chart Types</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Hover to explore visual tooltips or open each data table for an equivalent keyboard and screen-reader-readable view. Series use the authored Scudamore’s chart palette.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <LineChartExample />
          <HorizontalBarExample />
          <StackedBarExample />
          <DonutChartExample />
        </div>

        <div className="space-y-3">
          {CHART_TYPES.map(type => (
            <Card key={type.name} className="gap-0 p-5">
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <div className="sm:w-40 shrink-0 mb-2 sm:mb-0">
                  <h3 className="font-sans font-semibold text-sm text-foreground">{type.name}</h3>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-sans text-sm text-muted-foreground"><span className="font-medium text-foreground">When:</span> {type.when}</p>
                  <p className="font-sans text-sm text-muted-foreground"><span className="font-medium text-foreground">Rule:</span> {type.rule}</p>
                </div>
              </div>
            </Card>
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
      <section id="chart-colour" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">When More Colour Is Needed</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Rule of thumb: when in doubt, use one colour. The story should come from the data, not the colours.</p>
        <GuidanceTable label="Chart colour selection guidance" tableClassName="min-w-[44rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Need</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Approach</th>
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
        </GuidanceTable>
      </section>

      <Separator className="mb-14" />

      {/* Typography in charts */}
      <section id="chart-typography" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Typography in Charts</h2>
        <GuidanceTable label="Chart typography guidance" className="mb-8" tableClassName="min-w-[46rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Element</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Font</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Size</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Colour</th>
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
        </GuidanceTable>

        <h3 className="mb-4 font-sans text-base font-semibold text-foreground">Honesty Rules</h3>
        <div className="space-y-2">
          {[
            'Y-axis starts at zero for bar charts, always. Truncating the axis to exaggerate change is misleading.',
            'Pie chart slices add to 100%. Don\'t omit "Other" silently.',
            'Don\'t dual-axis unless the two scales are genuinely related. If you have to explain why two axes share a chart, they shouldn\'t.',
            'Round consistently. Don\'t show 47.3% next to 51% in the same chart.',
          ].map((rule, i) => (
            <p key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
              <span className="shrink-0 text-muted-foreground">–</span>
              {rule}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
