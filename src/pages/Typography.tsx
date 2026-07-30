import { useState } from 'react'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { TYPE_SCALE } from '@/lib/tokens'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Fonts', anchor: 'fonts' },
  { label: 'Type Scale', anchor: 'type-scale' },
  { label: 'Live Preview', anchor: 'live-preview' },
  { label: 'Rules', anchor: 'rules' },
]

export function Typography() {
  const [previewText, setPreviewText] = useState('Where Cambridge goes punting.')

  return (
    <div>
      <SectionHeader
        eyebrow="Brand Typography"
        title="Typography"
        description="Two typefaces carry the brand. Gill Sans Bold brings the heritage warmth. Inter brings the modern clarity. Together: 1910, still alive today."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Fonts */}
      <section id="fonts" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Fonts</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Gill Sans */}
          <div className="rounded-xl border border-border p-6 space-y-4">
            <div>
              <p className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-caps mb-1">Display / Headlines</p>
              <p className="font-display font-bold text-5xl text-navy-900 dark:text-cream-50 tracking-display">Aa</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-navy-900 dark:text-cream-50">Gill Sans</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Headlines, display, brand name, pull quotes. Humanist warmth — carries the heritage character. Bold weight primary.
              </p>
            </div>
            <div className="font-display text-sm text-navy-700 dark:text-cream-300 space-y-1">
              <p className="font-bold">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-bold">abcdefghijklmnopqrstuvwxyz</p>
              <p className="font-bold">0123456789 £ & — …</p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="font-sans text-xs text-muted-foreground">
                <strong>Web stack:</strong>{' '}
                <code className="font-mono text-xs">'Gill Sans', 'Gill Sans MT', 'Lato', Calibri, 'Trebuchet MS', sans-serif</code>
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                Mac users get native Gill Sans. Windows/Linux get Lato (Google Fonts) as the closest free alternative.
              </p>
            </div>
          </div>

          {/* Inter */}
          <div className="rounded-xl border border-border p-6 space-y-4">
            <div>
              <p className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-caps mb-1">Body / Working Type</p>
              <p className="font-sans font-normal text-5xl text-navy-900 dark:text-cream-50">Aa</p>
            </div>
            <div>
              <p className="font-sans font-semibold text-xl text-navy-900 dark:text-cream-50">Inter</p>
              <p className="font-sans text-sm text-muted-foreground mt-1">
                Subheads, body, UI, captions. Contemporary neo-grotesque — excellent on-screen legibility. Free, open-source.
              </p>
            </div>
            <div className="font-sans text-sm text-navy-700 dark:text-cream-300 space-y-1">
              <p className="font-normal">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-normal">abcdefghijklmnopqrstuvwxyz</p>
              <p className="font-normal">0123456789 £ & — …</p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="font-sans text-xs text-muted-foreground">
                <strong>Web stack:</strong>{' '}
                <code className="font-mono text-xs">Inter, -apple-system, 'Segoe UI', sans-serif</code>
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                Loaded from Google Fonts. Free to use across web, Canva, Figma, and Office.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Type Scale */}
      <section id="type-scale" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Type Scale</h2>
        <div className="space-y-0 divide-y divide-border rounded-xl border border-border overflow-hidden">
          {TYPE_SCALE.map((style) => (
            <div key={style.level} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-muted/40 transition-colors">
              <div className="sm:w-40 shrink-0">
                <p className="font-sans text-xs font-medium text-muted-foreground">{style.level}</p>
                <p className="font-mono text-xs text-muted-foreground">{style.description}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(style.twClasses, 'text-navy-900 dark:text-cream-50 truncate')}
                  style={{ fontSize: style.size, letterSpacing: style.tracking, lineHeight: style.lineHeight }}
                >
                  Where Cambridge goes punting.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Live Preview */}
      <section id="live-preview" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Live Preview</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Type below to preview your copy in all brand type styles at once.</p>
        <Input
          aria-label="Typography preview text"
          value={previewText}
          onChange={e => setPreviewText(e.target.value)}
          placeholder="Type something…"
          className="mb-8 font-sans text-base"
        />
        <div className="space-y-8 divide-y divide-border">
          {TYPE_SCALE.map((style) => (
            <div key={style.level} className="pt-6 first:pt-0">
              <p className="font-sans text-xs font-medium text-muted-foreground mb-2">{style.level}</p>
              <p
                className={cn(style.twClasses, 'text-navy-900 dark:text-cream-50')}
                style={{ fontSize: style.size, letterSpacing: style.tracking, lineHeight: style.lineHeight }}
              >
                {previewText || 'Start typing above…'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Rules */}
      <section id="rules" className="scroll-mt-6 mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Rules</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Casing',
              rules: [
                'Sentence case is the default — headings, subheads, body copy.',
                'ALL CAPS reserved for: brand name "SCUDAMORE\'S", eyebrow labels, section dividers.',
                'Title Case avoided for headings — feels corporate. Fine for proper nouns and named tours.',
              ],
            },
            {
              title: 'Tracking (Letter-spacing)',
              rules: [
                'Hero / display (40pt+): −2% tracking. Makes headlines feel confident.',
                'Mid display (24–40pt): −1% tracking.',
                'Body, UI, subheads: 0 — use defaults.',
                'Caps (brand name, eyebrows, dividers): +15%. Prevents letterrun-together.',
              ],
            },
            {
              title: 'Numerals',
              rules: [
                'Tabular (monospaced) figures for prices, tables, dates, times, booking refs.',
                'Proportional figures (default) for numbers inline in prose.',
                'Spell out one to nine in prose; numerals from 10 onward.',
                'Always numerals for ages, prices, times, dates, percentages.',
              ],
            },
            {
              title: 'Links',
              rules: [
                'Inline links: Lantern Gold (#c9a24a), no underline at rest, underline on hover.',
                'On dark backgrounds: Honey (#e3c277) for contrast.',
                'Visited links: Brass (#9c7a2f), same underline behaviour.',
                'Never rely on colour alone — ensure underline or other visual cue is present.',
              ],
            },
            {
              title: 'Punctuation',
              rules: [
                'Em dashes (—) with spaces — like this — used freely. Warmer than parentheses.',
                'Always curly/smart quotes — never straight ones.',
                'Brand apostrophe: always "Scudamore\'s" (curly), never straight.',
                'Ellipses: single character (…), not three dots (...).',
              ],
            },
            {
              title: 'British English',
              rules: [
                'colour, organisation, harbour, recognise, towards, whilst',
                'Oxford comma optional — consistency within a piece matters more.',
                'Non-breaking space between number and unit: 25 mm, 90 px, £25.',
              ],
            },
          ].map(group => (
            <div key={group.title} className="rounded-xl border border-border p-5">
              <h3 className="font-sans font-semibold text-base text-foreground mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.rules.map((rule, i) => (
                  <li key={i} className="font-sans text-sm text-navy-700 dark:text-cream-300 flex gap-2">
                    <span className="text-accent shrink-0 mt-0.5">–</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
