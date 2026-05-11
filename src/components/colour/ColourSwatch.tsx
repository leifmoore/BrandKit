import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { type ColorToken } from '@/lib/tokens'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { rgbToHsl } from '@/lib/wcag'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SwatchFormat {
  label: string
  value: string
}

function getFormats(token: ColorToken): SwatchFormat[] {
  const { r, g, b } = token.rgb
  const { h, s, l } = rgbToHsl(r, g, b)
  const { c, m, y, k } = token.cmyk
  return [
    { label: 'HEX',    value: token.hex },
    { label: 'RGB',    value: `${r}, ${g}, ${b}` },
    { label: 'HSL',    value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'CSS',    value: `var(${token.cssVar})` },
    { label: 'TW',     value: token.twBg },
    { label: 'CMYK',   value: `C${c} M${m} Y${y} K${k}` },
  ]
}

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

interface ColourSwatchProps {
  token: ColorToken
  size?: 'sm' | 'md' | 'lg'
}

export function ColourSwatch({ token, size = 'md' }: ColourSwatchProps) {
  const [open, setOpen] = useState(false)
  const { copied, copy } = useCopyToClipboard()
  const formats = getFormats(token)
  const light = isLight(token.hex)
  const textColor = light ? 'text-navy-900' : 'text-cream-50'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group relative rounded-lg overflow-hidden border border-black/10 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500',
            size === 'sm' && 'h-16',
            size === 'md' && 'h-24',
            size === 'lg' && 'h-32',
          )}
          style={{ backgroundColor: token.hex }}
          title={`${token.name} — click to copy`}
        >
          <div className={cn('absolute inset-0 flex flex-col justify-end p-2', textColor)}>
            <div className="flex items-end justify-between">
              <span className="text-xs font-sans font-medium leading-tight">{token.name}</span>
              <ChevronDown className={cn(
                'w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity',
                copied && 'opacity-70',
              )} />
            </div>
            <span className="text-xs font-mono opacity-70">{token.hex}</span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-2" align="start">
        <div
          className="w-full h-10 rounded-md mb-3 border border-black/10"
          style={{ backgroundColor: token.hex }}
        />
        <div className="mb-2 px-1">
          <p className="font-sans font-semibold text-sm text-foreground">{token.name}</p>
          <p className="font-sans text-xs text-muted-foreground">{token.alias}</p>
          {token.description && (
            <p className="font-sans text-xs text-muted-foreground mt-1">{token.description}</p>
          )}
        </div>
        <div className="space-y-0.5">
          {formats.map(fmt => (
            <CopyRow key={fmt.label} label={fmt.label} value={fmt.value} copy={copy} copied={copied} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CopyRow({
  label,
  value,
  copy,
  copied,
}: {
  label: string
  value: string
  copy: (v: string) => void
  copied: boolean
}) {
  const [thisOne, setThisOne] = useState(false)

  const handleCopy = () => {
    copy(value)
    setThisOne(true)
    setTimeout(() => setThisOne(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left group"
    >
      <span className="font-sans text-xs font-medium text-muted-foreground w-10 shrink-0">{label}</span>
      <span className="font-mono text-xs text-foreground flex-1 truncate">{value}</span>
      {thisOne && <Check className="w-3 h-3 text-green-600 shrink-0" />}
    </button>
  )
}
