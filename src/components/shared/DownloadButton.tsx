import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DownloadButtonProps {
  href: string
  filename: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default'
  className?: string
}

export function DownloadButton({
  href,
  filename,
  label = 'Download',
  variant = 'outline',
  size = 'sm',
  className,
}: DownloadButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      asChild
      className={cn(className)}
    >
      <a href={href} download={filename}>
        <Download className="w-3.5 h-3.5 mr-1.5" />
        {label}
      </a>
    </Button>
  )
}
