import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight, Clock3, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LOCKED_BRAND_COLOURS, getAccent, hexToRgba } from './palette'
import {
  getDerivedBrandPlaygroundTokens,
  type BrandPlaygroundConfig,
} from './playgroundState'

const GRAIN_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' seed='19' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.62'/%3E%3C/svg%3E")`

function getAccentSurfaceStyle(config: BrandPlaygroundConfig): CSSProperties {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  if (config.accentTreatment === 'solid') {
    return {
      backgroundColor: tokens.accentSurface,
      color: tokens.accentForeground,
    }
  }

  return {
    backgroundColor: tokens.accentSurface,
    backgroundImage: `${tokens.accentGrainTexture}, ${tokens.accentGradient}`,
    backgroundBlendMode: 'soft-light, normal',
    backgroundSize: '140px 140px, 100% 100%',
    color: tokens.accentForeground,
  }
}

function HeroImage({ mobile, className }: { mobile: boolean; className?: string }) {
  if (mobile) {
    return (
      <img
        src="/images/brand/heroes/kings-private-portrait-720.jpg"
        srcSet="/images/brand/heroes/kings-private-portrait-720.jpg 720w, /images/brand/heroes/kings-private-portrait-1080.jpg 1080w"
        sizes="390px"
        alt="A Scudamore’s chauffeur punting customers past King’s College Chapel"
        className={className}
      />
    )
  }

  return (
    <img
      src="/images/brand/heroes/kings-private-landscape-960.jpg"
      srcSet="/images/brand/heroes/kings-private-landscape-960.jpg 960w, /images/brand/heroes/kings-private-landscape-1600.jpg 1600w"
      sizes="(min-width: 1280px) 1100px, 90vw"
      alt="A Scudamore’s chauffeur punting customers past King’s College Chapel"
      className={className}
    />
  )
}

function GlassPanel({
  children,
  config,
  className,
}: {
  children: ReactNode
  config: BrandPlaygroundConfig
  className?: string
}) {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  const lightGlass = config.glassTone === 'white'
  const opacity = config.glassOpacity / 100
  const secondaryOpacity = opacity === 0 ? 0 : Math.min(1, opacity + 0.06)
  const style = lightGlass
    ? {
        background: `linear-gradient(145deg, rgb(254 254 253 / ${opacity.toFixed(2)}), rgb(248 243 227 / ${secondaryOpacity.toFixed(2)}))`,
        color: tokens.navy,
        backdropFilter: `blur(${config.glassBlur}px) saturate(112%)`,
        WebkitBackdropFilter: `blur(${config.glassBlur}px) saturate(112%)`,
        borderColor: 'rgb(20 40 75 / 0.2)',
        boxShadow: '0 24px 70px rgb(10 21 48 / 0.24), inset 0 1px 0 rgb(255 255 255 / 0.72)',
      } as CSSProperties
    : {
        background: `linear-gradient(145deg, ${tokens.glass}, rgb(10 21 48 / ${secondaryOpacity.toFixed(2)}))`,
        color: tokens.white,
        backdropFilter: `blur(${config.glassBlur}px) saturate(118%)`,
        WebkitBackdropFilter: `blur(${config.glassBlur}px) saturate(118%)`,
        borderColor: 'rgb(254 254 253 / 0.28)',
        boxShadow: '0 24px 70px rgb(10 21 48 / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.2)',
      } as CSSProperties

  return (
    <div
      data-brand-glass-panel={config.glassTone}
      className={cn('rounded-2xl border', className)}
      style={style}
    >
      {children}
    </div>
  )
}

function PreviewAtmosphere({ config }: { config: BrandPlaygroundConfig }) {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  const gradientAlpha = config.gradientStrength / 100

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            `radial-gradient(circle at 14% 18%, ${hexToRgba(tokens.accent, gradientAlpha)}, transparent 38%)`,
            `linear-gradient(105deg, ${hexToRgba(LOCKED_BRAND_COLOURS.navy, 0.28)}, transparent 62%)`,
            `linear-gradient(180deg, transparent 48%, ${hexToRgba(LOCKED_BRAND_COLOURS.navy, 0.34)})`,
          ].join(', '),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: GRAIN_TEXTURE,
          backgroundSize: '180px 180px',
          opacity: config.grain / 100,
        }}
      />
    </>
  )
}

function AccentButton({ config, children }: { config: BrandPlaygroundConfig; children: ReactNode }) {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  return (
    <Button
      type="button"
      size="lg"
      className="rounded-full border-0 px-5 shadow-lg transition-transform hover:-translate-y-0.5"
      style={{
        ...getAccentSurfaceStyle(config),
        boxShadow: `0 12px 30px ${hexToRgba(tokens.accentSurface, 0.25)}`,
      }}
    >
      {children}
    </Button>
  )
}

