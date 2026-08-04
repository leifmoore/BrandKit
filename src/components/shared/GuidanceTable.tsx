import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GuidanceTableProps {
  label: string
  children: ReactNode
  className?: string
  tableClassName?: string
}

/**
 * Host-owned wrapper for guidance tables whose columns must remain available at
 * narrow widths. It is not a canonical handoff component.
 */
export function GuidanceTable({
  label,
  children,
  className,
  tableClassName,
}: GuidanceTableProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'max-w-full overflow-x-auto rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <table className={cn('w-full min-w-[40rem] font-sans text-sm', tableClassName)}>
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
    </div>
  )
}
