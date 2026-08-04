import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Editing', anchor: 'editing' },
  { label: 'Composition', anchor: 'composition' },
  { label: 'Subjects', anchor: 'subjects' },
  { label: 'Aspect Ratios', anchor: 'aspect-ratios' },
  { label: 'Product Heroes', anchor: 'product-heroes' },
  { label: 'Consent', anchor: 'consent' },
]

const ASPECT_RATIOS = [
  { use: 'Web hero, YouTube thumbnail', ratio: '16:9', w: 16, h: 9, notes: 'Shoot wide, crop after' },
  { use: 'Instagram feed, square posts', ratio: '1:1', w: 1, h: 1, notes: 'Often a centre-crop of horizontal' },
  { use: 'Instagram Stories, Reels, TikTok, posters', ratio: '9:16', w: 9, h: 16, notes: 'Shoot deliberately, not by rotating horizontal' },
  { use: 'Print poster (A-series)', ratio: '√2:1', w: 1000, h: 1414, notes: 'Shoot vertical with crop margin' },
  { use: 'Email header', ratio: '3:1', w: 3, h: 1, notes: 'Crop from widest take' },
  { use: 'Website / digital banner', ratio: '2:1', w: 2, h: 1, notes: 'Primary digital banner crop' },
  { use: 'Print banner (242.49 × 62.49 cm)', ratio: '~3.9:1', w: 39, h: 10, notes: 'Large format outdoor / event print' },
]

const PRODUCT_HEROES = [
  { name: 'Shared College Backs Punt Tours', ratio: '16:9', note: 'Wide group shot on the Backs, King\'s Chapel in frame' },
  { name: 'Private College Backs Punt Tours', ratio: '16:9', note: 'Intimate couple or small group, golden hour' },
  { name: 'Grantchester Punt Tours', ratio: '16:9', note: 'Open meadow stretch, punts in motion' },
  { name: 'Punt Hire (College Backs)', ratio: '4:5', note: 'Self-hire moment — customers with pole, candid' },
  { name: 'Punt Hire (Grantchester)', ratio: '4:5', note: 'Open water, relaxed self-hire feel' },
  { name: 'Afternoon Tea Punt Tours', ratio: '16:9', note: 'Tea tray in punt, pastel tones, Backs backdrop' },
  { name: 'Champagne Punt Tours', ratio: '16:9', note: 'Flutes raised, evening light on the Cam' },
  { name: 'Bat Safari Punting', ratio: '16:9', note: 'Dusk on the river, silhouette, low light' },
  { name: 'Fireworks Punt Tours', ratio: '16:9', note: 'Night on the Cam, fireworks or anticipation' },
  { name: 'Gin Punting Tours', ratio: '16:9', note: 'G&T detail shot on punt, social and relaxed' },
  { name: 'Romantic & Wedding Tours', ratio: '4:5', note: 'Couple close-up, flowers, soft tones' },
]

const HERO_IMAGES = {
  landscape: {
    src: '/images/brand/heroes/kings-private-landscape-960.jpg',
    srcSet: '/images/brand/heroes/kings-private-landscape-960.jpg 960w, /images/brand/heroes/kings-private-landscape-1600.jpg 1600w',
  },
  portrait: {
    src: '/images/brand/heroes/kings-private-portrait-720.jpg',
    srcSet: '/images/brand/heroes/kings-private-portrait-720.jpg 720w, /images/brand/heroes/kings-private-portrait-1080.jpg 1080w',
  },
} as const

