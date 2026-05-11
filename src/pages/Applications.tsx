import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Digital', anchor: 'digital' },
  { label: 'Print', anchor: 'print' },
  { label: 'Social Specs', anchor: 'social-specs' },
]

type AppStatus = 'live' | 'to-produce' | 'needs-review' | 'pending'

function StatusBadge({ status }: { status: AppStatus }) {
  const config: Record<AppStatus, { label: string; className: string }> = {
    'live':         { label: '✅ Live', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800' },
    'to-produce':   { label: '🟡 To produce', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
    'needs-review': { label: '⚠️ Needs review', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    'pending':      { label: '🔵 Pending', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  }
  const { label, className } = config[status]
  return <Badge variant="outline" className={cn('text-xs whitespace-nowrap', className)}>{label}</Badge>
}

const DIGITAL_APPS = [
  { application: 'Website — homepage', needed: 'Hero with tagline, product category cards, seasonal hero rotation', status: 'live' as AppStatus },
  { application: 'Website — product pages', needed: 'One template applied across chauffeured, hire, experiences, groups', status: 'needs-review' as AppStatus },
  { application: 'Website — booking flow', needed: 'Forms, date pickers, basket, confirmation. Lucide icons via shadcn.', status: 'needs-review' as AppStatus },
  { application: 'Email — newsletter template', needed: 'Header, hero image (16:9), section blocks, product cards, footer', status: 'to-produce' as AppStatus },
  { application: 'Email — booking confirmation', needed: 'Tabular figures for booking ref/date/time; warm closing line', status: 'to-produce' as AppStatus },
  { application: 'Email — transactional', needed: 'Reminders, post-trip thank-you, gift voucher delivery', status: 'to-produce' as AppStatus },
  { application: 'Instagram — feed (1:1)', needed: 'Hero photography, product launches, seasonal moments', status: 'needs-review' as AppStatus },
  { application: 'Instagram — Stories & Reels (9:16)', needed: 'Vertical-first photography, lower-third typography in Inter', status: 'to-produce' as AppStatus },
  { application: 'YouTube — channel art', needed: 'Hero shot of the Cam, brand mark, tagline (2560×1440 master)', status: 'needs-review' as AppStatus },
  { application: 'YouTube — thumbnails (16:9)', needed: 'Strong hero photography, large legible Gill Sans Bold title', status: 'to-produce' as AppStatus },
  { application: 'Digital ads — paid social', needed: '1:1, 4:5, 9:16. Hero photography, Gill Sans headline, Gold CTA.', status: 'to-produce' as AppStatus },
  { application: 'Internal — dashboards', needed: 'shadcn defaults extended with brand palette per Charts section', status: 'live' as AppStatus },
  { application: 'Internal — slide template', needed: 'Title, section divider, content, chart, image, closing slides', status: 'to-produce' as AppStatus },
]

const PRINT_APPS = [
  { application: 'Letterhead (A4)', needed: 'Navy mark, Mill Lane address, Inter body', status: 'to-produce' as AppStatus },
  { application: 'Business cards (85×55mm)', needed: 'Navy front with mark and Gold accent, cream reverse with details', status: 'to-produce' as AppStatus },
  { application: 'Gift vouchers', needed: 'Premium feel: cream stock, Brass + Deep Navy, Gill Sans display', status: 'needs-review' as AppStatus },
  { application: 'Posters — product (A2/A3)', needed: 'One per product line. Hero photography + Gill Sans headline.', status: 'to-produce' as AppStatus },
  { application: 'Posters — event / seasonal', needed: 'May Bumps, Fireworks, Bat Safari, Champagne, Christmas vouchers', status: 'to-produce' as AppStatus },
  { application: 'Signage — boatyard & Mill Lane', needed: 'Wayfinding, pricing boards, opening times', status: 'needs-review' as AppStatus },
  { application: 'Visitor brochures / leaflets', needed: 'A5 or DL, product overview, map of the Backs, opening times', status: 'to-produce' as AppStatus },
  { application: 'Flyers / postcards (A6)', needed: 'Tour promotions, events, takeaway menus. 105 × 148mm.', status: 'to-produce' as AppStatus },
  { application: 'Print banner — large format (242.49 × 62.49 cm)', needed: '~3.9:1. Outdoor events, regattas, festivals. CMYK, 3mm bleed, 300 dpi.', status: 'to-produce' as AppStatus },
  { application: 'B2B partnership materials', needed: 'A4 portrait, products + group offers + case studies', status: 'to-produce' as AppStatus },
  { application: 'Certificates', needed: 'A4, watermark, Gill Sans display, room for handwritten name and date', status: 'to-produce' as AppStatus },
]

const SOCIAL_SPECS = [
  { platform: 'Instagram Feed', format: '1:1 Square', size: '1080 × 1080px', notes: 'Centre-crop of horizontal master' },
  { platform: 'Instagram Portrait', format: '4:5', size: '1080 × 1350px', notes: 'Preferred feed format — more screen real estate' },
  { platform: 'Instagram Stories / Reels', format: '9:16', size: '1080 × 1920px', notes: 'Shoot deliberately vertical — don\'t rotate horizontal' },
  { platform: 'YouTube Thumbnail', format: '16:9', size: '1280 × 720px', notes: 'Strong hero photography, large legible Gill Sans title' },
  { platform: 'YouTube Channel Art', format: '16:9', size: '2560 × 1440px', notes: 'Design safe area: 1546 × 423px centre' },
  { platform: 'Email Header', format: '3:1', size: '600 × 200px', notes: 'Crop from widest take; consider dark mode rendering' },
  { platform: 'Print Poster (A2)', format: '√2:1', size: '420 × 594mm', notes: 'Shoot vertical with crop margin for bleeds' },
  { platform: 'Google Display Ad', format: 'Various', size: '300×250, 728×90, 300×600', notes: 'Brand mark, photography, single clear headline, Gold CTA' },
]

function AppTable({ rows }: { rows: { application: string; needed: string; status: AppStatus }[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full font-sans text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Application</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps hidden md:table-cell">What's needed</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(row => (
            <tr key={row.application} className="hover:bg-muted/40">
              <td className="px-4 py-3 font-medium text-foreground">{row.application}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{row.needed}</td>
              <td className="px-4 py-3 text-right"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Applications() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Applications"
        title="Brand Applications"
        description="Before designing anything new, check here — there may already be a template or precedent. When you produce a new on-brand asset, update its status to Live."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Status legend */}
      <div className="flex flex-wrap gap-2 mb-10">
        <StatusBadge status="live" />
        <StatusBadge status="to-produce" />
        <StatusBadge status="needs-review" />
        <span className="font-sans text-xs text-muted-foreground self-center">— track status as you build or audit assets</span>
      </div>

      {/* Digital */}
      <section id="digital" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Digital Applications</h2>
        <AppTable rows={DIGITAL_APPS} />
      </section>

      <Separator className="mb-14" />

      {/* Print */}
      <section id="print" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Print Applications</h2>
        <AppTable rows={PRINT_APPS} />
      </section>

      <Separator className="mb-14" />

      {/* Social specs */}
      <section id="social-specs" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-2">Social Media & Format Specs</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          Every key shot should exist in a horizontal AND vertical master. If it doesn't, schedule a reshoot.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Format</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps hidden sm:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps hidden md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SOCIAL_SPECS.map(row => (
                <tr key={`${row.platform}-${row.format}`} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{row.platform}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.format}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{row.size}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
