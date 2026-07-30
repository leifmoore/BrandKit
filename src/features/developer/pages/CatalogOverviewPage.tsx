import type { MouseEvent } from 'react'
import { ArrowRight, Boxes, Braces, Layers3 } from 'lucide-react'
import { DocSection, DeveloperPageHeader, PageState } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { SourceViewer } from '../docs/SourceViewer'
import { FrameworkBadge, MaturityBadge, StatusBadge } from '../docs/StatusBadges'
import type {
  CatalogEntryViewModel,
  CatalogOverviewViewModel,
  DeveloperEntryKind,
  DeveloperPageContentProps,
} from '../docs/types'

const kindOrder: readonly DeveloperEntryKind[] = ['component', 'recipe', 'foundation', 'deferred', 'utility']

const kindLabels: Record<DeveloperEntryKind, string> = {
  component: 'Components',
  deferred: 'Deferred inventory',
  recipe: 'Patterns',
  foundation: 'Foundations',
  utility: 'Utilities',
}

export interface CatalogEntryCardProps {
  entry: CatalogEntryViewModel
  onNavigate?: (entry: CatalogEntryViewModel) => void
}

export function CatalogEntryCard({ entry, onNavigate }: CatalogEntryCardProps) {
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
    <a
      href={entry.href}
      onClick={navigate}
      className="group flex min-h-52 flex-col rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {entry.maturity ? <MaturityBadge maturity={entry.maturity} /> : null}
        {entry.status && entry.status !== 'supported' ? <StatusBadge status={entry.status} /> : null}
        {entry.frameworks?.map((framework) => (
          <FrameworkBadge key={framework} framework={framework} />
        ))}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-caps text-muted-foreground">{entry.category}</p>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">{entry.title}</h3>
        </div>
        <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
      </div>
      <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-muted-foreground">
        {entry.description ?? `Open the ${entry.title} ${entry.kind} documentation.`}
      </p>
      <code className="mt-auto pt-5 font-mono text-xs text-muted-foreground">{entry.id}</code>
    </a>
  )
}

export interface CatalogOverviewPageProps extends DeveloperPageContentProps {
  catalog: CatalogOverviewViewModel
  onEntryNavigate?: (entry: CatalogEntryViewModel) => void
}

export function CatalogOverviewPage({
  catalog,
  preview,
  sources = [],
  onEntryNavigate,
}: CatalogOverviewPageProps) {
  const groupedEntries = kindOrder
    .map((kind) => ({ kind, entries: catalog.entries.filter((entry) => entry.kind === kind) }))
    .filter((group) => group.entries.length > 0)

  return (
    <article>
      <DeveloperPageHeader
        eyebrow="Developer"
        title={catalog.name}
        description={catalog.description}
        badges={
          <>
            <span className="inline-flex min-h-6 items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground">
              v{catalog.version}
            </span>
            {catalog.releaseStatus ? (
              <span className="inline-flex min-h-6 items-center rounded-full border border-emerald-600/25 bg-emerald-600/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {catalog.releaseStatus}
              </span>
            ) : null}
          </>
        }
      />

      <DocSection id="release" title="Release at a glance" description="The catalogue is manifest-driven: counts and routes should come from the maintained index, not scraped Markdown.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.counts.map((count) => (
            <div key={count.label} className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-3xl font-bold text-foreground">{count.value}</p>
              <p className="mt-1 font-sans text-sm font-semibold text-foreground">{count.label}</p>
              {count.description ? <p className="mt-2 font-sans text-xs leading-5 text-muted-foreground">{count.description}</p> : null}
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="stacks" title="Supported stacks" description="React is the live documentation runtime; Blade remains a copyable, parity-validated source edition.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <Braces className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">React</h3>
            <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">Live previews, TypeScript source, fixtures, and component APIs.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Layers3 className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">Blade</h3>
            <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">Source-only examples, canonical tags, slots, events, and Laravel install targets.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Boxes className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">Copy-only v1</h3>
            <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">No hosted registry or remote code execution. Review and copy the supplied files into the consumer.</p>
          </div>
        </div>
      </DocSection>

      {preview ? (
        <DocSection id="playground" title="Interactive playground" description="Explore a live React example without changing the host Brand Kit theme.">
          {preview}
        </DocSection>
      ) : null}

      {catalog.installation ? (
        <DocSection id="installation" title="Installation" description="Start with the supported copy workflow and preserve the documented style loading order.">
          <SafeMarkdown markdown={catalog.installation} />
        </DocSection>
      ) : null}

      <DocSection id="catalogue" title="Catalogue" description="Supported components, patterns, foundations, utilities, and explicitly deferred inventory.">
        {groupedEntries.length > 0 ? (
          <div className="space-y-10">
            {groupedEntries.map((group) => (
              <section key={group.kind} aria-labelledby={`catalog-${group.kind}`}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 id={`catalog-${group.kind}`} className="font-display text-xl font-bold text-foreground">
                    {kindLabels[group.kind]}
                  </h3>
                  <span className="font-sans text-xs text-muted-foreground">{group.entries.length} entries</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {group.entries.map((entry) => (
                    <CatalogEntryCard key={`${entry.kind}-${entry.id}`} entry={entry} onNavigate={onEntryNavigate} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <PageState kind="empty" title="No catalogue results" description="No entries match the current catalogue selection." />
        )}
      </DocSection>

      {sources.length > 0 ? (
        <DocSection id="starter-source" title="Starter source" description="Release-level source and installation examples loaded directly from the handoff.">
          <SourceViewer files={sources} />
        </DocSection>
      ) : null}
    </article>
  )
}
