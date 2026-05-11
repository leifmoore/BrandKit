import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { ColourRamp } from '@/components/colour/ColourRamp'
import { ColourSwatch } from '@/components/colour/ColourSwatch'
import { ContrastChecker } from '@/components/colour/ContrastChecker'
import { MoodExplorer } from '@/components/colour/MoodExplorer'
import { Separator } from '@/components/ui/separator'
import { NAVY_RAMP, CREAM_RAMP, GOLD_RAMP, PRIMARY_TOKENS, WCAG_APPROVED, WCAG_FORBIDDEN } from '@/lib/tokens'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Primary', anchor: 'primary' },
  { label: 'Navy Ramp', anchor: 'navy-ramp' },
  { label: 'Cream Ramp', anchor: 'cream-ramp' },
  { label: 'Gold Accent', anchor: 'gold-accent' },
  { label: 'WCAG Pairs', anchor: 'wcag-pairs' },
  { label: 'WCAG Checker', anchor: 'wcag-checker' },
  { label: 'Mood Explorer', anchor: 'mood-explorer' },
]

function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 mb-14">
      <h2 className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50 mb-6">{title}</h2>
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
        description="Two primary anchors — Deep Navy and Off-White — extended with a warm cream ramp, a saturated navy ramp, and a gold accent family. Click any swatch to copy in your preferred format."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Primary */}
      <SubSection id="primary" title="Primary Colours">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {PRIMARY_TOKENS.map(token => (
            <div key={token.alias} className="flex flex-col gap-3">
              <ColourSwatch token={token} size="lg" />
              <div>
                <p className="font-sans font-semibold text-sm text-navy-900 dark:text-cream-50">{token.name}</p>
                <p className="font-mono text-xs text-navy-500 dark:text-navy-300">{token.hex} · {token.alias}</p>
                {token.description && (
                  <p className="font-sans text-xs text-navy-700 dark:text-cream-300 mt-1">{token.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="font-sans text-sm text-navy-700 dark:text-cream-300">
          Deep Navy is the primary brand colour. Off-White is the primary light surface. Lantern Gold is the accent — use for CTAs, links, and key interactive states.
        </p>
      </SubSection>

      <Separator className="mb-14" />

      {/* Navy Ramp */}
      <SubSection id="navy-ramp" title="Navy Ramp — Saturated">
        <ColourRamp
          title=""
          tokens={NAVY_RAMP}
          description="Seven shades from Midnight (#0a1530) to Vapour (#e7edf8). Use darker shades for backgrounds and text; lighter shades for hover states and subtle backgrounds."
        />
      </SubSection>

      <Separator className="mb-14" />

      {/* Cream Ramp */}
      <SubSection id="cream-ramp" title="Cream Ramp — Warm">
        <ColourRamp
          title=""
          tokens={CREAM_RAMP}
          description="Six warm cream shades from Off-White (#fefefd) to Stone (#d4c8a6). Paper-like warmth — evokes print, heritage, the river at dawn."
        />
      </SubSection>

      <Separator className="mb-14" />

      {/* Gold Accent */}
      <SubSection id="gold-accent" title="Gold Accent">
        <ColourRamp
          title=""
          tokens={GOLD_RAMP}
          description="Three gold shades. Lantern Gold (#c9a24a) is the primary accent. Honey (#e3c277) is for use on dark/navy backgrounds. Brass (#9c7a2f) for visited links and heritage moments."
        />
      </SubSection>

      <Separator className="mb-14" />

      {/* WCAG approved pairs */}
      <SubSection id="wcag-pairs" title="WCAG Approved & Forbidden Pairs">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-sans font-semibold text-base text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
              <span>✓</span> Approved pairings
            </h3>
            <div className="space-y-1">
              {WCAG_APPROVED.map((pair, i) => {
                const fgToken = [...NAVY_RAMP, ...CREAM_RAMP, ...GOLD_RAMP].find(t => t.alias === pair.fg)
                const bgToken = [...NAVY_RAMP, ...CREAM_RAMP, ...GOLD_RAMP].find(t => t.alias === pair.bg)
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
                const fgToken = [...NAVY_RAMP, ...CREAM_RAMP, ...GOLD_RAMP].find(t => t.alias === pair.fg)
                const bgToken = [...NAVY_RAMP, ...CREAM_RAMP, ...GOLD_RAMP].find(t => t.alias === pair.bg)
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
        <p className="font-sans text-sm text-navy-700 dark:text-cream-300 mb-6">
          The master palette holds across all products and seasons. Filter by context to see the recommended colour combinations for each mood.
        </p>
        <MoodExplorer />
      </SubSection>
    </div>
  )
}
