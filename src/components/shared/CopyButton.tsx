import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  value: string
  label?: string
  accessibleLabel?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({
  value,
  label,
  accessibleLabel,
  className,
  size = 'sm',
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard()
  const [copyFailed, setCopyFailed] = useState(false)
  const actionLabel = accessibleLabel ?? `Copy ${label ?? value}`
  const announcementSubject = actionLabel.replace(/^copy\s+/i, '') || label || 'Content'

  const handleCopy = async () => {
    setCopyFailed(false)
    if (await copy(value)) return
    setCopyFailed(true)
    setTimeout(() => setCopyFailed(false), 2000)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={handleCopy}
        aria-label={actionLabel}
        title={actionLabel}
        className={cn(
          'h-auto gap-1.5 rounded font-sans font-medium transition-colors',
          'text-navy-700 dark:text-cream-300 hover:bg-transparent dark:hover:bg-transparent hover:text-gold-500 dark:hover:text-gold-300',
          size === 'sm'
            ? 'px-2 py-1 text-xs has-[>svg]:px-2'
            : 'px-3 py-1.5 text-sm has-[>svg]:px-3',
          copied && 'text-green-600 dark:text-green-400',
          className,
        )}
      >
        {copied
          ? <Check className="w-3 h-3" aria-hidden="true" />
          : <Copy className="w-3 h-3" aria-hidden="true" />}
        {label && <span>{copied ? 'Copied!' : label}</span>}
      </Button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copied
          ? `${announcementSubject} copied to the clipboard.`
          : copyFailed
            ? `${announcementSubject} could not be copied.`
            : ''}
      </span>
    </>
  )
}
