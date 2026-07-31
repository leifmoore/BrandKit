import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const SUB_NAV = [
  { label: 'Digital', anchor: 'digital' },
  { label: 'Print', anchor: 'print' },
  { label: 'Social Specs', anchor: 'social-specs' },
]

type AppStatus = 'live' | 'to-produce' | 'needs-review' | 'pending'

function StatusBadge({ status }: { status: AppStatus }) {
  const config: Record<AppStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'outline' }> = {
    'live':         { label: 'Live', variant: 'success' },
    'to-produce':   { label: 'To produce', variant: 'warning' },
    'needs-review': { label: 'Needs review', variant: 'destructive' },
    'pending':      { label: 'Pending', variant: 'outline' },
  }
  const { label, variant } = config[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

const DIGITAL_APPS = [
  { application: 'Website — homepage', needed: 'Hero with tagline, product category cards, seasonal hero rotation', status: 'live' as AppStatus },
  { application: 'Website — product pages', needed: 'One template applied across chauffeured, hire, experiences, groups', status: 'needs-review' as AppStatus },
  { application: 'Website — booking flow', needed: 'Canonical Design System forms, date pickers, basket, confirmation, and Lucide icons.', status: 'needs-review' as AppStatus },
  { application: 'Email — newsletter template', needed: 'Header, hero image (16:9), section blocks, product cards, footer', status: 'to-produce' as AppStatus },
  { application: 'Email — booking confirmation', needed: 'Tabular figures for booking ref/date/time; warm closing line', status: 'to-produce' as AppStatus },
  { application: 'Email — transactional', needed: 'Reminders, post-trip thank-you, gift voucher delivery', status: 'to-produce' as AppStatus },
  { application: 'Instagram — feed (1:1)', needed: 'Hero photography, product launches, seasonal moments', status: 'needs-review' as AppStatus },
  { application: 'Instagram — Stories & Reels (9:16)', needed: 'Vertical-first photography, lower-third typography in Instrument Sans', status: 'to-produce' as AppStatus },
  { application: 'YouTube — channel art', needed: 'Hero shot of the Cam, brand mark, tagline (2560×1440 master)', status: 'needs-review' as AppStatus },
  { application: 'YouTube — thumbnails (16:9)', needed: 'Strong hero photography, large legible Gill Sans Nova Bold title', status: 'to-produce' as AppStatus },
  { application: 'Digital ads — paid social', needed: '1:1, 4:5, 9:16. Hero photography, Gill Sans Nova headline, reviewed CTA treatment.', status: 'to-produce' as AppStatus },
  { application: 'Internal — dashboards', needed: 'Canonical software components with the separately governed chart palette; never inherit Brand expression accents.', status: 'live' as AppStatus },
  { application: 'Internal — slide template', needed: 'Title, section divider, content, chart, image, closing slides', status: 'to-produce' as AppStatus },
]

const PRINT_APPS = [
  { application: 'Letterhead (A4)', needed: 'Navy mark, Mill Lane address, Instrument Sans body', status: 'to-produce' as AppStatus },
  { application: 'Business cards (85×55mm)', needed: 'Navy front with mark; light reverse with details. Accent treatment needs review.', status: 'to-produce' as AppStatus },
  { application: 'Gift vouchers', needed: 'Premium feel: light stock, Deep Navy, Gill Sans Nova display; accent treatment needs review.', status: 'needs-review' as AppStatus },
  { application: 'Posters — product (A2/A3)', needed: 'One per product line. Hero photography + Gill Sans Nova headline.', status: 'to-produce' as AppStatus },
  { application: 'Posters — event / seasonal', needed: 'May Bumps, Fireworks, Bat Safari, Champagne, Christmas vouchers', status: 'to-produce' as AppStatus },
  { application: 'Signage — boatyard & Mill Lane', needed: 'Wayfinding, pricing boards, opening times', status: 'needs-review' as AppStatus },
  { application: 'Visitor brochures / leaflets', needed: 'A5 or DL, product overview, map of the Backs, opening times', status: 'to-produce' as AppStatus },
  { application: 'Flyers / postcards (A6)', needed: 'Tour promotions, events, takeaway menus. 105 × 148mm.', status: 'to-produce' as AppStatus },
  { application: 'Print banner — large format (242.49 × 62.49 cm)', needed: '~3.9:1. Outdoor events, regattas, festivals. CMYK, 3mm bleed, 300 dpi.', status: 'to-produce' as AppStatus },
  { application: 'B2B partnership materials', needed: 'A4 portrait, products + group offers + case studies', status: 'to-produce' as AppStatus },
  { application: 'Certificates', needed: 'A4, watermark, Gill Sans Nova display, room for handwritten name and date', status: 'to-produce' as AppStatus },
]

const SOCIAL_SPECS = [
  { platform: 'Instagram Feed', format: '1:1 Square', size: '1080 × 1080px', notes: 'Centre-crop of horizontal master' },
  { platform: 'Instagram Portrait', format: '4:5', size: '1080 × 1350px', notes: 'Preferred feed format — more screen real estate' },
  { platform: 'Instagram Stories / Reels', format: '9:16', size: '1080 × 1920px', notes: 'Shoot deliberately vertical — don’t rotate horizontal' },
  { platform: 'YouTube Thumbnail', format: '16:9', size: '1280 × 720px', notes: 'Strong hero photography, large legible Gill Sans Nova title' },
  { platform: 'YouTube Channel Art', format: '16:9', size: '2560 × 1440px', notes: 'Design safe area: 1546 × 423px centre' },
  { platform: 'Email Header', format: '3:1', size: '600 × 200px', notes: 'Crop from widest take; consider dark mode rendering' },
  { platform: 'Print Poster (A2)', format: '√2:1', size: '420 × 594mm', notes: 'Shoot vertical with crop margin for bleeds' },
  { platform: 'Google Display Ad', format: 'Various', size: '300×250, 728×90, 300×600', notes: 'Brand mark, photography, single clear headline, reviewed CTA treatment' },
]

function AppTable({ label, rows }: { label: string; rows: { application: string; needed: string; status: AppStatus }[] }) {
  return (
    <GuidanceTable label={label}>
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Application</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">What’s needed</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-caps text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(row => (
            <tr key={row.application} className="hover:bg-muted/40">
              <td className="px-4 py-3 font-medium text-foreground">{row.application}</td>
              <td className="min-w-72 px-4 py-3 text-xs text-muted-foreground">{row.needed}</td>
              <td className="px-4 py-3 text-right"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
    </GuidanceTable>
  )
}

export function Applications() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Applications"
        title="Brand Applications"
        description="Use this working inventory before designing anything new. Confirm the source file and owner before reuse, then update the recorded status when the asset is verified."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Status legend */}
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="live" />
          <StatusBadge status="to-produce" />
          <StatusBadge status="needs-review" />
          <StatusBadge status="pending" />
        </div>
        <p className="font-sans text-xs leading-5 text-muted-foreground" role="note">
          Planning metadata only: even a Live label must be checked against a current source file and accountable owner before reuse.
        </p>
      </div>

      {/* Digital */}
      <section id="digital" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Digital Applications</h2>
        <AppTable label="Digital applications and production status" rows={DIGITAL_APPS} />
      </section>

      <Separator className="mb-14" />

      {/* Print */}
      <section id="print" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Print Applications</h2>
        <AppTable label="Print applications and production status" rows={PRINT_APPS} />
      </section>

      <Separator className="mb-14" />

      {/* Social specs */}
      <section id="social-specs" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Social Media & Format Specs</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          Every key shot should exist in a horizontal AND vertical master. If it doesn’t, schedule a reshoot. Platform requirements can change; confirm delivery specifications before final export.
        </p>
        <GuidanceTable label="Social media and format specifications" tableClassName="min-w-[48rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Platform</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Format</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Size</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SOCIAL_SPECS.map(row => (
                <tr key={`${row.platform}-${row.format}`} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">{row.platform}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.format}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{row.size}</td>
                  <td className="min-w-64 px-4 py-3 text-xs text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>
      </section>
    </div>
  )
}
