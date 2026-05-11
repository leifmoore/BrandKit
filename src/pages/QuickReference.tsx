import { ALL_TOKENS, TYPE_SCALE, WCAG_APPROVED } from '@/lib/tokens'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Separator } from '@/components/ui/separator'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

function QuickSwatch({ hex, name, alias }: { hex: string; name: string; alias: string }) {
  const { copy } = useCopyToClipboard()
  return (
    <button
      onClick={() => copy(hex)}
      className="flex items-center gap-2 hover:bg-muted/50 rounded px-1 py-0.5 group text-left w-full"
      title={`Copy ${hex}`}
    >
      <span className="w-5 h-5 rounded-sm border border-black/10 shrink-0" style={{ background: hex }} />
      <span className="font-sans text-xs font-medium text-foreground">{name}</span>
      <span className="font-mono text-xs text-muted-foreground ml-auto">{hex}</span>
    </button>
  )
}

export function QuickReference() {
  return (
    <div>
      <SectionHeader
        eyebrow="Cheat Sheet"
        title="Quick Reference"
        description="All brand tokens at a glance. Click any colour to copy its hex. For full specs, navigate to the relevant section."
      />

      {/* Colours */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Colours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {ALL_TOKENS.map(t => <QuickSwatch key={t.alias} hex={t.hex} name={t.name} alias={t.alias} />)}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Type scale */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Type Scale</h2>
        <div className="space-y-2">
          {TYPE_SCALE.map(s => (
            <div key={s.level} className="flex items-baseline gap-3 py-1.5 border-b border-border last:border-0">
              <span className="font-sans text-xs text-muted-foreground w-40 shrink-0">{s.level}</span>
              <span
                className="font-sans text-foreground truncate"
                style={{ fontSize: Math.min(parseFloat(s.size) * 14, 28) + 'px', fontFamily: s.font === 'display' ? 'Gill Sans, Lato, sans-serif' : 'Inter, sans-serif', fontWeight: s.weight, letterSpacing: s.tracking }}
              >
                Where Cambridge goes punting.
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Logo rules */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Logo</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Clear space: 0.5× preferred, 0.25× minimum (of logo height)',
            'Digital minimum: 90px width',
            'Print minimum: 25mm width',
            'Solid navy (#14284b) — light backgrounds only',
            'White outline — dark backgrounds, photography overlays',
            'Never recolour outside approved palette',
          ].map((rule, i) => (
            <p key={i} className="font-sans text-sm text-foreground flex gap-2">
              <span className="text-gold-500 dark:text-gold-300 shrink-0">–</span>{rule}
            </p>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* WCAG quick pairs */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Key WCAG Pairs</h2>
        <div className="grid sm:grid-cols-2 gap-1">
          {WCAG_APPROVED.slice(0, 8).map((pair, i) => {
            const fgToken = ALL_TOKENS.find(t => t.alias === pair.fg)
            const bgToken = ALL_TOKENS.find(t => t.alias === pair.bg)
            return (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                <div className="flex gap-1">
                  <span className="w-3.5 h-3.5 rounded-sm border border-black/10" style={{ background: fgToken?.hex }} />
                  <span className="w-3.5 h-3.5 rounded-sm border border-black/10" style={{ background: bgToken?.hex }} />
                </div>
                <span className="font-sans text-xs text-foreground">{pair.fg} on {pair.bg}</span>
                <span className={`ml-auto font-sans text-xs font-medium px-1.5 py-0.5 rounded ${pair.level === 'AAA' ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}`}>{pair.level}</span>
              </div>
            )
          })}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Voice sniff test */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Voice — The Sniff Test</h2>
        <div className="rounded-xl bg-navy-900 dark:bg-navy-1000 p-6 text-cream-50 mb-4">
          <p className="font-display font-bold text-xl">"Where Cambridge goes punting."</p>
          <p className="font-sans text-sm text-navy-100 mt-2">Could a competitor publish this sentence verbatim? If yes, rewrite it.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { label: 'Never say:', items: ['"Let\'s go punting"', '"Cam River"', '"Glide along the river"', '"Unforgettable experience"'] },
            { label: 'Voice is:', items: ['Warm (informed friend)', 'Quietly confident (1910, no shouting)', 'Knowledgeable (name the bridges)', 'Unfussy (short sentences, plain words)'] },
          ].map(group => (
            <div key={group.label}>
              <p className="font-sans text-xs font-semibold text-foreground mb-2">{group.label}</p>
              {group.items.map((item, i) => (
                <p key={i} className="font-sans text-sm text-muted-foreground flex gap-2">
                  <span className="text-gold-500 dark:text-gold-300 shrink-0">–</span>{item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-10" />

      {/* Fonts quick ref */}
      <section className="mb-10">
        <h2 className="font-sans font-semibold text-base text-muted-foreground uppercase tracking-caps mb-3">Fonts</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-sans text-xs font-semibold text-muted-foreground mb-1">Display / Headlines</p>
            <p className="font-display font-bold text-2xl text-navy-900 dark:text-cream-50">Gill Sans Bold</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">'Gill Sans', 'Gill Sans MT', 'Lato', Calibri</p>
          </div>
          <div>
            <p className="font-sans text-xs font-semibold text-muted-foreground mb-1">Body / Working Type</p>
            <p className="font-sans font-normal text-2xl text-navy-900 dark:text-cream-50">Inter Regular</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">Inter, -apple-system, 'Segoe UI'</p>
          </div>
        </div>
      </section>
    </div>
  )
}
