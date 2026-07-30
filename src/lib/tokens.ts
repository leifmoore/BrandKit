export interface ColorToken {
  name: string
  alias: string
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  cmyk: { c: number; m: number; y: number; k: number }
  cssVar: string
  twBg: string
  twText: string
  description?: string
}

export interface MoodPalette {
  name: string
  description: string
  bg: string
  tokens: ColorToken[]
  example: string
}

export interface TypeStyle {
  level: string
  font: 'display' | 'sans'
  weight: string
  size: string
  tracking: string
  lineHeight: string
  twClasses: string
  description?: string
}

// ── Color Tokens ──────────────────────────────────────────────────────────────

export const NAVY_RAMP: ColorToken[] = [
  {
    name: 'Midnight',
    alias: 'navy-1000',
    hex: '#0a1530',
    rgb: { r: 10, g: 21, b: 48 },
    hsl: { h: 223, s: 66, l: 11 },
    cmyk: { c: 79, m: 56, y: 0, k: 81 },
    cssVar: '--color-navy-1000',
    twBg: 'bg-navy-1000',
    twText: 'text-navy-1000',
    description: 'Deepest shade — Bat Safari, Fireworks, night backgrounds',
  },
  {
    name: 'Deep Navy',
    alias: 'navy-900',
    hex: '#14284b',
    rgb: { r: 20, g: 40, b: 75 },
    hsl: { h: 218, s: 58, l: 19 },
    cmyk: { c: 73, m: 47, y: 0, k: 71 },
    cssVar: '--color-navy-900',
    twBg: 'bg-navy-900',
    twText: 'text-navy-900',
    description: 'Primary brand colour — use for text, hero backgrounds, logo',
  },
  {
    name: 'Dusk',
    alias: 'navy-700',
    hex: '#26467d',
    rgb: { r: 38, g: 70, b: 125 },
    hsl: { h: 218, s: 53, l: 32 },
    cmyk: { c: 70, m: 44, y: 0, k: 51 },
    cssVar: '--color-navy-700',
    twBg: 'bg-navy-700',
    twText: 'text-navy-700',
    description: 'Secondary blue — subheadings on dark, card backgrounds in dark mode',
  },
  {
    name: 'Cam Blue',
    alias: 'navy-500',
    hex: '#3d68b0',
    rgb: { r: 61, g: 104, b: 176 },
    hsl: { h: 218, s: 48, l: 47 },
    cmyk: { c: 65, m: 41, y: 0, k: 31 },
    cssVar: '--color-navy-500',
    twBg: 'bg-navy-500',
    twText: 'text-navy-500',
    description: 'Mid blue — links on light bg (near threshold; prefer Deep Navy for body)',
  },
  {
    name: 'Sky',
    alias: 'navy-300',
    hex: '#7e9bd5',
    rgb: { r: 126, g: 155, b: 213 },
    hsl: { h: 220, s: 51, l: 67 },
    cmyk: { c: 41, m: 27, y: 0, k: 16 },
    cssVar: '--color-navy-300',
    twBg: 'bg-navy-300',
    twText: 'text-navy-300',
    description: 'Light blue — subheadings on dark backgrounds (large text only)',
  },
  {
    name: 'Mist',
    alias: 'navy-100',
    hex: '#c2d0ec',
    rgb: { r: 194, g: 208, b: 236 },
    hsl: { h: 220, s: 52, l: 84 },
    cmyk: { c: 18, m: 12, y: 0, k: 7 },
    cssVar: '--color-navy-100',
    twBg: 'bg-navy-100',
    twText: 'text-navy-100',
    description: 'Very light blue — decorative, chart gridlines, subtle borders',
  },
  {
    name: 'Vapour',
    alias: 'navy-50',
    hex: '#e7edf8',
    rgb: { r: 231, g: 237, b: 248 },
    hsl: { h: 219, s: 56, l: 94 },
    cmyk: { c: 7, m: 4, y: 0, k: 3 },
    cssVar: '--color-navy-50',
    twBg: 'bg-navy-50',
    twText: 'text-navy-50',
    description: 'Near-white blue tint — hover states, subtle section backgrounds',
  },
]

