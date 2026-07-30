import { useState } from 'react'
import { MOOD_PALETTES } from '@/lib/tokens'
import { ColourSwatch } from './ColourSwatch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { contrastRatio, hexToRgb } from '@/lib/wcag'

export function MoodExplorer() {
  const [active, setActive] = useState(0)
  const mood = MOOD_PALETTES[active]
  const background = hexToRgb(mood.bg)
  const readableTokens = mood.tokens
    .map(token => ({ token, ratio: contrastRatio(token.rgb, background) }))
    .sort((left, right) => right.ratio - left.ratio)
  const textToken = readableTokens[0]
  const secondaryToken = readableTokens.find(({ ratio, token }) => ratio >= 4.5 && token.alias !== textToken?.token.alias)
  const textColour = textToken?.token.hex ?? '#14284b'
  const secondaryColour = secondaryToken?.token.hex ?? textColour

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {MOOD_PALETTES.map((m, i) => (
          <Button
            key={m.name}
            type="button"
            variant={i === active ? 'default' : 'outline'}
            size="sm"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={cn(
              'rounded-full px-4 font-sans',
              i === active && 'shadow-sm',
            )}
          >
            {m.name}
          </Button>
        ))}
      </div>

      {/* Palette preview */}
      <div
        className="overflow-hidden rounded-xl border border-black/10"
        style={{ backgroundColor: mood.bg }}
      >
        <div className="p-6 pb-4">
          <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-caps" style={{ color: secondaryColour }}>
            {mood.name} palette
          </p>
          <p className="mb-1 font-display text-2xl font-bold" style={{ color: textColour }}>
            {mood.description}
          </p>
          <p className="font-sans text-sm" style={{ color: textColour }}>
            {mood.example}
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="flex gap-3 flex-wrap">
            {mood.tokens.map(token => (
              <ColourSwatch key={token.alias} token={token} size="lg" className="w-32 flex-none" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
