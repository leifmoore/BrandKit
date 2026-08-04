import type { ReactNode } from 'react'
import { AlertCircle, FileQuestion, RotateCcw } from 'lucide-react'
import { PageHeader, type PageHeaderProps } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DeveloperPageHeaderProps = PageHeaderProps

export function DeveloperPageHeader({
  eyebrow,
  title,
  description,
  badges,
  metadata,
  className,
  compact = false,
}: DeveloperPageHeaderProps) {
  return (
    <PageHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      badges={badges}
      metadata={metadata}
      className={className}
      compact={compact}
    />
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
          <h2 id={`${id}-heading`} className="font-sans text-2xl font-semibold text-foreground">
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
      <h2 className="mt-4 font-sans text-xl font-semibold text-foreground">{title}</h2>
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
