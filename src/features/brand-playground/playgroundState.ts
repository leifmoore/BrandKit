import {
  LOCKED_BRAND_COLOURS,
  PLAYGROUND_ACCENTS,
  deriveAccent,
  deriveAccessibleAccentSurface,
  deriveCanvas,
  deriveExpressionBlue,
  getAccent,
  mixHex,
} from './palette'

export const BRAND_PLAYGROUND_VERSION = 1
export const BRAND_PLAYGROUND_DRAFT_KEY = 'scudamores:brand-playground:draft:v1'
export const BRAND_PLAYGROUND_SAVED_KEY = 'scudamores:brand-playground:saved:v1'
export const BRAND_PLAYGROUND_CHANGE_EVENT = 'scudamores:brand-playground-change'

export type PlaygroundPattern = 'booking-hero' | 'product-feature'
export type PlaygroundViewport = 'desktop' | 'mobile'
export type PlaygroundAccentTreatment = 'solid' | 'grainy-gradient'
export type PlaygroundGlassTone = 'navy' | 'white'

export interface BrandPlaygroundConfig {
  readonly version: 1
  readonly pattern: PlaygroundPattern
  readonly viewport: PlaygroundViewport
  readonly applyToBrandWorkspace: boolean
  readonly glassTone: PlaygroundGlassTone
  readonly accentId: string
  readonly accentTreatment: PlaygroundAccentTreatment
  readonly blueIntensity: number
  readonly accentIntensity: number
  readonly accentGradientSpread: number
  readonly accentGrain: number
  readonly canvasWarmth: number
  readonly glassOpacity: number
  readonly glassBlur: number
  readonly gradientStrength: number
  readonly grain: number
}

export interface SavedBrandCandidate {
  readonly id: string
  readonly name: string
  readonly createdAt: string
  readonly config: BrandPlaygroundConfig
}

export const DEFAULT_BRAND_PLAYGROUND_CONFIG: BrandPlaygroundConfig = Object.freeze({
  version: BRAND_PLAYGROUND_VERSION,
  pattern: 'booking-hero',
  viewport: 'desktop',
  applyToBrandWorkspace: false,
  glassTone: 'navy',
  accentId: 'coral',
  accentTreatment: 'solid',
  blueIntensity: 42,
  accentIntensity: 64,
  accentGradientSpread: 48,
  accentGrain: 18,
  canvasWarmth: 58,
  glassOpacity: 82,
  glassBlur: 18,
  gradientStrength: 26,
  grain: 12,
})

const clamp = (value: unknown, fallback: number, minimum: number, maximum: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(maximum, Math.max(minimum, Math.round(value)))
}

export function sanitizeBrandPlaygroundConfig(value: unknown): BrandPlaygroundConfig {
  const candidate = value && typeof value === 'object'
    ? value as Partial<BrandPlaygroundConfig>
    : {}
  const accentId = PLAYGROUND_ACCENTS.some((accent) => accent.id === candidate.accentId)
    ? candidate.accentId as string
    : DEFAULT_BRAND_PLAYGROUND_CONFIG.accentId

  return Object.freeze({
    version: BRAND_PLAYGROUND_VERSION,
    pattern: candidate.pattern === 'product-feature' ? 'product-feature' : 'booking-hero',
    viewport: candidate.viewport === 'mobile' ? 'mobile' : 'desktop',
    applyToBrandWorkspace: candidate.applyToBrandWorkspace === true,
    glassTone: candidate.glassTone === 'white' ? 'white' : 'navy',
    accentId,
    accentTreatment: candidate.accentTreatment === 'grainy-gradient' ? 'grainy-gradient' : 'solid',
    blueIntensity: clamp(candidate.blueIntensity, 42, 0, 100),
    accentIntensity: clamp(candidate.accentIntensity, 64, 0, 100),
    accentGradientSpread: clamp(candidate.accentGradientSpread, 48, 0, 100),
    accentGrain: clamp(candidate.accentGrain, 18, 0, 40),
    canvasWarmth: clamp(candidate.canvasWarmth, 58, 0, 100),
    glassOpacity: clamp(candidate.glassOpacity, 82, 0, 100),
    glassBlur: clamp(candidate.glassBlur, 18, 0, 28),
    gradientStrength: clamp(candidate.gradientStrength, 26, 0, 60),
    grain: clamp(candidate.grain, 12, 0, 40),
  })
}

export function readBrandPlaygroundDraft() {
  if (typeof window === 'undefined') return DEFAULT_BRAND_PLAYGROUND_CONFIG
  try {
    const raw = window.localStorage.getItem(BRAND_PLAYGROUND_DRAFT_KEY)
    return raw ? sanitizeBrandPlaygroundConfig(JSON.parse(raw)) : DEFAULT_BRAND_PLAYGROUND_CONFIG
  } catch {
    return DEFAULT_BRAND_PLAYGROUND_CONFIG
  }
}

