import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { ClearSpaceVis } from '@/components/logo/ClearSpaceVis'
import { DownloadButton } from '@/components/shared/DownloadButton'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Variants', anchor: 'variants' },
  { label: 'Clear Space', anchor: 'clear-space' },
  { label: "Do's & Don'ts", anchor: 'dos-donts' },
  { label: 'Downloads', anchor: 'downloads' },
]

interface LogoVariantProps {
  src: string
  alt: string
  title: string
  usage: string
  bg: string
  dark?: boolean
  filename: string
}

function LogoVariant({ src, alt, title, usage, bg, dark, filename }: LogoVariantProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn('rounded-xl p-8 flex items-center justify-center border border-black/10 h-40', dark && 'border-white/10')}
        style={{ backgroundColor: bg }}
      >
        <img src={src} alt={alt} className="h-16 w-auto max-w-full" />
      </div>
      <div>
        <p className="font-sans font-semibold text-sm text-foreground">{title}</p>
        <p className="mb-2 mt-0.5 font-sans text-xs text-muted-foreground">{usage}</p>
        <DownloadButton
          href={src}
          filename={filename}
          label="Download SVG"
          accessibleLabel={`Download ${title} SVG`}
        />
      </div>
    </div>
  )
}

interface DontCardProps {
  title: string
  description: string
  style?: React.CSSProperties
  logoStyle?: React.CSSProperties
}

function DontCard({ title, description, style, logoStyle }: DontCardProps) {
  return (
    <div className="border border-red-200 dark:border-red-900 rounded-xl overflow-hidden">
      <div className="h-28 flex items-center justify-center bg-cream-50 dark:bg-navy-700 relative" style={style}>
        <img src="/logos/logo-navy.svg" alt={`Incorrect Scudamore’s logo example: ${title}`} className="h-12 w-auto dark:hidden" style={logoStyle} />
        <img src="/logos/logo-white.svg" alt={`Incorrect Scudamore’s logo example: ${title}`} className="hidden h-12 w-auto dark:block" style={logoStyle} />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-sans font-medium px-2 py-0.5 rounded">✗ Don't</div>
      </div>
      <div className="p-3 bg-red-50 dark:bg-red-950">
        <p className="font-sans font-medium text-xs text-red-700 dark:text-red-400">{title}</p>
        <p className="font-sans text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export function Logo() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Logo"
        title="Logo & Usage"
        description="Two primary logo variations — solid Deep Navy for light backgrounds, and a white outline for dark or photographic backgrounds. Use consistently and within the defined rules."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Variants */}
      <section id="variants" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Logo Variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <LogoVariant
            src="/logos/logo-navy.svg"
            alt="Scudamore’s logo — solid navy"
            title="Solid — Deep Navy"
            usage="White, off-white, and light cream backgrounds. The primary logo for most use cases."
            bg="#fefefd"
            filename="scudamores-logo-navy.svg"
          />
          <LogoVariant
            src="/logos/logo-white.svg"
            alt="Scudamore’s logo — white outline"
            title="White Outline"
            usage="Navy and dark backgrounds, over photography. Never on light backgrounds."
            bg="#14284b"
            dark
            filename="scudamores-logo-white.svg"
          />
          <LogoVariant
            src="/logos/logo-full.svg"
            alt="Scudamore’s logo — full colour"
            title="Full Colour"
            usage="When full-colour reproduction is available and appropriate. Light backgrounds only."
            bg="#fefefd"
            filename="scudamores-logo-full.svg"
          />
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Clear Space */}
      <section id="clear-space" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Clear Space</h2>
        <p className="mb-6 font-sans text-sm text-muted-foreground">
          Maintain a minimum zone of unobstructed space around the logo at all times. This clear space is defined as a fraction of the logo's height.
        </p>
        <ClearSpaceVis />
      </section>

      <Separator className="mb-14" />

      {/* Do's & Don'ts */}
      <section id="dos-donts" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Do's & Don'ts</h2>

        <div className="mb-6">
          <div className="border border-green-200 dark:border-green-900 rounded-xl overflow-hidden">
            <div className="h-28 flex items-center justify-center bg-cream-50 dark:bg-navy-700">
              <img src="/logos/logo-navy.svg" alt="Correct Scudamore’s logo use on an approved background" className="h-12 w-auto dark:hidden" />
              <img src="/logos/logo-white.svg" alt="Correct Scudamore’s logo use on an approved background" className="hidden h-12 w-auto dark:block" />
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950">
              <p className="font-sans font-medium text-xs text-green-700 dark:text-green-400">✓ Do — use the approved colour on an appropriate background</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <DontCard
            title="Don't recolour"
            description="Use only the supplied Solid Deep Navy, White Outline, or Full Colour artwork"
            logoStyle={{ filter: 'hue-rotate(120deg)' }}
          />
          <DontCard
            title="Don't stretch or skew"
            description="Always maintain the original proportions"
            logoStyle={{ transform: 'scaleX(1.4)' }}
          />
          <DontCard
            title="Don't rotate"
            description="The logo is always presented horizontally"
            logoStyle={{ transform: 'rotate(-15deg)' }}
          />
          <DontCard
            title="Don't add effects"
            description="No drop shadows, glows, gradients, or outlines"
            logoStyle={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.6))' }}
          />
          <DontCard
            title="Don't place on busy photography"
            description="Use the white outline version on photographic backgrounds"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #2d6a4f 0px, #2d6a4f 10px, #5ba4cf 10px, #5ba4cf 20px)' }}
          />
          <DontCard
            title="Don't reproduce below minimum size"
            description="90px digital / 25mm print minimum width"
            logoStyle={{ height: '18px' }}
          />
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Downloads */}
      <section id="downloads" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Downloads</h2>
        <GuidanceTable label="Approved logo downloads" tableClassName="min-w-[42rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">File</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Format</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Use for</th>
                <th scope="col" aria-label="Download" className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: 'Logo — Solid Navy', file: 'scudamores-logo-navy.svg', src: '/logos/logo-navy.svg', format: 'SVG', use: 'Web, print, light backgrounds' },
                { name: 'Logo — White Outline', file: 'scudamores-logo-white.svg', src: '/logos/logo-white.svg', format: 'SVG', use: 'Dark backgrounds, photography overlays' },
                { name: 'Logo — Full Colour', file: 'scudamores-logo-full.svg', src: '/logos/logo-full.svg', format: 'SVG', use: 'Full colour reproduction' },
              ].map(row => (
                <tr key={row.file} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{row.format}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.use}</td>
                  <td className="px-4 py-3 text-right">
                    <DownloadButton
                      href={row.src}
                      filename={row.file}
                      accessibleLabel={`Download ${row.name} SVG`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>
      </section>
    </div>
  )
}
