import { contrastRatio, hexToRgb } from '@/lib/wcag'

export const LOCKED_BRAND_COLOURS = {
  navy: '#14284b',
  white: '#fefefd',
} as const

export const BRAND_CREAM = '#fef7ec'

export interface PlaygroundAccent {
  readonly id: string
  readonly name: string
  readonly sourceHex: string
  readonly note: string
}

// Curated from the centres of the supplied Figma swatches. These are
// experimental source colours, not approved Brand tokens.
export const PLAYGROUND_ACCENTS: readonly PlaygroundAccent[] = [
  { id: 'rose', name: 'Faded rose', sourceHex: '#e49bb0', note: 'Soft editorial warmth' },
  { id: 'coral', name: 'River coral', sourceHex: '#de655c', note: 'Warm calls to action' },
  { id: 'apricot', name: 'Sunlit apricot', sourceHex: '#faa183', note: 'Atmospheric highlights' },
  { id: 'sand', name: 'Punt sand', sourceHex: '#eab895', note: 'Wood and paper warmth' },
  { id: 'butter', name: 'Faded butter', sourceHex: '#feeacd', note: 'Low-intensity glow' },
  { id: 'sage', name: 'Riverside sage', sourceHex: '#a3dca3', note: 'Natural seasonal accent' },
  { id: 'powder', name: 'Water powder', sourceHex: '#a2cddb', note: 'Cool atmospheric lift' },
  { id: 'periwinkle', name: 'Evening periwinkle', sourceHex: '#9cb3e3', note: 'Blue-adjacent expression' },
  { id: 'violet', name: 'Dusk violet', sourceHex: '#a69de2', note: 'Twilight and event moments' },
] as const

const clamp = (value: number, minimum = 0, maximum = 255) => (
  Math.min(maximum, Math.max(minimum, value))
)

function toHexChannel(value: number) {
  return Math.round(clamp(value)).toString(16).padStart(2, '0')
}

export function mixHex(from: string, to: string, amount: number) {
  const safeAmount = clamp(amount, 0, 1)
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
  const start = parse(from)
  const end = parse(to)
  return `#${start.map((channel, index) => (
    toHexChannel(channel + (end[index] - channel) * safeAmount)
  )).join('')}`
}

export function hexToRgba(hex: string, alpha: number) {
  const red = parseInt(hex.slice(1, 3), 16)
  const green = parseInt(hex.slice(3, 5), 16)
  const blue = parseInt(hex.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1).toFixed(3)})`
}

export function getAccent(id: string) {
  return PLAYGROUND_ACCENTS.find((accent) => accent.id === id) ?? PLAYGROUND_ACCENTS[1]
}

export function deriveExpressionBlue(intensity: number) {
  // Move from the Water Powder expression source toward its Deep Navy bridge.
  return mixHex('#a2cddb', '#435e7b', clamp(intensity, 0, 100) / 100)
}

export function deriveAccent(sourceHex: string, intensity: number) {
  const softening = (1 - clamp(intensity, 0, 100) / 100) * 0.48
  return mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, softening)
}

/**
 * Brand Playground accents are exploratory, but text on an action still needs
 * to remain usable. Nudge only the rendered surface toward Off-White until the
 * locked Deep Navy anchor reaches WCAG AA for ordinary text. The source and
 * derived accent values remain available separately for review and export.
 */
export function deriveAccessibleAccentSurface(accent: string) {
  const navy = hexToRgb(LOCKED_BRAND_COLOURS.navy)
  for (let step = 0; step <= 40; step += 1) {
    const candidate = mixHex(accent, LOCKED_BRAND_COLOURS.white, step / 100)
    if (contrastRatio(navy, hexToRgb(candidate)) >= 4.5) return candidate
  }
  return LOCKED_BRAND_COLOURS.white
}

export function deriveCanvas(warmth: number) {
  return mixHex(
    LOCKED_BRAND_COLOURS.white,
    BRAND_CREAM,
    clamp(warmth, 0, 100) / 100,
  )
}

export function deriveExpressionRamp(sourceHex: string) {
  return [
    { step: '50', hex: mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, 0.78) },
    { step: '100', hex: mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, 0.56) },
    { step: '300', hex: mixHex(sourceHex, LOCKED_BRAND_COLOURS.white, 0.28) },
    { step: '500', hex: sourceHex },
    { step: '700', hex: mixHex(sourceHex, LOCKED_BRAND_COLOURS.navy, 0.22) },
  ] as const
}
