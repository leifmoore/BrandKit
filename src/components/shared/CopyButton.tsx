import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ value, label, className, size = 'sm' }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <button
      onClick={() => copy(value)}
      title={`Copy ${label ?? value}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-sans font-medium transition-colors',
        'text-navy-700 dark:text-cream-300 hover:text-gold-500 dark:hover:text-gold-300',
        size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5',
        copied && 'text-green-600 dark:text-green-400',
        className,
      )}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  )
}