function ResponsiveHeroImage({ className = '', eager = false }: { className?: string; eager?: boolean }) {
  return (
    <picture>
      <source
        media="(max-width: 639px)"
        srcSet={HERO_IMAGES.portrait.srcSet}
        sizes="100vw"
      />
      <img
        src={HERO_IMAGES.landscape.src}
        srcSet={HERO_IMAGES.landscape.srcSet}
        sizes="(min-width: 1024px) 960px, 100vw"
        alt="A Scudamore’s chauffeur punting customers past King’s College Chapel"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}

function ProductPlaceholderImage({ ratio }: { ratio: string }) {
  const portrait = ratio === '4:5'
  const image = portrait ? HERO_IMAGES.portrait : HERO_IMAGES.landscape

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )
}

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
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Editing & Colour Grade</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { ok: true,  title: 'Natural', detail: 'Minimal colour grading, true to what the eye saw. Slight lifts to saturation and contrast where images need them.' },
            { ok: true,  title: 'Honest white balance', detail: 'Golden hour stays warm; overcast stays cool. Don\'t fight the weather — it\'s where our most distinctive images come from.' },
            { ok: false, title: 'No heavy filters', detail: 'No "tourism teal-and-orange", no fashion-style grades. Looks processed and dates fast.' },
            { ok: false, title: 'Reshoot, don\'t rescue', detail: 'If a photo needs heavy editing to work, the shoot was the problem. Reshoot rather than rescue.' },
          ].map(item => (
            <Card key={item.title} className={cn(
              'gap-0',
              item.ok ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30' : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30',
            )}>
              <CardContent className="p-4">
                <p className={cn(
                  'font-sans text-xs font-medium uppercase tracking-caps mb-1',
                  item.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                )}>{item.ok ? '✓ Do' : '✗ Don\'t'}</p>
                <h3 className="font-sans font-semibold text-sm text-foreground">{item.title}</h3>
                <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Composition */}
      <section id="composition" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Composition</h2>
        <div className="space-y-4 mb-6">
          {[
            { rule: 'Shoot wide, crop in', detail: 'Always shoot too wide at highest quality. Cropping in later is easier than missing the frame.' },
            { rule: 'Capture both formats', detail: 'Every key shot in both horizontal (16:9) AND vertical (9:16). Banners need horizontal; Stories and Reels need vertical.' },
            { rule: 'Natural light first', detail: 'Golden hour and the hour after sunrise are highest-value windows on the Cam.' },
            { rule: 'Shoot in all conditions', detail: 'Mist, rain, autumn leaves, frost on punts — these are where the most distinctive images come from. Don\'t only shoot blue-sky days.' },
            { rule: 'Capture movement', detail: 'The Cam is moving. Static, posed shots feel like stock. Capture the punt mid-stroke, water trailing off the pole, ripples breaking the reflection.' },
          ].map(item => (
            <div key={item.rule} className="flex gap-4 py-3 border-b border-border last:border-0">
              <span className="mt-0.5 shrink-0 text-brand-expression-accent">–</span>
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
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Subjects</h2>
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
            <Card key={group.category} className="gap-0">
              <CardContent className="p-5">
                <h3 className="mb-3 font-sans text-base font-semibold text-foreground">{group.category}</h3>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
                      <span className="shrink-0 text-brand-expression-accent">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Aspect Ratios */}
      <section id="aspect-ratios" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Required Aspect Ratios</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Every key shot should exist in both a horizontal AND vertical master. If it doesn't, schedule a reshoot.</p>
        <GuidanceTable label="Required photography aspect ratios" tableClassName="min-w-[44rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Preview</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Use</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Ratio</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Notes</th>
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
                  <td className="min-w-64 px-4 py-3 text-xs text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>
      </section>

      <Separator className="mb-14" />

      {/* Product Heroes */}
      <section id="product-heroes" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Product Hero Images</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          Each product line needs a dedicated hero image. The current landscape and portrait pair is shared across the placeholders below so layouts can be designed and tested now; replace each one with its product-specific master once approved.
        </p>

        <Card className="mb-6 gap-0 overflow-hidden">
          <figure>
            <div className="aspect-[4/5] overflow-hidden bg-navy-900 sm:aspect-[16/9]">
              <ResponsiveHeroImage className="h-full w-full object-cover" eager />
            </div>
            <figcaption className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">Current shared hero pair</h3>
                <p className="mt-1 max-w-2xl font-sans text-sm leading-6 text-muted-foreground">
                  Use the landscape master for wide website compositions and the portrait master for narrow/mobile art direction. Preserve King’s College Chapel, the punt, and the chauffeur rather than deriving the portrait by cropping the landscape file.
                </p>
              </div>
              <Badge variant="outline" className="w-fit shrink-0">Temporary source</Badge>
            </figcaption>
          </figure>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCT_HEROES.map(product => (
            <Card key={product.name} className="gap-0 overflow-hidden">
              <div
                className="overflow-hidden bg-navy-900"
                style={{ aspectRatio: product.ratio.replace(':', '/') }}
              >
                <ProductPlaceholderImage ratio={product.ratio} />
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans font-semibold text-sm text-foreground">{product.name}</h3>
                  <Badge variant="secondary" className="shrink-0">Placeholder</Badge>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">{product.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Consent */}
      <section id="consent" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Consent & Rights</h2>
        <div className="mb-5 rounded-lg border border-status-warning/35 bg-status-warning/10 p-4" role="note">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="warning">Operational draft</Badge>
            <p className="font-sans text-sm font-semibold text-foreground">Confirm with the company’s legal, privacy, and HR owners.</p>
          </div>
          <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
            These are conservative working practices, not legal sign-off. Use the approved release process and retention policy before commissioning, publishing, or storing identifiable photography.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { title: 'Chauffeurs and staff', detail: 'Confirm the applicable employment terms with HR or secure an approved signed release before using identifiable staff photography.' },
            { title: 'Customers — default', detail: 'Prefer anonymous framing: back-of-head, silhouettes, hands, and wide environmental shots. Do not assume the location alone grants marketing permission.' },
            { title: 'Identifiable customers', detail: 'If a customer is a clear subject, use the approved release process and record the image reference and agreed scope.' },
            { title: 'Children', detail: 'Do not publish identifiable children without recorded parent or guardian permission and the required internal review.' },
            { title: 'Records', detail: 'Store releases and image references only through the approved privacy and retention process.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 py-3 border-b border-border last:border-0">
              <span className="mt-0.5 shrink-0 text-brand-expression-accent">–</span>
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
