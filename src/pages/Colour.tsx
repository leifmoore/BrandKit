import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { ColourRamp } from '@/components/colour/ColourRamp'
import { ColourSwatch } from '@/components/colour/ColourSwatch'
import { ContrastChecker } from '@/components/colour/ContrastChecker'
import { MoodExplorer } from '@/components/colour/MoodExplorer'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { PLAYGROUND_ACCENTS, deriveExpressionRamp } from '@/features/brand-playground/palette'
import { NAVY_RAMP, CREAM_RAMP, PRIMARY_TOKENS, WCAG_APPROVED, WCAG_FORBIDDEN } from '@/lib/tokens'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Primary', anchor: 'primary' },
  { label: 'Expression Palette', anchor: 'accent-colours' },
  { label: 'Water Powder Ramp', anchor: 'navy-ramp' },
  { label: 'Faded Butter Ramp', anchor: 'cream-ramp' },
  { label: 'WCAG Pairs', anchor: 'wcag-pairs' },
  { label: 'WCAG Checker', anchor: 'wcag-checker' },
  { label: 'Mood Explorer', anchor: 'mood-explorer' },
]

const EXPRESSION_CONTEXTS: Record<string, { use: string; avoid: string }> = {
  rose: {
    use: 'Gifting, celebrations, romance, and people-led editorial stories.',
    avoid: 'Default booking actions or urgency messaging.',
  },
  coral: {
    use: 'Energetic campaigns, selected booking prompts, and warm focal moments.',
    avoid: 'Errors, warnings, or dense blocks of coral UI.',
  },
  apricot: {
    use: 'Summer light, sunset tours, hospitality, and atmospheric highlights.',
    avoid: 'Small text without a contrast-safe surface adjustment.',
  },
  sand: {
    use: 'Heritage, print, timber, archive, and quietly luxurious editorial work.',
    avoid: 'Low-contrast copy on Cream or Off-White.',
  },
  butter: {
    use: 'Family experiences, daytime stories, and soft editorial emphasis.',
    avoid: 'Status warnings or text without Deep Navy.',
  },
  sage: {
    use: 'River ecology, gardens, seasonality, and nature-led stories.',
    avoid: 'Success states; software semantics own that meaning.',
  },
  powder: {
    use: 'River, sky, calm informational moments, and spacious compositions.',
    avoid: 'Replacing the recognisable Deep Navy anchor.',
  },
  periwinkle: {
    use: 'Colleges, culture, evening light, and blue-adjacent depth.',
    avoid: 'Overuse beside every Navy element; preserve hierarchy.',
  },
  violet: {
    use: 'Twilight tours, private events, and occasional cultural campaigns.',
    avoid: 'Becoming a permanent primary or generic luxury shorthand.',
  },
}

