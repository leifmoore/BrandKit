import { useDeferredValue, useMemo, type MouseEvent, type ReactNode } from 'react'
import { LayoutGrid, List, Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DeveloperPageHeader, PageState } from '../docs/PageScaffold'
import type { CatalogEntryViewModel } from '../docs/types'
import { CatalogEntryCard } from './CatalogOverviewPage'
import { ComponentPreviewCard } from './ComponentPreviewCard'

type CollectionKind = 'components' | 'patterns' | 'foundations' | 'roadmap'
type ComponentLayout = 'list' | 'cards'

function matchesQuery(entry: CatalogEntryViewModel, query: string) {
  if (!query) return true
  const searchable = [
    entry.title,
    entry.id,
    entry.description,
    entry.category,
    ...(entry.searchTerms ?? []),
    ...(entry.frameworks ?? []),
  ].filter(Boolean).join(' ').toLocaleLowerCase()
  return searchable.includes(query)
}

function ComponentCollection({
  entries,
  onEntryNavigate,
}: {
  entries: readonly CatalogEntryViewModel[]
  onEntryNavigate?: (entry: CatalogEntryViewModel) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get('q') ?? ''
  const deferredQuery = useDeferredValue(searchValue.trim().toLocaleLowerCase())
  const layout: ComponentLayout = searchParams.get('layout') === 'list' ? 'list' : 'cards'
  const sortedEntries = useMemo(
    () => [...entries].sort((left, right) => left.title.localeCompare(right.title)),
    [entries],
  )
  const visibleEntries = useMemo(
    () => sortedEntries.filter((entry) => matchesQuery(entry, deferredQuery)),
    [deferredQuery, sortedEntries],
  )

  const updateParam = (name: 'q' | 'layout', value?: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next, { replace: true })
  }
  const navigate = (event: MouseEvent<HTMLAnchorElement>, entry: CatalogEntryViewModel) => {
    if (!onEntryNavigate) return
    if (
      event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return
    event.preventDefault()
    onEntryNavigate(entry)
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Search components…"
            aria-label="Search components"
            className="pl-9 pr-9"
          />
          {searchValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear component search"
              onClick={() => updateParam('q')}
              className="absolute right-0 top-0 size-9 text-muted-foreground"
            >
              <X aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="font-sans text-xs text-muted-foreground" role="status" aria-live="polite">
            {visibleEntries.length} of {entries.length} components
          </p>
          <div className="flex rounded-lg border border-border bg-muted p-[3px]" role="group" aria-label="Component view">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="List view"
              aria-pressed={layout === 'list'}
              onClick={() => updateParam('layout', 'list')}
              className={layout === 'list' ? 'bg-card shadow-sm hover:bg-card' : undefined}
            >
              <List aria-hidden="true" />
              List
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Card view"
              aria-pressed={layout === 'cards'}
              onClick={() => updateParam('layout')}
              className={layout === 'cards' ? 'bg-card shadow-sm hover:bg-card' : undefined}
            >
              <LayoutGrid aria-hidden="true" />
              Cards
            </Button>
          </div>
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <section aria-labelledby="all-components-heading">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="all-components-heading" className="font-sans text-xl font-semibold text-foreground">
              All Components
            </h2>
            <span className="font-sans text-xs text-muted-foreground">
              {layout === 'list' ? 'List view' : 'Card view'}
            </span>
          </div>

          {layout === 'list' ? (
            <ul className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3" aria-label="All components">
              {visibleEntries.map((entry) => (
                <li key={entry.id} className="border-b border-border sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0">
                  <a
                    href={entry.href}
                    onClick={(event) => navigate(event, entry)}
                    className="group flex min-h-14 items-center justify-between gap-3 rounded-sm px-3 py-3 font-sans text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{entry.title}</span>
                    <span className="text-xs font-normal capitalize text-muted-foreground">
                      {entry.category.replace(/-/g, ' ')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-component-card-grid>
              {visibleEntries.map((entry) => (
                <ComponentPreviewCard key={entry.id} entry={entry} onNavigate={onEntryNavigate} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <PageState
          kind="empty"
          title="No components found"
          description={`No component matches “${searchValue.trim()}”. Try a name, category, framework, or catalogue keyword.`}
          actionLabel="Clear search"
          onAction={() => updateParam('q')}
        />
      )}
    </>
  )
}

function GenericCollection({
  entries,
  onEntryNavigate,
  searchable = false,
}: {
  entries: readonly CatalogEntryViewModel[]
  onEntryNavigate?: (entry: CatalogEntryViewModel) => void
  searchable?: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchable ? (searchParams.get('q') ?? '') : ''
  const deferredQuery = useDeferredValue(searchValue.trim().toLocaleLowerCase())
  const visibleEntries = entries.filter((entry) => matchesQuery(entry, deferredQuery))
  const categories = [...new Set(visibleEntries.map((entry) => entry.category))]
    .sort()
    .map((category) => ({
      category,
      entries: visibleEntries.filter((entry) => entry.category === category),
    }))

  return (
    <div>
      {searchable ? (
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams)
                if (event.target.value) next.set('q', event.target.value)
                else next.delete('q')
                setSearchParams(next, { replace: true })
              }}
              placeholder="Search patterns…"
              aria-label="Search patterns"
              className="pl-9 pr-9"
            />
            {searchValue ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear pattern search"
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.delete('q')
                  setSearchParams(next, { replace: true })
                }}
                className="absolute right-0 top-0 size-9 text-muted-foreground"
              >
                <X aria-hidden="true" />
              </Button>
            ) : null}
          </div>
          <p className="font-sans text-xs text-muted-foreground" role="status" aria-live="polite">
            {visibleEntries.length} of {entries.length} patterns
          </p>
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="space-y-9">
      {categories.map((group) => (
        <section key={group.category} aria-labelledby={`collection-${group.category}`}>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id={`collection-${group.category}`} className="font-sans text-lg font-semibold capitalize text-foreground">
              {group.category.replace(/-/g, ' ')}
            </h2>
            <span className="text-xs text-muted-foreground">{group.entries.length} entries</span>
          </div>
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            data-pattern-card-grid={searchable || undefined}
          >
            {group.entries.map((entry) => (
              searchable ? (
                <ComponentPreviewCard key={`${entry.kind}-${entry.id}`} entry={entry} onNavigate={onEntryNavigate} />
              ) : (
                <CatalogEntryCard key={`${entry.kind}-${entry.id}`} entry={entry} onNavigate={onEntryNavigate} />
              )
            ))}
          </div>
        </section>
      ))}
        </div>
      ) : (
        <PageState
          kind="empty"
          title={searchable ? 'No patterns found' : 'No entries available'}
          description={searchable
            ? `No pattern matches “${searchValue.trim()}”. Try a name, category, maturity, dependency, state, or catalogue keyword.`
            : 'This Design System collection does not contain any catalogue entries.'}
        />
      )}
    </div>
  )
}

export function CollectionPage({
  eyebrow = 'Design System',
  title,
  description,
  entries,
  kind,
  notice,
  onEntryNavigate,
}: {
  eyebrow?: string
  title: string
  description: string
  entries: readonly CatalogEntryViewModel[]
  kind: CollectionKind
  notice?: ReactNode
  onEntryNavigate?: (entry: CatalogEntryViewModel) => void
}) {
  return (
    <article>
      <DeveloperPageHeader eyebrow={eyebrow} title={title} description={description} compact />
      {notice}
      {kind === 'components' ? (
        <ComponentCollection entries={entries} onEntryNavigate={onEntryNavigate} />
      ) : (
        <GenericCollection
          entries={entries}
          onEntryNavigate={onEntryNavigate}
          searchable={kind === 'patterns'}
        />
      )}
    </article>
  )
}