export function storeBrandPlaygroundDraft(config: BrandPlaygroundConfig) {
  try {
    window.localStorage.setItem(BRAND_PLAYGROUND_DRAFT_KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent(BRAND_PLAYGROUND_CHANGE_EVENT))
    return true
  } catch {
    return false
  }
}

export function readSavedBrandCandidates(): readonly SavedBrandCandidate[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(BRAND_PLAYGROUND_SAVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, 12).flatMap((entry): SavedBrandCandidate[] => {
      if (!entry || typeof entry !== 'object') return []
      const candidate = entry as Partial<SavedBrandCandidate>
      if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') return []
      return [{
        id: candidate.id,
        name: candidate.name.slice(0, 60),
        createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : '',
        config: sanitizeBrandPlaygroundConfig(candidate.config),
      }]
    })
  } catch {
    return []
  }
}

export function storeSavedBrandCandidates(candidates: readonly SavedBrandCandidate[]) {
  try {
    window.localStorage.setItem(BRAND_PLAYGROUND_SAVED_KEY, JSON.stringify(candidates.slice(0, 12)))
    return true
  } catch {
    return false
  }
}

export function createSavedBrandCandidate(name: string, config: BrandPlaygroundConfig): SavedBrandCandidate {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `candidate-${Date.now()}`
  return Object.freeze({
    id,
    name: name.trim().slice(0, 60) || 'Untitled candidate',
    createdAt: new Date().toISOString(),
    config: sanitizeBrandPlaygroundConfig(config),
  })
}

export function getDerivedBrandPlaygroundTokens(config: BrandPlaygroundConfig) {
  const accent = getAccent(config.accentId)
  const derivedAccent = deriveAccent(accent.sourceHex, config.accentIntensity)
  const accentSurface = deriveAccessibleAccentSurface(derivedAccent)
  const gradientLift = 0.08 + (config.accentGradientSpread / 100) * 0.34
  const accentGradientEnd = mixHex(accentSurface, LOCKED_BRAND_COLOURS.white, gradientLift)
  const accentGrainOpacity = (config.accentGrain / 100).toFixed(2)
  return Object.freeze({
    navy: LOCKED_BRAND_COLOURS.navy,
    white: LOCKED_BRAND_COLOURS.white,
    expressionBlue: deriveExpressionBlue(config.blueIntensity),
    accent: derivedAccent,
    accentSurface,
    accentForeground: LOCKED_BRAND_COLOURS.navy,
    accentGradientEnd,
    accentGradient: `linear-gradient(135deg, ${accentSurface} 0%, ${accentGradientEnd} 100%)`,
    accentGrainTexture: createGrainTexture(config.accentGrain),
    accentGrainOpacity,
    canvas: deriveCanvas(config.canvasWarmth),
    glass: `rgb(20 40 75 / ${(config.glassOpacity / 100).toFixed(2)})`,
    glassBlur: `${config.glassBlur}px`,
    grainOpacity: (config.grain / 100).toFixed(2),
  })
}

function createGrainTexture(amount: number) {
  const opacity = (Math.min(40, Math.max(0, amount)) / 100).toFixed(2)
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' seed='23' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E")`
}

export function createBrandPlaygroundJson(name: string, config: BrandPlaygroundConfig) {
  const accent = getAccent(config.accentId)
  return JSON.stringify({
    kind: 'scudamores-brand-playground-candidate',
    status: 'experimental',
    version: BRAND_PLAYGROUND_VERSION,
    name: name.trim() || 'Current draft',
    lockedAnchors: LOCKED_BRAND_COLOURS,
    sourceAccent: {
      id: accent.id,
      name: accent.name,
      hex: accent.sourceHex,
    },
    settings: config,
    derivedTokens: getDerivedBrandPlaygroundTokens(config),
  }, null, 2)
}

export function createBrandPlaygroundCss(name: string, config: BrandPlaygroundConfig) {
  const tokens = getDerivedBrandPlaygroundTokens(config)
  return `/* ${name.trim() || 'Current draft'}
 * EXPERIMENTAL — exported from the Scudamore’s Brand Playground.
 * Review before promoting any value into a website design system.
 */
:root {
  --brand-navy: ${tokens.navy};
  --brand-white: ${tokens.white};
  --brand-expression-blue: ${tokens.expressionBlue};
  --brand-expression-accent: ${tokens.accent};
  --brand-expression-accent-surface: ${tokens.accentSurface};
  --brand-expression-accent-foreground: ${tokens.accentForeground};
  --brand-expression-accent-gradient: ${tokens.accentGradient};
  --brand-expression-accent-grain: ${tokens.accentGrainTexture};
  --brand-expression-canvas: ${tokens.canvas};
  --brand-glass: ${tokens.glass};
  --brand-glass-blur: ${tokens.glassBlur};
  --brand-grain-opacity: ${tokens.grainOpacity};
}`
}
