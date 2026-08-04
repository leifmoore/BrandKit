import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { FrameworkBadge, MaturityBadge } from '../docs/StatusBadges'
import type { CatalogEntryViewModel } from '../docs/types'
import { LivePreview } from '../preview'

function useNearViewport() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(Boolean(entry?.isIntersecting))
      },
      { rootMargin: '240px 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return { targetRef, nearViewport }
}

export function ComponentPreviewCard({
  entry,
  onNavigate,
}: {
  entry: CatalogEntryViewModel
  onNavigate?: (entry: CatalogEntryViewModel) => void
}) {
  const { targetRef, nearViewport } = useNearViewport()
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return
    if (
      event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return
    event.preventDefault()
    onNavigate(entry)
  }

  return (
    <article
      data-catalog-preview-card={entry.id}
      data-component-preview-card={entry.kind === 'component' ? entry.id : undefined}
      data-pattern-preview-card={entry.kind === 'recipe' ? entry.id : undefined}
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
    >
      <div ref={targetRef} className="h-44 overflow-hidden border-b border-border bg-muted/30" data-card-preview={entry.id}>
        {nearViewport ? (
          <LivePreview
            entryId={entry.id}
            kind={entry.kind === 'recipe' ? 'recipe' : 'component'}
            title={`${entry.title} thumbnail`}
            showControls={false}
            thumbnail
            className="h-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center" aria-hidden="true">
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {entry.maturity ? <MaturityBadge maturity={entry.maturity} /> : null}
          {entry.frameworks?.map((framework) => (
            <FrameworkBadge key={framework} framework={framework} />
          ))}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              {entry.category.replace(/-/g, ' ')}
            </p>
            <h3 className="mt-1 font-sans text-lg font-semibold text-foreground">
              <a
                href={entry.href}
                onClick={navigate}
                className="rounded-sm outline-none after:absolute after:inset-0"
              >
                {entry.title}
              </a>
            </h3>
          </div>
          <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
        </div>
        <p className="mt-2 line-clamp-2 font-sans text-sm leading-6 text-muted-foreground">
          {entry.description ?? `Open the ${entry.title} documentation.`}
        </p>
      </div>
    </article>
  )
}
