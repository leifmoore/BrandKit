import { type ColorToken } from '@/lib/tokens'
import { ColourSwatch } from './ColourSwatch'

interface ColourRampProps {
  title: string
  tokens: ColorToken[]
  description?: string
}

export function ColourRamp({ title, tokens, description }: ColourRampProps) {
  return (
    <div className="mb-10">
      <h3 className="font-sans font-semibold text-lg text-navy-900 dark:text-cream-50 mb-1">{title}</h3>
      {description && (
        <p className="font-sans text-sm text-navy-700 dark:text-cream-300 mb-4">{description}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {tokens.map(token => (
          <div key={token.alias} className="flex flex-col gap-1">
            <ColourSwatch token={token} size="md" />
            <div>
              <p className="font-sans text-xs font-medium text-navy-900 dark:text-cream-50">{token.name}</p>
              <p className="font-mono text-xs text-navy-500 dark:text-navy-300">{token.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
