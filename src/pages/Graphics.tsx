import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const SUB_NAV = [
  { label: 'Icon Libraries', anchor: 'icon-libraries' },
  { label: 'Decorative Elements', anchor: 'decorative-elements' },
  { label: 'Illustration', anchor: 'illustration' },
]

const ICON_LIBRARIES = [
  { name: 'Lucide', bestFor: 'Web / product UI', notes: 'Already in use via shadcn; minimal, geometric, free. Primary for this brand kit and the website.', status: 'primary' },
  { name: 'Phosphor', bestFor: 'Marketing, Figma, decorative', notes: 'Multiple weights (thin → bold → fill); more character than Lucide. Use for editorial layouts.', status: 'approved' },
  { name: 'Tabler', bestFor: 'Dashboards, dense UI, admin', notes: '~5800 icons, free, outline-only. Good for information-dense internal tools.', status: 'approved' },
  { name: 'Bootstrap Icons', bestFor: 'Web fallback / legacy', notes: 'Already in use on the main site. Keep until consolidating to one system.', status: 'legacy' },
  { name: 'Bespoke', bestFor: 'Punt-specific, seasonal events', notes: 'Custom icons for punt, pole, chauffeur stance, Cambridge landmarks, seasonal events. In development.', status: 'pending' },
]

const DECORATIVE_APPROVED = [
  { element: 'Hairline rules', detail: '0.5px Deep Navy lines for dividing text, separating sections, framing photo captions. Never thicker than 1px.' },
  { element: 'Lantern Gold accent line', detail: 'Short (40–60mm / ~150–225px) horizontal gold line under section labels or eyebrow text for editorial moments.' },
  { element: '"Est. 1910" lockup', detail: 'Small-caps text mark for heritage-led pieces. Best in Inter at 10–11pt with +15% tracking.' },
  { element: 'Watermark / stamp', detail: 'Icon-only logo at low opacity (10–15%) for letterhead, certificates, formal documents.' },
]

const DECORATIVE_AVOID = [
  'Heavy borders or frames around content',
  'Decorative flourishes — curls, scrolls, ornaments. Dates fast and competes with heritage type.',
  'Rounded badges with text ("Since 1910!" in a circle) — fine for fun moments only, never as default brand decoration.',
  'Drop shadows, glows, or gradients on text or shapes — fights the flat, calm aesthetic.',
]

export function Graphics() {
  return (
    <div>
      <SectionHeader
        eyebrow="Graphics & Icons"
        title="Graphics & Icons"
        description="Keep things clean. Heavy decoration would fight the heritage feel and the photography. A small, consistent set of decorative devices can elevate layouts without crowding them."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Icon libraries */}
      <section id="icon-libraries" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Icon Libraries</h2>
        <GuidanceTable label="Approved and candidate icon libraries" className="mb-8" tableClassName="min-w-[48rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Library</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Best for</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Notes</th>
                <th scope="col" aria-label="Status" className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ICON_LIBRARIES.map(lib => (
                <tr key={lib.name} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{lib.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lib.bestFor}</td>
                  <td className="min-w-72 px-4 py-3 text-xs text-muted-foreground">{lib.notes}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant={lib.status === 'primary' ? 'default' : lib.status === 'pending' ? 'outline' : 'secondary'}>
                      {lib.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>

        <h3 className="mb-4 font-sans text-base font-semibold text-foreground">Style Rules</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Outline by default', detail: 'Solid fills only when the icon needs to read at very small sizes or carry semantic weight (e.g. filled bookmark = saved).' },
            { title: 'Consistent weight within a piece', detail: "Don't mix Phosphor Thin and Phosphor Bold in the same layout." },
            { title: 'Sizing', detail: '16px (UI inline) · 20px (default) · 24px (touch targets, decorative inline) · 32px+ (feature blocks).' },
            { title: 'Colour', detail: 'Deep Navy by default. Lantern Gold for accent / interactive states. Off-White on dark backgrounds. Never pure black.' },
            { title: 'Stroke width', detail: '1.5–2px for outline icons at standard sizes. Never below 1px.' },
          ].map(rule => (
            <Card key={rule.title} className="gap-0">
              <CardContent className="p-4">
                <h4 className="font-sans font-semibold text-sm text-foreground">{rule.title}</h4>
                <p className="font-sans text-sm text-muted-foreground mt-1">{rule.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Decorative elements */}
      <section id="decorative-elements" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Decorative Elements</h2>

        <div className="mb-8">
          <h3 className="font-sans font-semibold text-base text-green-700 dark:text-green-400 mb-4">✓ Approved</h3>
          <div className="space-y-4">
            {DECORATIVE_APPROVED.map(item => (
              <Card key={item.element} className="gap-0">
                <CardContent className="p-5">
                  <h4 className="font-sans font-semibold text-sm text-foreground mb-1">{item.element}</h4>
                  <p className="font-sans text-sm text-muted-foreground">{item.detail}</p>
                  {item.element === 'Hairline rules' && <div className="mt-3 border-t border-navy-900/20 dark:border-cream-50/20" style={{ borderTopWidth: '0.5px' }} />}
                  {item.element === 'Lantern Gold accent line' && <div className="mt-3 h-0.5 w-20 bg-gold-500 dark:bg-gold-300 rounded" />}
                  {item.element === '"Est. 1910" lockup' && <p className="mt-3 font-sans font-medium text-xs uppercase tracking-caps text-navy-700 dark:text-cream-300" style={{ fontVariant: 'small-caps' }}>Est. 1910</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans font-semibold text-base text-red-600 dark:text-red-400 mb-4">✗ Avoid</h3>
          <div className="space-y-2">
            {DECORATIVE_AVOID.map((item, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                <span className="text-red-600 dark:text-red-400 shrink-0 mt-0.5">✗</span>
                <p className="font-sans text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Illustration */}
      <section id="illustration" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Illustration</h2>
        <Card className="gap-0 border-dashed text-center">
          <CardContent className="p-8">
            <Badge variant="outline" className="mb-4">Pending — style to be defined</Badge>
            <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
              We use illustration occasionally but don't have a documented style yet. Until we do, illustration commissions and uses should be reviewed case-by-case.
            </p>
            <div className="mt-6 text-left max-w-sm mx-auto space-y-2">
              <p className="font-sans text-xs font-semibold text-foreground">Working principles when we do illustrate:</p>
              {[
                'Photography does the heavy lifting — illustration supplements, doesn\'t replace',
                'Heritage-leaning — hand-drawn warmth (engraved/etched/linocut feel) over flat vector clip-art',
                'Two-tone where possible — Deep Navy + Cream, or Deep Navy + Lantern Gold',
              ].map((p, i) => (
                <p key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
                  <span className="text-gold-500 dark:text-gold-300 shrink-0">–</span>
                  {p}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
