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
    name: 'River Dusk',
    alias: 'navy-700',
    hex: '#435e7b',
    rgb: { r: 67, g: 94, b: 123 },
    hsl: { h: 211, s: 29, l: 37 },
    cmyk: { c: 46, m: 24, y: 0, k: 52 },
    cssVar: '--color-navy-700',
    twBg: 'bg-navy-700',
    twText: 'text-navy-700',
    description: 'Dark bridge from Deep Navy toward Water Powder — secondary text on light',
  },
  {
    name: 'River Blue',
    alias: 'navy-500',
    hex: '#7295aa',
    rgb: { r: 114, g: 149, b: 170 },
    hsl: { h: 203, s: 25, l: 56 },
    cmyk: { c: 33, m: 12, y: 0, k: 33 },
    cssVar: '--color-navy-500',
    twBg: 'bg-navy-500',
    twText: 'text-navy-500',
    description: 'Midpoint toward Water Powder — decorative and large-text use, not body copy on light',
  },
  {
    name: 'Water Powder',
    alias: 'navy-300',
    hex: '#a2cddb',
    rgb: { r: 162, g: 205, b: 219 },
    hsl: { h: 195, s: 44, l: 75 },
    cmyk: { c: 26, m: 6, y: 0, k: 14 },
    cssVar: '--color-navy-300',
    twBg: 'bg-navy-300',
    twText: 'text-navy-300',
    description: 'Expression source — river, sky, atmospheric surfaces, and text on Deep Navy',
  },
  {
    name: 'Water Mist',
    alias: 'navy-100',
    hex: '#d5e8ee',
    rgb: { r: 213, g: 232, b: 238 },
    hsl: { h: 194, s: 42, l: 88 },
    cmyk: { c: 11, m: 3, y: 0, k: 7 },
    cssVar: '--color-navy-100',
    twBg: 'bg-navy-100',
    twText: 'text-navy-100',
    description: 'Light Water Powder tint — decorative panels and subtle borders',
  },
  {
    name: 'Water Vapour',
    alias: 'navy-50',
    hex: '#eaf3f6',
    rgb: { r: 234, g: 243, b: 246 },
    hsl: { h: 195, s: 40, l: 94 },
    cmyk: { c: 5, m: 1, y: 0, k: 4 },
    cssVar: '--color-navy-50',
    twBg: 'bg-navy-50',
    twText: 'text-navy-50',
    description: 'Near-white Water Powder tint — quiet authored Brand surfaces',
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
    name: 'Butter Vellum',
    alias: 'cream-75',
    hex: '#fefaf4',
    rgb: { r: 254, g: 250, b: 244 },
    hsl: { h: 36, s: 83, l: 98 },
    cmyk: { c: 0, m: 2, y: 4, k: 0 },
    cssVar: '--color-cream-75',
    twBg: 'bg-cream-75',
    twText: 'text-cream-75',
    description: 'Barely warm tint derived from Faded Butter',
  },
  {
    name: 'Butter Cream',
    alias: 'cream-100',
    hex: '#fef7ec',
    rgb: { r: 254, g: 247, b: 236 },
    hsl: { h: 37, s: 90, l: 96 },
    cmyk: { c: 0, m: 3, y: 7, k: 0 },
    cssVar: '--color-cream-100',
    twBg: 'bg-cream-100',
    twText: 'text-cream-100',
    description: 'Light Faded Butter wash — warm, paper-like Brand canvas',
  },
  {
    name: 'Soft Butter',
    alias: 'cream-200',
    hex: '#fef2e1',
    rgb: { r: 254, g: 242, b: 225 },
    hsl: { h: 35, s: 94, l: 94 },
    cmyk: { c: 0, m: 5, y: 11, k: 0 },
    cssVar: '--color-cream-200',
    twBg: 'bg-cream-200',
    twText: 'text-cream-200',
    description: 'Soft warm surface for authored editorial zones',
  },
  {
    name: 'Butter',
    alias: 'cream-300',
    hex: '#feeed7',
    rgb: { r: 254, g: 238, b: 215 },
    hsl: { h: 35, s: 95, l: 92 },
    cmyk: { c: 0, m: 6, y: 15, k: 0 },
    cssVar: '--color-cream-300',
    twBg: 'bg-cream-300',
    twText: 'text-cream-300',
    description: 'Noticeable warm editorial surface derived from Faded Butter',
  },
  {
    name: 'Faded Butter',
    alias: 'cream-400',
    hex: '#feeacd',
    rgb: { r: 254, g: 234, b: 205 },
    hsl: { h: 36, s: 96, l: 90 },
    cmyk: { c: 0, m: 8, y: 19, k: 0 },
    cssVar: '--color-cream-400',
    twBg: 'bg-cream-400',
    twText: 'text-cream-400',
    description: 'Expression source — family, daytime, hospitality, and editorial emphasis',
  },
]

