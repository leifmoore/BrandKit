import { useState } from 'react'
import { ALL_TOKENS } from '@/lib/tokens'
import { checkContrast, hexToRgb } from '@/lib/wcag'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function PassBadge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className={cn(
      'flex flex-col items-center p-3 rounded-lg border',
      pass
        ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    )}>
      <span className={cn(
        'text-lg font-bold font-sans',
        pass ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      )}>
        {pass ? '✓' : '✗'}
      </span>
      <span className="text-xs font-sans text-center text-muted-foreground mt-1">{label}</span>
    </div>
  )
}

export function ContrastChecker() {
  const [fgAlias, setFgAlias] = useState('cream-50')
  const [bgAlias, setBgAlias] = useState('navy-900')

  const fgToken = ALL_TOKENS.find(t => t.alias === fgAlias) ?? ALL_TOKENS[0]
  const bgToken = ALL_TOKENS.find(t => t.alias === bgAlias) ?? ALL_TOKENS[1]
  const result = checkContrast(hexToRgb(fgToken.hex), hexToRgb(bgToken.hex))

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="rounded-xl p-8 flex flex-col gap-2 transition-colors duration-300 border border-black/10"
        style={{ backgroundColor: bgToken.hex }}
      >
        <p
          className="font-display font-bold text-3xl transition-colors duration-300"
          style={{ color: fgToken.hex }}
        >
          Where Cambridge goes punting.
        </p>
        <p
          className="font-sans text-base transition-colors duration-300"
          style={{ color: fgToken.hex }}
        >
          Cambridge's oldest punting company. Founded 1910, family-run ever since.
        </p>
        <p
          className="font-sans text-sm transition-colors duration-300"
          style={{ color: fgToken.hex }}
        >
          Small text — 12pt caption example for checking small-size legibility.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contrast-foreground" className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-caps block mb-2">
            Text (foreground)
          </Label>
          <Select value={fgAlias} onValueChange={setFgAlias}>
            <SelectTrigger id="contrast-foreground">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-sm border border-black/10 shrink-0"
                  style={{ background: fgToken.hex }}
                />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {ALL_TOKENS.map(t => (
                <SelectItem key={t.alias} value={t.alias}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm border border-black/10 shrink-0"
                      style={{ background: t.hex }}
                    />
                    {t.name}
                    <span className="text-xs text-muted-foreground">{t.hex}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contrast-background" className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-caps block mb-2">
            Background
          </Label>
          <Select value={bgAlias} onValueChange={setBgAlias}>
            <SelectTrigger id="contrast-background">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-sm border border-black/10 shrink-0"
                  style={{ background: bgToken.hex }}
                />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {ALL_TOKENS.map(t => (
                <SelectItem key={t.alias} value={t.alias}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm border border-black/10 shrink-0"
                      style={{ background: t.hex }}
                    />
                    {t.name}
                    <span className="text-xs text-muted-foreground">{t.hex}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ratio + results */}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {`${fgToken.name} on ${bgToken.name}: ${result.ratioDisplay} contrast ratio. `}
        {`AA normal text ${result.normalAA ? 'passes' : 'fails'}. `}
        {`AAA normal text ${result.normalAAA ? 'passes' : 'fails'}. `}
        {`AA large text ${result.largeAA ? 'passes' : 'fails'}. `}
        {`AAA large text ${result.largeAAA ? 'passes' : 'fails'}.`}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-center">
          <div className="font-display font-bold text-5xl text-navy-900 dark:text-cream-50">
            {result.ratioDisplay}
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-1">contrast ratio</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
          <PassBadge pass={result.normalAA}  label="AA Normal text" />
          <PassBadge pass={result.normalAAA} label="AAA Normal text" />
          <PassBadge pass={result.largeAA}   label="AA Large text (18pt+)" />
          <PassBadge pass={result.largeAAA}  label="AAA Large text" />
        </div>
      </div>

      <p className="font-sans text-xs text-muted-foreground">
        WCAG 2.1 — AA requires 4.5:1 (normal), 3:1 (large/bold). AAA requires 7:1 (normal), 4.5:1 (large).
      </p>
    </div>
  )
}
