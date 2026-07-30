import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DownloadButtonProps {
  href: string
  filename: string
  label?: string
  accessibleLabel?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default'
  className?: string
}

export function DownloadButton({
  href,
  filename,
  label = 'Download',
  accessibleLabel,
  variant = 'outline',
  size = 'sm',
  className,
}: DownloadButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={cn(
        'border-input text-xs shadow-sm gap-2 has-[>svg]:px-3 dark:bg-background dark:hover:bg-accent',
        className,
      )}
    >
      <a
        href={href}
        download={filename}
        aria-label={accessibleLabel ?? `${label} ${filename}`}
      >
        <Download className="size-3.5" aria-hidden="true" />
        {label}
      </a>
    </Button>
  )
}
