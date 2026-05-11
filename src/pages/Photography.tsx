import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Editing', anchor: 'editing' },
  { label: 'Composition', anchor: 'composition' },
  { label: 'Subjects', anchor: 'subjects' },
  { label: 'Aspect Ratios', anchor: 'aspect-ratios' },
  { label: 'Consent', anchor: 'consent' },
]

const ASPECT_RATIOS = [
  { use: 'Web hero, banner, YouTube thumbnail', ratio: '16:9', w: 16, h: 9, notes: 'Shoot wide, crop after' },
  { use: 'Instagram feed, square posts', ratio: '1:1', w: 1, h: 1, notes: 'Often a centre-crop of horizontal' },
  { use: 'Instagram Stories, Reels, TikTok, posters', ratio: '9:16', w: 9, h: 16, notes: 'Shoot deliberately, not by rotating horizontal' },
  { use: 'Print poster (A-series)', ratio: '√2 vertical', w: 7, h: 10, notes: 'Shoot vertical with crop margin' },
  { use: 'Email header', ratio: '3:1', w: 3, h: 1, notes: 'Crop from widest take' },
]

function AspectPreview({ w, h, ratio }: { w: number; h: number; ratio: string }) {
  const maxW = 80
  const maxH = 80
  const scale = Math.min(maxW / w, maxH / h)
  return (
    <div
      className="bg-navy-900/10 dark:bg-cream-50/10 border-2 border-navy-900/20 dark:border-cream-50/20 rounded flex items-center justify-center shrink-0"
      style={{ width: w * scale, height: h * scale }}
    >
      <span className="font-mono text-xs text-navy-700 dark:text-cream-300">{ratio}</span>
    </div>
  )
}

export function Photography() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Photography"
        title="Photography"
        description="A mix — we shoot whatever the day gives us. The unifying factor is the edit, not a single look. The job of every shoot and edit is to make variety feel like one body of work."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Editing */}
      <section id="editing" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Editing & Colour Grade</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { ok: true,  title: 'Natural', detail: 'Minimal colour grading, true to what the eye saw. Slight lifts to saturation and contrast where images need them.' },
            { ok: true,  title: 'Honest white balance', detail: 'Golden hour stays warm; overcast stays cool. Don\'t fight the weather — it\'s where our most distinctive images come from.' },
            { ok: false, title: 'No heavy filters', detail: 'No "tourism teal-and-orange", no fashion-style grades. Looks processed and dates fast.' },
            { ok: false, title: 'Reshoot, don\'t rescue', detail: 'If a photo needs heavy editing to work, the shoot was the problem. Reshoot rather than rescue.' },
          ].map(item => (
            <div key={item.title} className={cn(
              'rounded-xl border p-4',
              item.ok ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30' : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30',
            )}>
              <p className={cn(
                'font-sans text-xs font-medium uppercase tracking-caps mb-1',
                item.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              )}>{item.ok ? '✓ Do' : '✗ Don\'t'}</p>
              <p className="font-sans font-semibold text-sm text-foreground">{item.title}</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Composition */}
      <section id="composition" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Composition</h2>
        <div className="space-y-4 mb-6">
          {[
            { rule: 'Shoot wide, crop in', detail: 'Always shoot too wide at highest quality. Cropping in later is easier than missing the frame.' },
            { rule: 'Capture both formats', detail: 'Every key shot in both horizontal (16:9) AND vertical (9:16). Banners need horizontal; Stories and Reels need vertical.' },
            { rule: 'Natural light first', detail: 'Golden hour and the hour after sunrise are highest-value windows on the Cam.' },
            { rule: 'Shoot in all conditions', detail: 'Mist, rain, autumn leaves, frost on punts — these are where the most distinctive images come from. Don\'t only shoot blue-sky days.' },
            { rule: 'Capture movement', detail: 'The Cam is moving. Static, posed shots feel like stock. Capture the punt mid-stroke, water trailing off the pole, ripples breaking the reflection.' },
          ].map(item => (
            <div key={item.rule} className="flex gap-4 py-3 border-b border-border last:border-0">
              <span className="text-gold-500 dark:text-gold-300 shrink-0 mt-0.5">–</span>
              <div>
                <p className="font-sans font-semibold text-sm text-foreground">{item.rule}</p>
                <p className="font-sans text-sm text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Subjects */}
      <section id="subjects" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Subjects</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              category: 'People',
              items: ['Customers visibly enjoying themselves — candid laughter, conversation', 'Chauffeurs at work — mid-pole-stroke, the craft, hands and stance', 'Quiet moments — fingers trailing in water, a couple looking out', 'Anonymous figures — silhouettes, back-of-head shots, hands-only'],
            },
            {
              category: 'Products & Objects',
              items: ['Hero shots at Bridge of Sighs or behind King\'s College Chapel', 'The punts — woodgrain, seats, prow, the lines on water', 'The kit — poles, cushions, blankets, flasks', 'Heritage detail — brass fittings, painted name on prow'],
            },
            {
              category: 'Places',
              items: ['King\'s College Chapel and Bridge of Sighs from the river', 'Named colleges — King\'s, Trinity, St John\'s, Clare, Queens\'', 'Named bridges — Mathematical Bridge, Clare Bridge, Magdalene Bridge', 'Hidden Cambridge — quiet stretches, the Backs in winter, dawn on the Cam'],
            },
          ].map(group => (
            <div key={group.category} className="rounded-xl border border-border p-5">
              <h3 className="font-sans font-semibold text-base text-navy-900 dark:text-cream-50 mb-3">{group.category}</h3>
              <ul className="space-y-2">
                {group.items.map((item, i) => (
                  <li key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
                    <span className="text-gold-500 dark:text-gold-300 shrink-0">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Aspect Ratios */}
      <section id="aspect-ratios" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-2">Required Aspect Ratios</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Every key shot should exist in both a horizontal AND vertical master. If it doesn't, schedule a reshoot.</p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Preview</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Use</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps">Ratio</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-caps hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ASPECT_RATIOS.map(row => (
                <tr key={row.ratio} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <AspectPreview w={row.w} h={row.h} ratio={row.ratio} />
                  </td>
                  <td className="px-4 py-3 text-foreground">{row.use}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{row.ratio}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Consent */}
      <section id="consent" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">Consent & Rights</h2>
        <div className="space-y-3">
          {[
            { title: 'Chauffeurs and staff', detail: 'Photographed in detail. Employment contracts should cover image rights for company marketing — confirm with HR or use a signed release.' },
            { title: 'Customers — default', detail: 'Photographed anonymously (back-of-head, silhouettes, hands, wide environmental shots). River is public space; incidental presence is fine.' },
            { title: 'Identifiable customers', detail: 'If a customer is the clear subject, ask on the day and get a signed release covering name, date, image reference, and scope.' },
            { title: 'Children', detail: 'Anyone under 18 needs parental/guardian consent for commercial use. No explicit consent = no publish.' },
            { title: 'Records', detail: 'Keep all signed releases on file with corresponding image reference for GDPR compliance.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 py-3 border-b border-border last:border-0">
              <span className="text-gold-500 dark:text-gold-300 shrink-0 mt-0.5">–</span>
              <div>
                <p className="font-sans font-semibold text-sm text-foreground">{item.title}</p>
                <p className="font-sans text-sm text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
