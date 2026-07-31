import { type CSSProperties } from 'react'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { CopyButton } from '@/components/shared/CopyButton'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAccent } from '@/features/brand-playground/palette'
import { getDerivedBrandPlaygroundTokens } from '@/features/brand-playground/playgroundState'
import { useBrandExpressionPreview } from '@/features/brand-playground/useBrandExpressionPreview'
import { checkContrast, hexToRgb } from '@/lib/wcag'

const SUB_NAV = [
  { label: 'Current draft', anchor: 'current-draft' },
  { label: 'Typography', anchor: 'quick-type' },
  { label: 'Essentials', anchor: 'essentials' },
]

function QuickSwatch({
  name,
  value,
  displayValue,
  swatchStyle,
  status,
}: {
  name: string
  value: string
  displayValue?: string
  swatchStyle?: CSSProperties
  status: 'Locked' | 'Expression' | 'Experimental'
}) {
  return (
    <Card className="gap-0">
      <CardContent className="p-3">
        <span
          aria-hidden="true"
          className="block h-14 rounded-md border border-black/10"
          style={swatchStyle ?? { backgroundColor: value }}
        />
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="font-sans text-sm font-semibold leading-5 text-foreground">{name}</p>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">{displayValue ?? value}</p>
          </div>
          <CopyButton
            value={value}
            accessibleLabel={`Copy ${name} ${value}`}
            size="sm"
          />
        </div>
        <Badge
          variant={status === 'Locked' ? 'outline' : status === 'Expression' ? 'secondary' : 'warning'}
          className="mt-3"
        >
          {status}
        </Badge>
      </CardContent>
    </Card>
  )
}

export function QuickReference() {
  const config = useBrandExpressionPreview()
  const tokens = getDerivedBrandPlaygroundTokens(config)
  const accent = getAccent(config.accentId)
  const navyOnAccent = checkContrast(hexToRgb(tokens.navy), hexToRgb(tokens.accentSurface))

  const accentSurfaceStyle = config.accentTreatment === 'grainy-gradient'
    ? {
        backgroundColor: tokens.accentSurface,
        backgroundImage: `${tokens.accentGrainTexture}, ${tokens.accentGradient}`,
        backgroundBlendMode: 'soft-light, normal',
        backgroundSize: '140px 140px, 100% 100%',
      } as CSSProperties
    : { backgroundColor: tokens.accentSurface }

  const swatches = [
    { name: 'Deep Navy', value: tokens.navy, status: 'Locked' as const },
    { name: 'Off-White', value: tokens.white, status: 'Locked' as const },
    { name: accent.name, value: tokens.accent, status: 'Expression' as const },
    {
      name: config.accentTreatment === 'grainy-gradient' ? 'Grainy gradient' : 'Accent surface',
      value: config.accentTreatment === 'grainy-gradient' ? tokens.accentGradient : tokens.accentSurface,
      displayValue: config.accentTreatment === 'grainy-gradient'
        ? `${tokens.accentSurface} → ${tokens.accentGradientEnd}`
        : tokens.accentSurface,
      swatchStyle: accentSurfaceStyle,
      status: 'Experimental' as const,
    },
    { name: 'Expression blue', value: tokens.expressionBlue, status: 'Experimental' as const },
    { name: 'Canvas', value: tokens.canvas, status: 'Experimental' as const },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Brand essentials"
        title="Quick Reference"
        description="Locked identity anchors, the working expression family, and the current local Playground treatment in one concise view. Draft settings update automatically without becoming production website tokens."
        badges={(
          <>
            <Badge variant="outline">2 locked anchors</Badge>
            <Badge variant={config.applyToBrandWorkspace ? 'success' : 'warning'} dot>
              Workspace preview {config.applyToBrandWorkspace ? 'on' : 'off'}
            </Badge>
          </>
        )}
      />

      <SectionSubNav items={SUB_NAV} />

      <section id="current-draft" className="scroll-mt-6" aria-labelledby="current-draft-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="current-draft-heading" className="font-sans text-2xl font-semibold text-foreground">Identity + current draft</h2>
            <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
              {accent.name} expression family at {config.accentIntensity}% intensity · {config.accentTreatment === 'grainy-gradient' ? 'grainy gradient' : 'solid'} draft treatment · {config.glassTone === 'white' ? 'White' : 'Navy'} glass · Navy-on-surface contrast {navyOnAccent.ratioDisplay}.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/brand/expression/playground">
              <FlaskConical aria-hidden="true" /> Open Playground
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {swatches.map((swatch) => <QuickSwatch key={swatch.name} {...swatch} />)}
        </div>

        <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4" role="note">
          <p className="font-sans text-sm font-semibold text-foreground">What “workspace preview” changes</p>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            When enabled in the Playground, the current accent and its solid or grainy-gradient treatment drive Brand primary actions and authored accent cues. Design System components, status colours, focus semantics, charts, and the immutable handoff keep their governed values.
          </p>
        </div>
      </section>

      <section id="quick-type" className="scroll-mt-6 pt-14" aria-labelledby="quick-type-heading">
        <h2 id="quick-type-heading" className="font-sans text-2xl font-semibold text-foreground">Typography</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Card className="gap-0">
            <CardContent className="p-5">
              <Badge variant="outline">Display</Badge>
              <p className="mt-5 font-display text-4xl font-bold leading-none tracking-display text-navy-900 dark:text-cream-50">
                Gill Sans Nova Bold
              </p>
              <p className="mt-4 font-sans text-sm leading-6 text-muted-foreground">
                Brand headlines, pull quotes, and authored display moments. Served through licensed Adobe Fonts kit <span className="font-mono">iia4izu</span>.
              </p>
            </CardContent>
          </Card>
          <Card className="gap-0">
            <CardContent className="p-5">
              <Badge variant="outline">Body & interface</Badge>
              <p className="mt-5 font-sans text-3xl font-semibold tracking-tight text-foreground">Instrument Sans</p>
              <p className="mt-4 font-sans text-sm leading-6 text-muted-foreground">
                Body copy, subheads, captions, controls, and working typography. Bundled through the existing pinned Fontsource package.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="essentials" className="scroll-mt-6 pt-14" aria-labelledby="essentials-heading">
        <h2 id="essentials-heading" className="font-sans text-2xl font-semibold text-foreground">Essential guidance</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Logo',
              detail: 'Use Deep Navy on light backgrounds and the White Outline mark on dark or photographic backgrounds.',
              to: '/brand/identity/logo',
            },
            {
              title: 'Voice',
              detail: 'Warm, quietly confident, knowledgeable, unfussy, and specific enough that a competitor could not say it.',
              to: '/brand/expression/voice',
            },
            {
              title: 'Photography',
              detail: 'Natural edits, real movement, named Cambridge places, and both landscape and portrait masters for key shots.',
              to: '/brand/expression/photography',
            },
          ].map((item) => (
            <Card key={item.title} className="gap-0">
              <CardContent className="flex h-full flex-col p-5">
                <h3 className="font-sans text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 font-sans text-sm leading-6 text-muted-foreground">{item.detail}</p>
                <Button asChild variant="link" className="mt-4 h-auto justify-start px-0">
                  <Link to={item.to}>Read full guidance <ArrowRight aria-hidden="true" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