export const PRIMARY_TOKENS: ColorToken[] = [
  NAVY_RAMP[1], // Deep Navy
  CREAM_RAMP[0], // Off-White
]

export const BRAND_RAMP_TOKENS: ColorToken[] = [...NAVY_RAMP, ...CREAM_RAMP]

// ── WCAG approved / forbidden pairs ─────────────────────────────────────────

export const WCAG_APPROVED = [
  { fg: 'cream-50',  bg: 'navy-1000', level: 'AAA', note: 'Body text' },
  { fg: 'cream-50',  bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'cream-50',  bg: 'navy-700',  level: 'AA',  note: 'Body text' },
  { fg: 'cream-75',  bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'cream-100', bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-50',   bg: 'navy-900',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-900',  bg: 'cream-50',  level: 'AAA', note: 'Body text' },
  { fg: 'navy-900',  bg: 'cream-300', level: 'AAA', note: 'Body text' },
  { fg: 'navy-700',  bg: 'cream-50',  level: 'AA',  note: 'Body text' },
  { fg: 'navy-500',  bg: 'navy-900',  level: 'AA',  note: 'Near threshold — prefer a lighter tint for body' },
  { fg: 'navy-300',  bg: 'navy-900',  level: 'AAA', note: 'Body text' },
] as const

export const WCAG_FORBIDDEN = [
  { fg: 'navy-300', bg: 'navy-100', reason: 'Insufficient contrast' },
  { fg: 'navy-100', bg: 'cream-50', reason: 'Insufficient contrast' },
  { fg: 'navy-500', bg: 'navy-300', reason: 'Insufficient contrast' },
  { fg: 'navy-500', bg: 'cream-50', reason: 'Large text only; use River Dusk or Deep Navy for body' },
  { fg: 'cream-300', bg: 'cream-50', reason: 'Insufficient contrast' },
  { fg: 'navy-700', bg: 'navy-900', reason: 'Insufficient contrast' },
] as const

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
    description: 'Gill Sans Nova Bold · 56pt · −2% tracking · 1.05 line-height',
  },
  {
    level: 'H2 — Section',
    font: 'display',
    weight: '700',
    size: '2.25rem',
    tracking: '-0.01em',
    lineHeight: '1.15',
    twClasses: 'font-display font-bold text-4xl tracking-mid leading-tight',
    description: 'Gill Sans Nova Bold · 36pt · −1% tracking · 1.15 line-height',
  },
  {
    level: 'H3 — Subhead',
    font: 'sans',
    weight: '600',
    size: '1.375rem',
    tracking: '0',
    lineHeight: '1.3',
    twClasses: 'font-sans font-semibold text-2xl tracking-normal leading-snug',
    description: 'Instrument Sans Semibold · 22pt · 0 tracking · 1.3 line-height',
  },
  {
    level: 'H4 — Label',
    font: 'sans',
    weight: '600',
    size: '1rem',
    tracking: '0',
    lineHeight: '1.4',
    twClasses: 'font-sans font-semibold text-base tracking-normal leading-snug',
    description: 'Instrument Sans Semibold · 16pt · 0 tracking · 1.4 line-height',
  },
  {
    level: 'Eyebrow / Overline',
    font: 'sans',
    weight: '500',
    size: '0.75rem',
    tracking: '0.15em',
    lineHeight: '1.4',
    twClasses: 'font-sans font-medium text-xs uppercase tracking-caps leading-snug',
    description: 'Instrument Sans Medium · 12pt · UPPERCASE · +15% tracking · 1.4 line-height',
  },
  {
    level: 'Body Large / Intro',
    font: 'sans',
    weight: '400',
    size: '1.125rem',
    tracking: '0',
    lineHeight: '1.6',
    twClasses: 'font-sans font-normal text-lg tracking-normal leading-relaxed',
    description: 'Instrument Sans Regular · 18pt · 0 tracking · 1.6 line-height',
  },
  {
    level: 'Body Default',
    font: 'sans',
    weight: '400',
    size: '0.9375rem',
    tracking: '0',
    lineHeight: '1.6',
    twClasses: 'font-sans font-normal text-base tracking-normal leading-relaxed',
    description: 'Instrument Sans Regular · 15pt · 0 tracking · 1.6 line-height',
  },
  {
    level: 'Caption / Small',
    font: 'sans',
    weight: '400',
    size: '0.75rem',
    tracking: '0',
    lineHeight: '1.5',
    twClasses: 'font-sans font-normal text-xs tracking-normal leading-normal',
    description: 'Instrument Sans Regular · 12pt · 0 tracking · 1.5 line-height',
  },
  {
    level: 'Pull Quote',
    font: 'display',
    weight: '700',
    size: '1.5rem',
    tracking: '0',
    lineHeight: '1.4',
    twClasses: 'font-display font-bold italic text-2xl tracking-normal leading-snug',
    description: 'Gill Sans Nova Bold Italic · 24pt · 0 tracking · 1.4 line-height',
  },
]
