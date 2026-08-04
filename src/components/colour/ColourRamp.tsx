import { type ColorToken } from '@/lib/tokens'
import { ColourSwatch } from './ColourSwatch'

interface ColourRampProps {
  title?: string
  tokens: ColorToken[]
  description?: string
}

export function ColourRamp({ title, tokens, description }: ColourRampProps) {
  return (
    <div className="mb-10">
      {title ? <h3 className="mb-1 font-sans text-lg font-semibold text-foreground">{title}</h3> : null}
      {description && (
        <p className="mb-4 font-sans text-sm text-muted-foreground">{description}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {tokens.map(token => (
          <div key={token.alias} className="flex flex-col gap-1">
            <ColourSwatch token={token} size="md" />
            <div>
              <p className="font-sans text-xs font-medium text-foreground">{token.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{token.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
