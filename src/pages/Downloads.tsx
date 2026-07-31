import { SectionHeader } from '@/components/shared/SectionHeader'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { Separator } from '@/components/ui/separator'
import { DownloadButton } from '@/components/shared/DownloadButton'
import { CopyButton } from '@/components/shared/CopyButton'
import { Card, CardContent } from '@/components/ui/card'
import { PLAYGROUND_ACCENTS, deriveExpressionRamp } from '@/features/brand-playground/palette'

const SUB_NAV = [
  { label: 'Logos', anchor: 'resource-logos' },
  { label: 'Colour Tokens', anchor: 'resource-colour-tokens' },
  { label: 'Typography', anchor: 'resource-typography' },
]

const EXPRESSION_RAMPS = Object.fromEntries(
  PLAYGROUND_ACCENTS.map((accent) => [
    accent.id,
    Object.fromEntries(deriveExpressionRamp(accent.sourceHex).map((tone) => [tone.step, tone.hex])),
  ]),
)

const EXPRESSION_CSS = PLAYGROUND_ACCENTS.flatMap((accent) => (
  deriveExpressionRamp(accent.sourceHex).map((tone) => (
    `  --color-expression-${accent.id}-${tone.step}: ${tone.hex};`
  ))
)).join('\n')

const EXPRESSION_SCSS = PLAYGROUND_ACCENTS.flatMap((accent) => (
  deriveExpressionRamp(accent.sourceHex).map((tone) => (
    `$expression-${accent.id}-${tone.step}: ${tone.hex};`
  ))
)).join('\n')

const CSS_VARIABLES = `/* Scudamore’s Brand Colour Tokens — CSS Custom Properties */
:root {
  /* Navy Ramp */
  --color-navy-1000: #0a1530;
  --color-navy-900:  #14284b;
  --color-navy-700:  #435e7b;
  --color-navy-500:  #7295aa;
  --color-navy-300:  #a2cddb;
  --color-navy-100:  #d5e8ee;
  --color-navy-50:   #eaf3f6;

  /* Cream Ramp */
  --color-cream-50:  #fefefd;
  --color-cream-75:  #fefaf4;
  --color-cream-100: #fef7ec;
  --color-cream-200: #fef2e1;
  --color-cream-300: #feeed7;
  --color-cream-400: #feeacd;

  /* Context-led expression ramps. Use one dominant family per composition. */
${EXPRESSION_CSS}

  /* Solid/gradient treatment remains composition-specific.
     Export a reviewed treatment from the Brand Playground. */
}

/* Font stacks */
.font-display {
  font-family: 'gill-sans-nova', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.font-body {
  font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}`.trim()

const JSON_TOKENS = JSON.stringify({
  color: {
    navy: { 1000: '#0a1530', 900: '#14284b', 700: '#435e7b', 500: '#7295aa', 300: '#a2cddb', 100: '#d5e8ee', 50: '#eaf3f6' },
    cream: { 50: '#fefefd', 75: '#fefaf4', 100: '#fef7ec', 200: '#fef2e1', 300: '#feeed7', 400: '#feeacd' },
    expression: EXPRESSION_RAMPS,
  },
  font: {
    display: '"gill-sans-nova", "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
    body: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
  },
}, null, 2)

const SCSS_VARIABLES = `// Scudamore’s Brand Colour Tokens — SCSS Variables

// Navy Ramp
$navy-1000: #0a1530;
$navy-900:  #14284b;
$navy-700:  #435e7b;
$navy-500:  #7295aa;
$navy-300:  #a2cddb;
$navy-100:  #d5e8ee;
$navy-50:   #eaf3f6;

// Cream Ramp
$cream-50:  #fefefd;
$cream-75:  #fefaf4;
$cream-100: #fef7ec;
$cream-200: #fef2e1;
$cream-300: #feeed7;
$cream-400: #feeacd;

// Context-led expression ramps. Use one dominant family per composition.
${EXPRESSION_SCSS}

// Solid/gradient treatment remains composition-specific.
// Export a reviewed treatment from the Brand Playground.`.trim()

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <Card className="gap-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <CopyButton
          value={code}
          label="Copy"
          accessibleLabel={`Copy ${label}`}
          size="sm"
        />
      </div>
      <pre
        tabIndex={0}
        aria-label={`${label} code`}
        className="max-h-80 overflow-auto bg-card p-4 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {code}
      </pre>
    </Card>
  )
}