function BookingHero({ config }: { config: BrandPlaygroundConfig }) {
  const mobile = config.viewport === 'mobile'
  const lightGlass = config.glassTone === 'white'
  const accent = getAccent(config.accentId)
  const tokens = getDerivedBrandPlaygroundTokens(config)

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-[#14284b]',
        mobile
          ? 'min-h-[720px] rounded-[1.75rem] xl:min-h-[min(720px,calc(100vh-8rem))]'
          : 'min-h-[620px] rounded-[2rem] xl:min-h-[min(620px,calc(100vh-8rem))]',
      )}
    >
      <HeroImage mobile={mobile} className="absolute inset-0 h-full w-full object-cover" />
      <PreviewAtmosphere config={config} />

      <div className={cn(
        'relative z-10 flex min-h-[inherit] p-4 sm:p-7',
        mobile ? 'items-end' : 'items-center p-10 lg:p-14',
      )}>
        <GlassPanel
          config={config}
          className={cn('p-6 sm:p-8', mobile ? 'w-full' : 'max-w-[34rem] p-10')}
        >
          <img
            src={lightGlass ? '/logos/logo-navy.svg' : '/logos/logo-white.svg'}
            alt="Scudamore’s"
            className="mb-7 h-10 w-auto"
          />
          <p className={cn(
            'font-sans text-xs font-semibold uppercase tracking-[0.16em]',
            lightGlass ? 'text-navy-700' : 'text-navy-100',
          )}>
            Private punting · Cambridge
          </p>
          <h2 className={cn(
            'mt-3 font-display font-bold leading-[0.98] tracking-display',
            mobile ? 'text-4xl' : 'text-5xl lg:text-6xl',
          )}>
            See Cambridge from the Cam.
          </h2>
          <p className={cn(
            'mt-5 max-w-md font-sans text-sm leading-6 sm:text-base sm:leading-7',
            lightGlass ? 'text-navy-700' : 'text-navy-50',
          )}>
            A private chauffeured tour through the College Backs, shaped around your pace and the best light on the river.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <AccentButton config={config}>
              Book a private tour <ArrowRight aria-hidden="true" />
            </AccentButton>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className={cn(
                'rounded-full',
                lightGlass
                  ? 'border-navy-900/25 bg-white/40 text-navy-900 hover:bg-white/65 hover:text-navy-900'
                  : 'border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white',
              )}
            >
              Explore tours
            </Button>
          </div>
          <p className={cn('mt-5 font-sans text-xs', lightGlass ? 'text-navy-700' : 'text-navy-100')}>
            Experimental accent: {accent.name} · {tokens.accent}
          </p>
        </GlassPanel>
      </div>
    </div>
  )
}

function ProductFeature({ config }: { config: BrandPlaygroundConfig }) {
  const mobile = config.viewport === 'mobile'
  const lightGlass = config.glassTone === 'white'

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-[#14284b]',
        mobile
          ? 'min-h-[720px] rounded-[1.75rem] xl:min-h-[min(720px,calc(100vh-8rem))]'
          : 'min-h-[620px] rounded-[2rem] xl:min-h-[min(620px,calc(100vh-8rem))]',
      )}
    >
      <HeroImage mobile={mobile} className="absolute inset-0 h-full w-full object-cover" />
      <PreviewAtmosphere config={config} />

      <div className={cn(
        'relative z-10 flex min-h-[inherit] p-4 sm:p-7',
        mobile ? 'items-end' : 'items-end justify-end p-10 lg:p-14',
      )}>
        <GlassPanel
          config={config}
          className={cn('p-6 sm:p-8', mobile ? 'w-full' : 'w-full max-w-[31rem] p-9')}
        >
          <div className="flex items-center justify-between gap-3">
            <p className={cn(
              'font-sans text-xs font-semibold uppercase tracking-[0.16em]',
              lightGlass ? 'text-navy-700' : 'text-navy-100',
            )}>
              Private tour
            </p>
            <span
              className="rounded-full px-3 py-1 font-sans text-xs font-semibold"
              style={getAccentSurfaceStyle(config)}
            >
              Most flexible
            </span>
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold leading-none tracking-display sm:text-5xl">
            Private College Backs Tour
          </h2>
          <p className={cn(
            'mt-4 font-sans text-sm leading-6 sm:text-base sm:leading-7',
            lightGlass ? 'text-navy-700' : 'text-navy-50',
          )}>
            Your own punt and chauffeur, with time to pause for the stories and views that matter to you.
          </p>
          <div className={cn(
            'mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y py-4 font-sans text-sm',
            lightGlass ? 'border-navy-900/15 text-navy-700' : 'border-white/20 text-navy-50',
          )}>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4" aria-hidden="true" /> 50 minutes</span>
            <span className="inline-flex items-center gap-2"><Users className="size-4" aria-hidden="true" /> Up to 12 guests</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className={cn('font-sans text-sm', lightGlass ? 'text-navy-700' : 'text-navy-100')}>
              From <strong className={cn('text-xl', lightGlass ? 'text-navy-900' : 'text-white')}>£120</strong> per punt
            </p>
            <AccentButton config={config}>
              View private tours <ArrowRight aria-hidden="true" />
            </AccentButton>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}

export function BrandPreview({ config }: { config: BrandPlaygroundConfig }) {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  const mobile = config.viewport === 'mobile'

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-border p-3 sm:p-5"
      style={{ backgroundColor: tokens.canvas }}
    >
      <div
        className={cn('mx-auto transition-[width] duration-300', mobile ? 'w-[390px] max-w-full' : 'w-full')}
        data-brand-preview-pattern={config.pattern}
        data-brand-preview-viewport={config.viewport}
        data-brand-accent-treatment={config.accentTreatment}
        data-brand-glass-tone={config.glassTone}
      >
        {config.pattern === 'product-feature'
          ? <ProductFeature config={config} />
          : <BookingHero config={config} />}
      </div>
    </div>
  )
}
