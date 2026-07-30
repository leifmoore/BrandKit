import { useRef } from 'react'
import { Boxes, FlaskConical, Layers3, Search, ShieldQuestion } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  componentCategories,
  deferredComponents,
  foundations,
  recipes,
  searchCatalog,
} from './catalog'

export interface DeveloperNavigationProps {
  query: string
  onQueryChange: (value: string) => void
}

function DeveloperNavLink({
  to,
  children,
  onNavigate,
}: {
  to: string
  children: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      end
      onClick={(event) => {
        if (
          event.button === 0
          && !event.metaKey
          && !event.ctrlKey
          && !event.shiftKey
          && !event.altKey
        ) {
          onNavigate?.()
        }
      }}
      className={({ isActive }) =>
        cn(
          'block rounded-md px-2.5 py-1.5 font-sans text-sm transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  )
}

function NavigationContent({
  query,
  onQueryChange,
  onNavigate,
  idPrefix,
}: DeveloperNavigationProps & { onNavigate?: () => void; idPrefix: string }) {
  const results = query.trim() ? searchCatalog(query, { limit: 50 }) : []
  const searchId = `${idPrefix}-search`
  const searchResultsHeadingId = `${idPrefix}-search-results-heading`
  const foundationsHeadingId = `${idPrefix}-foundations-heading`
  const componentsHeadingId = `${idPrefix}-components-heading`
  const patternsHeadingId = `${idPrefix}-patterns-heading`

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={searchId} className="sr-only">Search the Developer catalogue</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search components…"
            className="h-9 w-full rounded-md border border-input bg-input-background pl-8 pr-3 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {query.trim() ? (
        <section aria-labelledby={searchResultsHeadingId}>
          <h2 id={searchResultsHeadingId} className="mb-2 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            Results · {results.length}
          </h2>
          {results.length ? (
            <nav className="space-y-0.5" aria-label="Developer search results">
              {results.map(({ document }) => (
                <DeveloperNavLink key={document.id} to={document.route} onNavigate={onNavigate}>
                  <span className="block truncate">{document.title}</span>
                  <span className="block truncate text-[0.6875rem] opacity-70">{document.kind} · {document.category}</span>
                </DeveloperNavLink>
              ))}
            </nav>
          ) : (
            <p className="rounded-md border border-dashed border-border p-3 font-sans text-xs leading-5 text-muted-foreground">
              No components, patterns, foundations, or deferred records match.
            </p>
          )}
        </section>
      ) : (
        <>
          <nav className="space-y-1" aria-label="Developer overview">
            <DeveloperNavLink to="/developer" onNavigate={onNavigate}>
              <span className="flex items-center gap-2"><Boxes className="size-4" aria-hidden="true" />Overview</span>
            </DeveloperNavLink>
          </nav>

          <section aria-labelledby={foundationsHeadingId}>
            <h2 id={foundationsHeadingId} className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              <Layers3 className="size-3.5" aria-hidden="true" />Foundations
            </h2>
            <nav className="space-y-0.5" aria-label="Developer foundations">
              {foundations.map((entry) => (
                <DeveloperNavLink key={entry.id} to={entry.route} onNavigate={onNavigate}>{entry.title}</DeveloperNavLink>
              ))}
            </nav>
          </section>

          <section aria-labelledby={componentsHeadingId}>
            <h2 id={componentsHeadingId} className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              <Boxes className="size-3.5" aria-hidden="true" />Components
            </h2>
            <div className="space-y-3">
              {componentCategories.map((category) => (
                <div key={category.id}>
                  <p className="mb-1 px-2.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground/80">
                    {category.title}
                  </p>
                  <nav className="space-y-0.5" aria-label={category.title + ' components'}>
                    {category.entries.map((entry) => (
                      <DeveloperNavLink key={entry.id} to={entry.route} onNavigate={onNavigate}>{entry.title}</DeveloperNavLink>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby={patternsHeadingId}>
            <h2 id={patternsHeadingId} className="mb-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">
              <FlaskConical className="size-3.5" aria-hidden="true" />Patterns
            </h2>
            <nav className="space-y-0.5" aria-label="Developer patterns">
              {recipes.map((entry) => (
                <DeveloperNavLink key={entry.id} to={entry.route} onNavigate={onNavigate}>{entry.title}</DeveloperNavLink>
              ))}
            </nav>
          </section>

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2.5 py-1.5 font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground hover:bg-muted">
              <ShieldQuestion className="size-3.5" aria-hidden="true" />
              Deferred · {deferredComponents.length}
            </summary>
            <nav className="mt-1 space-y-0.5" aria-label="Deferred component inventory">
              {deferredComponents.map((entry) => (
                <DeveloperNavLink key={entry.id} to={entry.route} onNavigate={onNavigate}>{entry.title}</DeveloperNavLink>
              ))}
            </nav>
          </details>
        </>
      )}
    </div>
  )
}

export function DeveloperNavigation({ query, onQueryChange }: DeveloperNavigationProps) {
  const mobileNavigationRef = useRef<HTMLDetailsElement>(null)

  return (
    <>
      <details ref={mobileNavigationRef} className="mb-6 rounded-xl border border-border bg-card p-4 lg:hidden">
        <summary className="cursor-pointer font-sans text-sm font-semibold text-foreground">
          Developer navigation
        </summary>
        <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1">
          <NavigationContent
            query={query}
            onQueryChange={onQueryChange}
            onNavigate={() => {
              if (mobileNavigationRef.current) mobileNavigationRef.current.open = false
            }}
            idPrefix="developer-mobile-navigation"
          />
        </div>
      </details>

      <aside className="hidden lg:block" aria-label="Developer catalogue navigation">
        <div className="sticky top-0 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border bg-card p-4">
          <NavigationContent
            query={query}
            onQueryChange={onQueryChange}
            idPrefix="developer-desktop-navigation"
          />
        </div>
      </aside>
    </>
  )
}