export const CREAM_RAMP: ColorToken[] = [
  {
    name: 'Off-White',
    alias: 'cream-50',
    hex: '#fefefd',
    rgb: { r: 254, g: 254, b: 253 },
    hsl: { h: 60, s: 33, l: 99 },
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
    cssVar: '--color-cream-50',
    twBg: 'bg-cream-50',
    twText: 'text-cream-50',
    description: 'Primary light — backgrounds, logo on dark, body text on dark',
  },
  {
    name: 'Vellum',
    alias: 'cream-75',
    hex: '#fcfaf3',
    rgb: { r: 252, g: 250, b: 243 },
    hsl: { h: 46, s: 59, l: 97 },
    cmyk: { c: 0, m: 1, y: 4, k: 1 },
    cssVar: '--color-cream-75',
    twBg: 'bg-cream-75',
    twText: 'text-cream-75',
    description: 'Card backgrounds in light mode',
  },
  {
    name: 'Cream',
    alias: 'cream-100',
    hex: '#f8f3e3',
    rgb: { r: 248, g: 243, b: 227 },
    hsl: { h: 46, s: 61, l: 93 },
    cmyk: { c: 0, m: 2, y: 8, k: 3 },
    cssVar: '--color-cream-100',
    twBg: 'bg-cream-100',
    twText: 'text-cream-100',
    description: 'Page background in light mode — warm, paper-like',
  },
  {
    name: 'Ivory',
    alias: 'cream-200',
    hex: '#f0e8cf',
    rgb: { r: 240, g: 232, b: 207 },
    hsl: { h: 46, s: 52, l: 88 },
    cmyk: { c: 0, m: 3, y: 14, k: 6 },
    cssVar: '--color-cream-200',
    twBg: 'bg-cream-200',
    twText: 'text-cream-200',
    description: 'Muted backgrounds, divider zones',
  },
  {
    name: 'Parchment',
    alias: 'cream-300',
    hex: '#e6d9b3',
    rgb: { r: 230, g: 217, b: 179 },
    hsl: { h: 45, s: 51, l: 80 },
    cmyk: { c: 0, m: 6, y: 22, k: 10 },
    cssVar: '--color-cream-300',
    twBg: 'bg-cream-300',
    twText: 'text-cream-300',
    description: 'Borders, input borders in light mode',
  },
  {
    name: 'Stone',
    alias: 'cream-400',
    hex: '#d4c8a6',
    rgb: { r: 212, g: 200, b: 166 },
    hsl: { h: 44, s: 35, l: 74 },
    cmyk: { c: 0, m: 6, y: 22, k: 17 },
    cssVar: '--color-cream-400',
    twBg: 'bg-cream-400',
    twText: 'text-cream-400',
    description: 'Decorative — Wedding & private hire mood palette',
  },
]

export const GOLD_RAMP: ColorToken[] = [
  {
    name: 'Honey',
    alias: 'gold-300',
    hex: '#e3c277',
    rgb: { r: 227, g: 194, b: 119 },
    hsl: { h: 42, s: 66, l: 68 },
    cmyk: { c: 0, m: 15, y: 48, k: 11 },
    cssVar: '--color-gold-300',
    twBg: 'bg-gold-300',
    twText: 'text-gold-300',
    description: 'Accent on dark backgrounds — links, highlights on navy',
  },
  {
    name: 'Lantern Gold',
    alias: 'gold-500',
    hex: '#c9a24a',
    rgb: { r: 201, g: 162, b: 74 },
    hsl: { h: 42, s: 54, l: 54 },
    cmyk: { c: 0, m: 19, y: 63, k: 21 },
    cssVar: '--color-gold-500',
    twBg: 'bg-gold-500',
    twText: 'text-gold-500',
    description: 'Primary accent — CTAs, links on light bg, interactive states',
  },
  {
    name: 'Brass',
    alias: 'gold-700',
    hex: '#9c7a2f',
    rgb: { r: 156, g: 122, b: 47 },
    hsl: { h: 41, s: 54, l: 40 },
    cmyk: { c: 0, m: 22, y: 70, k: 39 },
    cssVar: '--color-gold-700',
    twBg: 'bg-gold-700',
    twText: 'text-gold-700',
    description: 'Deep gold — visited links, Wedding palette, Heritage moments',
  },
]

export const PRIMARY_TOKENS: ColorToken[] = [
  NAVY_RAMP[1], // Deep Navy
  CREAM_RAMP[0], // Off-White
]

export const ALL_TOKENS: ColorToken[] = [...NAVY_RAMP, ...CREAM_RAMP, ...GOLD_RAMP]

// ── WCAG approved / forbidden pairs ─────────────────────────────────────────

