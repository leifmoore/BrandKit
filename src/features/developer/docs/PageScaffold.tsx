import type { ReactNode } from 'react'
import { AlertCircle, FileQuestion, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DeveloperPageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  badges?: ReactNode
  metadata?: ReactNode
  className?: string
}

export function DeveloperPageHeader({
  eyebrow,
  title,
  description,
  badges,
  metadata,
  className,
}: DeveloperPageHeaderProps) {
  return (
    <header className={cn('mb-10 border-b border-border pb-8', className)}>
      {eyebrow ? (
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-caps text-navy-700 dark:text-gold-300">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-none tracking-display text-foreground md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl font-sans text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {badges ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2" role="group" aria-label="Entry status">
            {badges}
          </div>
        ) : null}
      </div>
      {metadata ? <div className="mt-5">{metadata}</div> : null}
    </header>
  )
}

export interface DocSectionProps {
  id: string
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function DocSection({
  id,
  title,
  description,
  actions,
  children,
  className,
}: DocSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn('scroll-mt-8 border-b border-border py-10 first:pt-0 last:border-b-0', className)}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <h2 id={`${id}-heading`} className="font-display text-2xl font-bold text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

export function MetadataList({
  items,
  className,
}: {
  items: readonly { label: string; value: ReactNode }[]
  className?: string
}) {
  return (
    <dl className={cn('grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-3', className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-card px-4 py-3">
          <dt className="font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 break-words font-sans text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export interface PageStateProps {
  kind: 'empty' | 'error'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function PageState({
  kind,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: PageStateProps) {
  const Icon = kind === 'error' ? AlertCircle : FileQuestion

  return (
    <div
      className={cn('rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center', className)}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      <Icon className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 font-display text-xl font-bold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl font-sans text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" className="mt-5" onClick={onAction}>
          <RotateCcw aria-hidden="true" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
