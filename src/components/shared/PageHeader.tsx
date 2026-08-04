import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  badges?: ReactNode
  metadata?: ReactNode
  className?: string
  compact?: boolean
}

/**
 * Host-level page framing shared by the Brand and Design System workspaces.
 * This is an application pattern, not a copyable handoff component.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  badges,
  metadata,
  className,
  compact = false,
}: PageHeaderProps) {
  return (
    <header className={cn(compact ? 'mb-6 border-b border-border pb-5' : 'mb-10 border-b border-border pb-8', className)}>
      {eyebrow ? (
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h1 className={cn(compact ? 'text-3xl font-semibold leading-tight md:text-4xl' : 'text-4xl font-bold leading-none md:text-5xl', 'font-sans tracking-tight text-foreground')}>
            {title}
          </h1>
          {description ? (
            <p className={cn('max-w-2xl font-sans text-muted-foreground', compact ? 'mt-2 text-sm leading-6 md:text-base' : 'mt-4 text-base leading-7 md:text-lg')}>
              {description}
            </p>
          ) : null}
        </div>
        {badges ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2" role="group" aria-label="Page status">
            {badges}
          </div>
        ) : null}
      </div>
      {metadata ? <div className="mt-5">{metadata}</div> : null}
    </header>
  )
}
