import { useState } from 'react'
import { Slider } from '@/components/ui/slider'

export function ClearSpaceVis() {
  const [multiplier, setMultiplier] = useState(0.5)
  const logoHeight = 80

  const clearSpace = Math.round(logoHeight * multiplier)
  const label = multiplier <= 0.25 ? '0.25× (minimum)' : multiplier >= 0.5 ? '0.5× (preferred)' : `${multiplier.toFixed(2)}×`

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-caps">
            Clear space multiplier
          </label>
          <span className="font-sans text-sm font-medium text-navy-900 dark:text-cream-50">{label}</span>
        </div>
        <Slider
          min={0.25}
          max={0.5}
          step={0.05}
          value={[multiplier]}
          onValueChange={([v]) => setMultiplier(v)}
          className="w-full max-w-sm"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-sm">
          <span>0.25× minimum</span>
          <span>0.5× preferred</span>
        </div>
      </div>

      {/* Visual */}
      <div className="flex justify-center">
        <div className="relative bg-cream-100 dark:bg-navy-700 rounded-xl p-4 border-2 border-dashed border-cream-300 dark:border-navy-500">
          {/* Clear space zone */}
          <div
            className="relative bg-gold-500/10 border border-gold-500/30 rounded flex items-center justify-center transition-all duration-300"
            style={{
              padding: `${clearSpace}px`,
            }}
          >
            {/* Clear space label */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-sans text-gold-500 dark:text-gold-300 whitespace-nowrap">
              {clearSpace}px clear space
            </div>
            {/* Logo */}
            <img
              src="/logos/logo-navy.svg"
              alt="Scudamore's"
              style={{ height: `${logoHeight}px`, width: 'auto' }}
              className="dark:invert"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm font-sans">
        <div className="rounded-lg bg-card p-4 border border-border">
          <p className="font-medium text-foreground mb-1">0.5× — Preferred</p>
          <p className="text-muted-foreground text-xs">Standalone use, primary brand moments, hero imagery. Gives the mark maximum breathing room.</p>
        </div>
        <div className="rounded-lg bg-card p-4 border border-border">
          <p className="font-medium text-foreground mb-1">0.25× — Minimum</p>
          <p className="text-muted-foreground text-xs">Tight layouts, headers, space-constrained applications. Never go below this threshold.</p>
        </div>
      </div>

      <div className="text-xs font-sans text-muted-foreground space-y-1">
        <p><strong>Print minimum:</strong> 25mm width</p>
        <p><strong>Digital minimum:</strong> 90px width</p>
      </div>
    </div>
  )
}