export function Downloads() {
  return (
    <div>
      <SectionHeader
        eyebrow="Asset Downloads"
        title="Downloads"
        description="All brand assets in one place. Download logos in SVG format or copy design tokens for your stack."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Logos */}
      <section id="resource-logos" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Logos</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Solid — Deep Navy', file: 'scudamores-logo-navy.svg', src: '/logos/logo-navy.svg', bg: '#fefefd', desc: 'SVG · Light backgrounds' },
            { title: 'White Outline', file: 'scudamores-logo-white.svg', src: '/logos/logo-white.svg', bg: '#14284b', desc: 'SVG · Dark backgrounds' },
            { title: 'Full Colour', file: 'scudamores-logo-full.svg', src: '/logos/logo-full.svg', bg: '#fefefd', desc: 'SVG · Full-colour reproduction' },
          ].map(logo => (
            <Card key={logo.file} className="gap-0 overflow-hidden">
              <div className="h-28 flex items-center justify-center p-4" style={{ backgroundColor: logo.bg }}>
                <img src={logo.src} alt={logo.title} className="h-12 w-auto max-w-full" />
              </div>
              <CardContent className="flex items-start justify-between gap-2 p-4">
                <div>
                  <p className="font-sans font-semibold text-sm text-foreground">{logo.title}</p>
                  <p className="font-sans text-xs text-muted-foreground">{logo.desc}</p>
                </div>
                <DownloadButton
                  href={logo.src}
                  filename={logo.file}
                  accessibleLabel={`Download ${logo.title} SVG`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Colour tokens */}
      <section id="resource-colour-tokens" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Colour Tokens</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Copy the locked Navy and Off-White anchors, supporting ramps, and documented context-led expression ramps in the format that matches your stack. A ramp does not approve a composition; export solid or grainy-gradient treatment settings from the Brand Playground and review them in context.</p>
        <div className="space-y-6">
          <CodeBlock code={CSS_VARIABLES} label="CSS Custom Properties" />
          <CodeBlock code={JSON_TOKENS} label="JSON Tokens" />
          <CodeBlock code={SCSS_VARIABLES} label="SCSS Variables" />
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Typography */}
      <section id="resource-typography" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Typography</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              name: 'Gill Sans Nova',
              note: 'Brand display face. Served through the licensed Adobe Fonts web project; do not copy or self-host Adobe font files.',
              stack: '"gill-sans-nova", "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
              googleLink: 'https://fonts.adobe.com/',
              googleLabel: 'Manage in Adobe Fonts',
            },
            {
              name: 'Instrument Sans',
              note: 'Brand body and software interface face. Bundled in this application through the pinned Fontsource package.',
              stack: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
              googleLink: 'https://fonts.google.com/specimen/Instrument+Sans',
              googleLabel: 'View Instrument Sans',
            },
          ].map(font => (
            <Card key={font.name} className="gap-0">
              <CardContent className="p-5">
                <h3 className="font-sans font-semibold text-base text-foreground mb-1">{font.name}</h3>
                <p className="font-sans text-sm text-muted-foreground mb-3">{font.note}</p>
                <div className="rounded-md bg-muted p-3 mb-3">
                  <p className="font-mono text-xs text-foreground break-all">{font.stack}</p>
                </div>
                <div className="flex gap-2">
                  <CopyButton
                    value={font.stack}
                    label="Copy stack"
                    accessibleLabel={`Copy ${font.name} font stack`}
                    size="sm"
                  />
                  <a
                    href={font.googleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-center font-sans text-xs text-navy-700 underline-offset-2 hover:underline dark:text-navy-100"
                  >
                    {font.googleLabel} ↗
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
