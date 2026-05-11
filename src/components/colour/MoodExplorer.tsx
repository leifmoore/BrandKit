import { useState } from 'react'
import { MOOD_PALETTES } from '@/lib/tokens'
import { ColourSwatch } from './ColourSwatch'
import { cn } from '@/lib/utils'

export function MoodExplorer() {
  const [active, setActive] = useState(0)
  const mood = MOOD_PALETTES[active]

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {MOOD_PALETTES.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setActive(i)}
            className={cn(
              'px-4 py-2 rounded-full font-sans text-sm font-medium transition-colors border',
              i === active
                ? 'bg-navy-900 dark:bg-cream-50 text-cream-50 dark:text-navy-900 border-transparent'
                : 'bg-transparent border-cream-300 dark:border-navy-700 text-navy-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-navy-700',
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Palette preview */}
      <div
        className="rounded-xl overflow-hidden border border-black/10 transition-colors duration-500"
        style={{ backgroundColor: mood.bg }}
      >
        <div className="p-6 pb-4">
          <p className="font-sans text-xs uppercase tracking-caps mb-1"
            style={{ color: mood.tokens[0]?.hex === mood.bg ? '#c9a24a' : mood.tokens[0]?.hex }}>
            {mood.name} palette
          </p>
          <p className="font-display font-bold text-2xl mb-1"
            style={{ color: mood.tokens.find(t => t.alias.startsWith('cream') || t.alias.startsWith('navy-9') || t.alias.startsWith('navy-1'))?.hex ?? mood.tokens[0]?.hex }}>
            {mood.description}
          </p>
          <p className="font-sans text-sm opacity-70"
            style={{ color: mood.tokens[0]?.hex }}>
            {mood.example}
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="flex gap-3 flex-wrap">
            {mood.tokens.map(token => (
              <ColourSwatch key={token.alias} token={token} size="lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
