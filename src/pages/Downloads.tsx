import { SectionHeader } from '@/components/shared/SectionHeader'
import { Separator } from '@/components/ui/separator'
import { DownloadButton } from '@/components/shared/DownloadButton'
import { CopyButton } from '@/components/shared/CopyButton'

const CSS_VARIABLES = `/* Scudamore's Brand Colour Tokens — CSS Custom Properties */
:root {
  /* Navy Ramp */
  --color-navy-1000: #0a1530;
  --color-navy-900:  #14284b;
  --color-navy-700:  #26467d;
  --color-navy-500:  #3d68b0;
  --color-navy-300:  #7e9bd5;
  --color-navy-100:  #c2d0ec;
  --color-navy-50:   #e7edf8;

  /* Cream Ramp */
  --color-cream-50:  #fefefd;
  --color-cream-75:  #fcfaf3;
  --color-cream-100: #f8f3e3;
  --color-cream-200: #f0e8cf;
  --color-cream-300: #e6d9b3;
  --color-cream-400: #d4c8a6;

  /* Gold Accent */
  --color-gold-300: #e3c277;
  --color-gold-500: #c9a24a;
  --color-gold-700: #9c7a2f;
}

/* Font stacks */
.font-display {
  font-family: 'Gill Sans', 'Gill Sans MT', 'Lato', Calibri, 'Trebuchet MS', sans-serif;
}
.font-body {
  font-family: Inter, -apple-system, 'Segoe UI', sans-serif;
}`.trim()

const JSON_TOKENS = JSON.stringify({
  color: {
    navy: { 1000: '#0a1530', 900: '#14284b', 700: '#26467d', 500: '#3d68b0', 300: '#7e9bd5', 100: '#c2d0ec', 50: '#e7edf8' },
    cream: { 50: '#fefefd', 75: '#fcfaf3', 100: '#f8f3e3', 200: '#f0e8cf', 300: '#e6d9b3', 400: '#d4c8a6' },
    gold: { 300: '#e3c277', 500: '#c9a24a', 700: '#9c7a2f' },
  },
  font: {
    display: '"Gill Sans", "Gill Sans MT", "Lato", Calibri, "Trebuchet MS", sans-serif',
    body: 'Inter, -apple-system, "Segoe UI", sans-serif',
  },
}, null, 2)

const SCSS_VARIABLES = `// Scudamore's Brand Colour Tokens — SCSS Variables

// Navy Ramp
$navy-1000: #0a1530;
$navy-900:  #14284b;
$navy-700:  #26467d;
$navy-500:  #3d68b0;
$navy-300:  #7e9bd5;
$navy-100:  #c2d0ec;
$navy-50:   #e7edf8;

// Cream Ramp
$cream-50:  #fefefd;
$cream-75:  #fcfaf3;
$cream-100: #f8f3e3;
$cream-200: #f0e8cf;
$cream-300: #e6d9b3;
$cream-400: #d4c8a6;

// Gold Accent
$gold-300: #e3c277;
$gold-500: #c9a24a;
$gold-700: #9c7a2f;`.trim()

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
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
        className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {code}
      </pre>
    </div>
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

      {/* Logos */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">Logos</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Solid — Deep Navy', file: 'scudamores-logo-navy.svg', src: '/logos/logo-navy.svg', bg: '#fefefd', desc: 'SVG · Light backgrounds' },
            { title: 'White Outline', file: 'scudamores-logo-white.svg', src: '/logos/logo-white.svg', bg: '#14284b', desc: 'SVG · Dark backgrounds' },
            { title: 'Full Colour', file: 'scudamores-logo-full.svg', src: '/logos/logo-full.svg', bg: '#fefefd', desc: 'SVG · Full-colour reproduction' },
          ].map(logo => (
            <div key={logo.file} className="rounded-xl border border-border overflow-hidden">
              <div className="h-28 flex items-center justify-center p-4" style={{ backgroundColor: logo.bg }}>
                <img src={logo.src} alt={logo.title} className="h-12 w-auto max-w-full" />
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-sans font-semibold text-sm text-foreground">{logo.title}</p>
                  <p className="font-sans text-xs text-muted-foreground">{logo.desc}</p>
                </div>
                <DownloadButton
                  href={logo.src}
                  filename={logo.file}
                  accessibleLabel={`Download ${logo.title} SVG`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Colour tokens */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Colour Tokens</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Copy the token format that matches your stack — CSS custom properties, JSON, or SCSS variables.</p>
        <div className="space-y-6">
          <CodeBlock code={CSS_VARIABLES} label="CSS Custom Properties" />
          <CodeBlock code={JSON_TOKENS} label="JSON Tokens" />
          <CodeBlock code={SCSS_VARIABLES} label="SCSS Variables" />
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Typography */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Typography</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              name: 'Gill Sans',
              note: 'System font on macOS. For web, Lato (Google Fonts) is the closest free alternative.',
              stack: '"Gill Sans", "Gill Sans MT", "Lato", Calibri, "Trebuchet MS", sans-serif',
              googleLink: 'https://fonts.google.com/specimen/Lato',
              googleLabel: 'Get Lato (free web fallback)',
            },
            {
              name: 'Inter',
              note: 'Free, open-source via Google Fonts. Use across web, Canva, Figma, and Office.',
              stack: 'Inter, -apple-system, "Segoe UI", sans-serif',
              googleLink: 'https://fonts.google.com/specimen/Inter',
              googleLabel: 'Get Inter from Google Fonts',
            },
          ].map(font => (
            <div key={font.name} className="rounded-xl border border-border p-5">
              <p className="font-sans font-semibold text-base text-foreground mb-1">{font.name}</p>
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
                  className="font-sans text-xs text-navy-700 dark:text-gold-300 hover:underline self-center"
                >
                  {font.googleLabel} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
