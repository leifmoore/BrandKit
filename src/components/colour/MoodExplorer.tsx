import { useState, type CSSProperties } from 'react'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  LOCKED_BRAND_COLOURS,
  deriveAccessibleAccentSurface,
  getAccent,
  hexToRgba,
  mixHex,
} from '@/features/brand-playground/palette'
import {
  readBrandPlaygroundDraft,
  sanitizeBrandPlaygroundConfig,
  storeBrandPlaygroundDraft,
  type PlaygroundGlassTone,
} from '@/features/brand-playground/playgroundState'
import { cn } from '@/lib/utils'

interface ExpressionMood {
  readonly id: string
  readonly name: string
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly accentId: string
  readonly supportId: string
  readonly glassTone: PlaygroundGlassTone
  readonly use: string
  readonly rule: string
}

const EXPRESSION_MOODS: readonly ExpressionMood[] = [
  {
    id: 'day-tours',
    name: 'Day Tours',
    eyebrow: 'Classic river day',
    title: 'Cambridge, in its best light.',
    description: 'A calm, spacious direction for the core punting experience.',
    accentId: 'powder',
    supportId: 'butter',
    glassTone: 'white',
    use: 'Core tours, destination stories, maps, and broad-reach visitor campaigns.',
    rule: 'Let Deep Navy lead; Water Powder supplies atmosphere and Faded Butter adds only a warm glint.',
  },
  {
    id: 'private-tours',
    name: 'Private Tours',
    eyebrow: 'Warm personal service',
    title: 'Your river. Your pace.',
    description: 'Confident warmth for premium, personal booking moments.',
    accentId: 'coral',
    supportId: 'sand',
    glassTone: 'navy',
    use: 'Private tours, hospitality packages, selected CTAs, and host-led stories.',
    rule: 'Use River Coral as the focal action; Punt Sand supports materials and quieter detail.',
  },
  {
    id: 'weddings',
    name: 'Weddings',
    eyebrow: 'Romantic, never saccharine',
    title: 'A Cambridge celebration.',
    description: 'Soft editorial colour with enough Navy to remain unmistakably Scudamore’s.',
    accentId: 'rose',
    supportId: 'butter',
    glassTone: 'white',
    use: 'Weddings, gifting, proposals, celebrations, and people-led editorial work.',
    rule: 'Keep Faded Rose contextual; Deep Navy typography and the mark carry recognition.',
  },
  {
    id: 'summer',
    name: 'Summer',
    eyebrow: 'Sun on the College Backs',
    title: 'Long light on the Cam.',
    description: 'An energetic seasonal treatment built from warmth already present in the photography.',
    accentId: 'apricot',
    supportId: 'coral',
    glassTone: 'navy',
    use: 'Summer campaigns, late openings, hospitality, social stories, and seasonal print.',
    rule: 'Choose apricot as the atmosphere and coral as a small focal counterpoint—not two equal CTAs.',
  },
  {
    id: 'nature',
    name: 'Riverside',
    eyebrow: 'Ecology and seasonality',
    title: 'Closer to the river.',
    description: 'A natural expression for the living Cam without borrowing software success semantics.',
    accentId: 'sage',
    supportId: 'powder',
    glassTone: 'white',
    use: 'River ecology, gardens, wildlife, quiet mornings, and environmental stories.',
    rule: 'Sage means place and season here; it must never double as a success or validation colour.',
  },
  {
    id: 'twilight',
    name: 'Twilight',
    eyebrow: 'Evening on the water',
    title: 'After Cambridge turns blue.',
    description: 'A richer cultural and event treatment held together by the Deep Navy anchor.',
    accentId: 'violet',
    supportId: 'periwinkle',
    glassTone: 'navy',
    use: 'Fireworks, bat safari, private events, evening culture, and winter campaigns.',
    rule: 'Use Dusk Violet sparingly and let Evening Periwinkle bridge back into the blue family.',
  },
] as const

function getMoodRamp(sourceHex: string) {
  return [
    mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, 0.74),
    mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, 0.46),
    sourceHex,
    mixHex(sourceHex, LOCKED_BRAND_COLOURS.navy, 0.18),
    mixHex(sourceHex, LOCKED_BRAND_COLOURS.navy, 0.34),
  ]
}