export const WCAG_APPROVED = [
  { fg: 'cream-50',  bg: 'navy-1000', level: 'AAA', note: 'Body text' },
  { fg: 'cream-50',  bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'cream-50',  bg: 'navy-700',  level: 'AAA', note: 'Body text' },
  { fg: 'cream-75',  bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'cream-100', bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-50',   bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'gold-300',  bg: 'navy-1000', level: 'AAA', note: 'Body text' },
  { fg: 'gold-300',  bg: 'navy-900',  level: 'AA',  note: 'Body text' },
  { fg: 'navy-900',  bg: 'cream-50',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-900',  bg: 'cream-300', level: 'AAA', note: 'Body text' },
  { fg: 'navy-900',  bg: 'gold-300',  level: 'AA',  note: 'Body text' },
  { fg: 'navy-700',  bg: 'cream-50',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-500',  bg: 'cream-50',  level: 'AA',  note: 'Near threshold — prefer Deep Navy for body' },
  { fg: 'navy-300',  bg: 'navy-900',  level: 'AA',  note: 'Large text / subheadings only' },
  { fg: 'gold-700',  bg: 'cream-50',  level: 'AA',  note: 'Large text only (18pt+)' },
] as const

export const WCAG_FORBIDDEN = [
  { fg: 'navy-300', bg: 'navy-100', reason: 'Insufficient contrast' },
  { fg: 'navy-100', bg: 'cream-50', reason: 'Insufficient contrast' },
  { fg: 'navy-500', bg: 'navy-300', reason: 'Insufficient contrast' },
  { fg: 'gold-300', bg: 'cream-100', reason: 'Insufficient contrast' },
  { fg: 'gold-500', bg: 'gold-300', reason: 'Insufficient contrast' },
  { fg: 'gold-500', bg: 'cream-400', reason: 'Insufficient contrast' },
  { fg: 'navy-700', bg: 'gold-500', reason: 'Large text only at this ratio' },
] as const

// ── Mood Palettes ────────────────────────────────────────────────────────────

export const MOOD_PALETTES: MoodPalette[] = [
  {
    name: 'Day Tours',
    description: "The master palette — classic Scudamore's on a bright Cambridge afternoon.",
    bg: '#fefefd',
    tokens: [CREAM_RAMP[0], NAVY_RAMP[1], GOLD_RAMP[1]],
    example: 'Off-White background · Deep Navy text · Lantern Gold CTAs',
  },
  {
    name: 'Fireworks',
    description: 'Dramatic evening atmosphere — rich navy depth with golden warmth.',
    bg: '#14284b',
    tokens: [NAVY_RAMP[0], NAVY_RAMP[1], GOLD_RAMP[0], GOLD_RAMP[1]],
    example: 'Midnight / Deep Navy background · Honey & Lantern Gold accents',
  },
  {
    name: 'Weddings',
    description: 'Warm, romantic — cream stock feel with heritage gold and deep navy.',
    bg: '#f8f3e3',
    tokens: [CREAM_RAMP[2], CREAM_RAMP[5], GOLD_RAMP[2], NAVY_RAMP[1]],
    example: 'Cream background · Stone detail · Brass accent · Deep Navy text',
  },
  {
    name: 'Bat Safari',
    description: 'Twilight on the Cam — darkest navies with sparing cool mid-tones.',
    bg: '#0a1530',
    tokens: [NAVY_RAMP[0], NAVY_RAMP[2], NAVY_RAMP[6], CREAM_RAMP[0]],
    example: 'Midnight background · Dusk mid-tone · Vapour highlights · Off-White text',
  },
]

// ── Typography Scale ─────────────────────────────────────────────────────────

export const TYPE_SCALE: TypeStyle[] = [
  {
    level: 'H1 — Hero',
    font: 'display',
    weight: '700',
    size: '3.5rem',
    tracking: '-0.02em',
    lineHeight: '1.05',
    twClasses: 'font-display font-bold text-5xl md:text-6xl tracking-display leading-none',
    description: 'Gill Sans Bold · 56pt · −2% tracking · 1.05 line-height',
  },
  {
    level: 'H2 — Section',
    font: 'display',
    weight: '700',
    size: '2.25rem',
    tracking: '-0.01em',
    lineHeight: '1.15',
    twClasses: 'font-display font-bold text-4xl tracking-mid leading-tight',
    description: 'Gill Sans Bold · 36pt · −1% tracking · 1.15 line-height',
  },
  {
    level: 'H3 — Subhead',
    font: 'sans',
    weight: '600',
    size: '1.375rem',
    tracking: '0',
    lineHeight: '1.3',
    twClasses: 'font-sans font-semibold text-2xl tracking-normal leading-snug',
    description: 'Inter Semibold · 22pt · 0 tracking · 1.3 line-height',
  },
  {
    level: 'H4 — Label',
    font: 'sans',
    weight: '600',
    size: '1rem',
    tracking: '0',
    lineHeight: '1.4',
    twClasses: 'font-sans font-semibold text-base tracking-normal leading-snug',
    description: 'Inter Semibold · 16pt · 0 tracking · 1.4 line-height',
  },
  {
    level: 'Eyebrow / Overline',
    font: 'sans',
    weight: '500',
    size: '0.75rem',
    tracking: '0.15em',
    lineHeight: '1.4',
    twClasses: 'font-sans font-medium text-xs uppercase tracking-caps leading-snug',
    description: 'Inter Medium · 12pt · UPPERCASE · +15% tracking · 1.4 line-height',
  },
  {
    level: 'Body Large / Intro',
    font: 'sans',
    weight: '400',
    size: '1.125rem',
    tracking: '0',
    lineHeight: '1.6',
    twClasses: 'font-sans font-normal text-lg tracking-normal leading-relaxed',
    description: 'Inter Regular · 18pt · 0 tracking · 1.6 line-height',
  },
  {
    level: 'Body Default',
    font: 'sans',
    weight: '400',
    size: '0.9375rem',
    tracking: '0',
    lineHeight: '1.6',
    twClasses: 'font-sans font-normal text-base tracking-normal leading-relaxed',
    description: 'Inter Regular · 15pt · 0 tracking · 1.6 line-height',
  },
  {
    level: 'Caption / Small',
    font: 'sans',
    weight: '400',
    size: '0.75rem',
    tracking: '0',
    lineHeight: '1.5',
    twClasses: 'font-sans font-normal text-xs tracking-normal leading-normal',
    description: 'Inter Regular · 12pt · 0 tracking · 1.5 line-height',
  },
  {
    level: 'Pull Quote',
    font: 'display',
    weight: '700',
    size: '1.5rem',
    tracking: '0',
    lineHeight: '1.4',
    twClasses: 'font-display font-bold italic text-2xl tracking-normal leading-snug',
    description: 'Gill Sans Bold Italic · 24pt · 0 tracking · 1.4 line-height',
  },
]

// ── Navigation items ─────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  path: string
  icon: string
  description: string
  subsections?: { label: string; anchor: string }[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Overview',
    path: '/',
    icon: 'LayoutDashboard',
    description: 'Brand story, values, and quick navigation',
  },
  {
    label: 'Colour',
    path: '/colour',
    icon: 'Palette',
    description: 'Full palette, WCAG checker, mood explorer',
    subsections: [
      { label: 'Primary', anchor: 'primary' },
      { label: 'Navy Ramp', anchor: 'navy-ramp' },
      { label: 'Cream Ramp', anchor: 'cream-ramp' },
      { label: 'Accent Colours', anchor: 'accent-colours' },
      { label: 'WCAG Checker', anchor: 'wcag-checker' },
      { label: 'Mood Explorer', anchor: 'mood-explorer' },
    ],
  },
  {
    label: 'Logo',
    path: '/logo',
    icon: 'Stamp',
    description: 'Logo variants, usage rules, clear space, downloads',
    subsections: [
      { label: 'Variants', anchor: 'variants' },
      { label: 'Clear Space', anchor: 'clear-space' },
      { label: 'Do\'s & Don\'ts', anchor: 'dos-donts' },
      { label: 'Downloads', anchor: 'downloads' },
    ],
  },
  {
    label: 'Typography',
    path: '/typography',
    icon: 'Type',
    description: 'Fonts, type scale, live preview',
    subsections: [
      { label: 'Fonts', anchor: 'fonts' },
      { label: 'Type Scale', anchor: 'type-scale' },
      { label: 'Live Preview', anchor: 'live-preview' },
      { label: 'Rules', anchor: 'rules' },
    ],
  },
  {
    label: 'Voice & Tone',
    path: '/voice',
    icon: 'MessageSquare',
    description: 'Brand voice traits, channel tones, do\'s & don\'ts',
    subsections: [
      { label: 'Traits', anchor: 'traits' },
      { label: 'Channel Tones', anchor: 'channels' },
      { label: 'Do\'s & Don\'ts', anchor: 'dos-donts' },
      { label: 'Scudamore\'s-isms', anchor: 'isms' },
    ],
  },
  {
    label: 'Photography',
    path: '/photography',
    icon: 'Camera',
    description: 'Editing approach, composition, subjects, aspect ratios',
  },
  {
    label: 'Graphics & Icons',
    path: '/graphics',
    icon: 'Shapes',
    description: 'Icon libraries, decorative elements, illustration',
  },
  {
    label: 'Charts',
    path: '/charts',
    icon: 'BarChart2',
    description: 'Chart types, colour rules, typography in charts',
  },
  {
    label: 'Applications',
    path: '/applications',
    icon: 'Layout',
    description: 'Digital, print, and social media templates',
  },
  {
    label: 'Quick Reference',
    path: '/quick-reference',
    icon: 'Zap',
    description: 'All tokens at a glance — cheat sheet',
  },
  {
    label: 'Downloads',
    path: '/downloads',
    icon: 'Download',
    description: 'Logos, colour tokens, CSS variables',
  },
  {
    label: 'Developer',
    path: '/developer',
    icon: 'Code2',
    description: 'Interactive components, recipes, foundations, and source',
  },
]