function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 mb-14">
      <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function Colour() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Colour"
        title="Colour Palette"
        description="Deep Navy and Off-White are the non-negotiable default. A context-led expression palette adds range for editorial, campaign, and product moments without replacing those anchors."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Primary */}
      <SubSection id="primary" title="Primary Colours">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {PRIMARY_TOKENS.map(token => (
            <div key={token.alias} className="flex flex-col gap-3">
              <ColourSwatch token={token} size="lg" />
              <div>
                <p className="font-sans font-semibold text-sm text-foreground">{token.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{token.hex} · {token.alias}</p>
                {token.description && (
                  <p className="mt-1 font-sans text-xs text-muted-foreground">{token.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="font-sans text-sm text-muted-foreground">
          Deep Navy is the primary Brand colour. Off-White is the primary light surface. Neither may be replaced by playground experiments.
        </p>
      </SubSection>

      <Separator className="mb-14" />

      {/* Expression Colours */}
      <SubSection id="accent-colours" title="Context-led Expression Palette">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="outline">Working expression palette</Badge>
          <Badge variant="warning">Intensity & treatment still in review</Badge>
        </div>
        <p className="mb-6 max-w-3xl font-sans text-sm leading-6 text-muted-foreground">
          These nine families are available for different Brand contexts. They are not nine interchangeable primary colours: start every composition with Deep Navy and Off-White, then choose one dominant accent family that reinforces the story.
        </p>

        <div className="mb-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {PLAYGROUND_ACCENTS.map((accent) => {
            const ramp = deriveExpressionRamp(accent.sourceHex)
            return (
              <Card key={accent.id} className="gap-0">
                <CardContent className="p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="size-10 shrink-0 rounded-md border border-black/10"
                      style={{ backgroundColor: accent.sourceHex }}
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-sans text-sm font-semibold text-foreground">{accent.name}</h3>
                      <p className="font-mono text-[0.6875rem] text-muted-foreground">{accent.sourceHex}</p>
                    </div>
                  </div>
                  <div
                    className="mt-3 grid grid-cols-5 overflow-hidden rounded-md border border-black/10"
                    aria-label={`${accent.name} tonal steps`}
                    data-expression-ramp={accent.id}
                  >
                    {ramp.map((tone) => (
                      <div key={tone.step} className="min-w-0" title={`${tone.step} · ${tone.hex}`} data-expression-ramp-step={tone.step}>
                        <span className="block h-6" style={{ backgroundColor: tone.hex }} aria-hidden="true" />
                        <span className="block bg-card py-1 text-center font-mono text-[0.5625rem] text-muted-foreground">{tone.step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4" role="note">
          <p className="font-sans text-sm font-semibold text-foreground">Closest existing hue relationships</p>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            Deep Navy remains fixed at 218.2° HSL while its lighter ramp now travels toward Water Powder at 194.7°. Off-White remains fixed while the warm-light ramp travels toward Faded Butter at 35.5°. These are deliberate hue transitions rather than single-hue mathematical scales; the locked anchors do not move.
          </p>
        </div>

        <GuidanceTable label="Expression accent use cases">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Accent</th>
              <th scope="col" className="px-4 py-3 font-semibold">Good contexts</th>
              <th scope="col" className="px-4 py-3 font-semibold">Avoid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PLAYGROUND_ACCENTS.map((accent) => (
              <tr key={accent.id}>
                <th scope="row" className="px-4 py-3 text-left font-semibold text-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: accent.sourceHex }} aria-hidden="true" />
                    {accent.name}
                  </span>
                </th>
                <td className="px-4 py-3 leading-6 text-muted-foreground">{EXPRESSION_CONTEXTS[accent.id].use}</td>
                <td className="px-4 py-3 leading-6 text-muted-foreground">{EXPRESSION_CONTEXTS[accent.id].avoid}</td>
              </tr>
            ))}
          </tbody>
        </GuidanceTable>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <p className="font-sans text-sm font-semibold text-foreground">Usage boundary</p>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            Use one dominant expression family per composition. The sampled hex is a reference point; text-bearing surfaces may be lightened to meet contrast, and solid versus grainy-gradient treatment remains a Playground decision. Never repurpose these colours for software status, focus, validation, or chart semantics. Lantern Gold remains a historical proposal rather than part of this family.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link to="/brand/expression/playground">Workshop an expression family</Link>
          </Button>
        </div>
      </SubSection>

      <Separator className="mb-14" />

      {/* Navy Ramp */}
      <SubSection id="navy-ramp" title="Deep Navy → Water Powder Ramp">
        <ColourRamp
          title=""
          tokens={NAVY_RAMP}
          description="Seven authored Brand steps. Midnight and locked Deep Navy hold the dark identity; the lighter steps transition toward Water Powder (#a2cddb) and its atmospheric tints."
        />
      </SubSection>

      <Separator className="mb-14" />

      {/* Cream Ramp */}
      <SubSection id="cream-ramp" title="Off-White → Faded Butter Ramp">
        <ColourRamp
          title=""
          tokens={CREAM_RAMP}
          description="Six warm Brand steps from locked Off-White (#fefefd) to the Faded Butter expression source (#feeacd). Use the lighter tints for paper-like warmth and the source sparingly for editorial emphasis."
        />
      </SubSection>

      <Separator className="mb-14" />

      {/* WCAG contrast pairs */}
      <SubSection id="wcag-pairs" title="WCAG Passing & Failing Pairs">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-sans font-semibold text-base text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
              <span>✓</span> Contrast-passing pairings
            </h3>
            <div className="space-y-1">
              {WCAG_APPROVED.map((pair, i) => {
                const fgToken = [...NAVY_RAMP, ...CREAM_RAMP].find(t => t.alias === pair.fg)
                const bgToken = [...NAVY_RAMP, ...CREAM_RAMP].find(t => t.alias === pair.bg)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans py-1.5 border-b border-border last:border-0">
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded border border-black/10" style={{ background: fgToken?.hex }} />
                      <span className="w-4 h-4 rounded border border-black/10" style={{ background: bgToken?.hex }} />
                    </div>
                    <span className="font-medium text-foreground">{pair.fg} on {pair.bg}</span>
                    <span className={cn(
                      'ml-auto px-1.5 py-0.5 rounded font-medium',
                      pair.level === 'AAA' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
                    )}>{pair.level}</span>
                    <span className="text-muted-foreground">{pair.note}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="font-sans font-semibold text-base text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <span>✗</span> Never use these
            </h3>
            <div className="space-y-1">
              {WCAG_FORBIDDEN.map((pair, i) => {
                const fgToken = [...NAVY_RAMP, ...CREAM_RAMP].find(t => t.alias === pair.fg)
                const bgToken = [...NAVY_RAMP, ...CREAM_RAMP].find(t => t.alias === pair.bg)
                return (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans py-1.5 border-b border-border last:border-0">
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded border border-black/10" style={{ background: fgToken?.hex }} />
                      <span className="w-4 h-4 rounded border border-black/10" style={{ background: bgToken?.hex }} />
                    </div>
                    <span className="font-medium text-foreground">{pair.fg} on {pair.bg}</span>
                    <span className="ml-auto text-muted-foreground">{pair.reason}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </SubSection>

      <Separator className="mb-14" />

      {/* WCAG Checker */}
      <SubSection id="wcag-checker" title="Live WCAG Contrast Checker">
        <ContrastChecker />
      </SubSection>

      <Separator className="mb-14" />

      {/* Mood Explorer */}
      <SubSection id="mood-explorer" title="Mood Explorer">
        <p className="mb-6 font-sans text-sm text-muted-foreground">
          Compare compact, photography-led recipes for real Scudamore’s contexts. Each composition keeps Deep Navy and Off-White present, assigns one dominant expression accent, and can be loaded directly into the full Playground for refinement.
        </p>
        <MoodExplorer />
      </SubSection>
    </div>
  )
}