export function MoodExplorer() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const mood = EXPRESSION_MOODS[active] ?? EXPRESSION_MOODS[0]
  const accent = getAccent(mood.accentId)
  const support = getAccent(mood.supportId)
  const accentSurface = deriveAccessibleAccentSurface(accent.sourceHex)
  const lightGlass = mood.glassTone === 'white'
  const moodRamp = getMoodRamp(accent.sourceHex)
  const panelStyle = {
    background: lightGlass
      ? 'linear-gradient(145deg, rgb(254 254 253 / 0.90), rgb(254 247 236 / 0.94))'
      : 'linear-gradient(145deg, rgb(20 40 75 / 0.88), rgb(10 21 48 / 0.94))',
    color: lightGlass ? LOCKED_BRAND_COLOURS.navy : LOCKED_BRAND_COLOURS.white,
    borderColor: lightGlass ? 'rgb(20 40 75 / 0.18)' : 'rgb(254 254 253 / 0.24)',
    backdropFilter: 'blur(16px) saturate(115%)',
    WebkitBackdropFilter: 'blur(16px) saturate(115%)',
  } as CSSProperties

  const openInPlayground = () => {
    const current = readBrandPlaygroundDraft()
    storeBrandPlaygroundDraft(sanitizeBrandPlaygroundConfig({
      ...current,
      pattern: 'booking-hero',
      accentId: mood.accentId,
      accentTreatment: 'grainy-gradient',
      glassTone: mood.glassTone,
    }))
    navigate('/brand/expression/playground')
  }

  return (
    <div className="space-y-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="Expression contexts">
        {EXPRESSION_MOODS.map((option, index) => (
          <Button
            key={option.id}
            type="button"
            variant={index === active ? 'default' : 'outline'}
            size="sm"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className="shrink-0 rounded-full px-4"
          >
            {option.name}
          </Button>
        ))}
      </div>

      <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]" data-mood-explorer={mood.id}>
        <div className="relative isolate min-h-[28rem] overflow-hidden bg-navy-900" role="region" aria-label={`${mood.name} expression preview`}>
          <img
            src="/images/brand/heroes/kings-private-landscape-960.jpg"
            alt="A Scudamore’s chauffeur punting customers past King’s College Chapel"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: [
                `radial-gradient(circle at 82% 14%, ${hexToRgba(support.sourceHex, 0.42)}, transparent 38%)`,
                `linear-gradient(120deg, ${hexToRgba(accent.sourceHex, 0.42)}, transparent 58%)`,
                `linear-gradient(180deg, transparent 38%, ${hexToRgba(LOCKED_BRAND_COLOURS.navy, 0.48)})`,
              ].join(', '),
            }}
          />
          <div className="relative z-10 flex min-h-[28rem] items-end p-5 sm:p-8">
            <div className="max-w-lg rounded-2xl border p-6 shadow-2xl sm:p-8" style={panelStyle} data-mood-copy>
              <img
                src={lightGlass ? '/logos/logo-navy.svg' : '/logos/logo-white.svg'}
                alt="Scudamore’s"
                className="mb-6 h-8 w-auto"
              />
              <p className={cn(
                'font-sans text-xs font-semibold uppercase tracking-[0.16em]',
                lightGlass ? 'text-navy-700' : 'text-navy-100',
              )}>
                {mood.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-4xl font-bold leading-none tracking-display sm:text-5xl">
                {mood.title}
              </h3>
              <p className={cn(
                'mt-4 max-w-md font-sans text-sm leading-6',
                lightGlass ? 'text-navy-700' : 'text-navy-50',
              )}>
                {mood.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex min-h-9 items-center rounded-full px-4 font-sans text-sm font-semibold text-navy-900"
                  style={{ backgroundColor: accentSurface }}
                >
                  Explore this mood <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </span>
                <span
                  className="rounded-full border border-current/20 px-3 py-1 font-sans text-xs font-semibold"
                  style={{ backgroundColor: hexToRgba(support.sourceHex, 0.28) }}
                >
                  + {support.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card className="gap-0 rounded-none border-0 border-l border-border shadow-none">
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{mood.name}</Badge>
              <Badge variant="warning">Expression recipe</Badge>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2" aria-label={`${mood.name} core colours`}>
              {[
                { name: 'Navy', value: LOCKED_BRAND_COLOURS.navy },
                { name: 'White', value: LOCKED_BRAND_COLOURS.white },
                { name: accent.name, value: accent.sourceHex },
                { name: support.name, value: support.sourceHex },
              ].map((colour) => (
                <div key={colour.name} className="min-w-0" title={`${colour.name} · ${colour.value}`}>
                  <span className="block h-9 rounded-md border border-black/10" style={{ backgroundColor: colour.value }} data-mood-swatch />
                  <span className="mt-1 block truncate font-sans text-[0.625rem] text-muted-foreground">{colour.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accent tonal range</p>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded-md border border-black/10">
                {moodRamp.map((colour) => (
                  <span key={colour} className="h-8" style={{ backgroundColor: colour }} title={colour} data-mood-ramp-step aria-hidden="true" />
                ))}
              </div>
            </div>

            <dl className="mt-6 space-y-4 font-sans text-sm leading-6">
              <div>
                <dt className="font-semibold text-foreground">Best for</dt>
                <dd className="mt-1 text-muted-foreground">{mood.use}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Composition rule</dt>
                <dd className="mt-1 text-muted-foreground">{mood.rule}</dd>
              </div>
            </dl>

            <Button type="button" className="mt-auto pt-6" onClick={openInPlayground}>
              <FlaskConical aria-hidden="true" /> Load {mood.name} in Playground
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
