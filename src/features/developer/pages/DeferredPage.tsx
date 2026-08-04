import { Archive, EyeOff } from 'lucide-react'
import { DocSection, DeveloperPageHeader, MetadataList } from '../docs/PageScaffold'
import { StatusBadge } from '../docs/StatusBadges'
import type { DeferredDetailViewModel, DeveloperPageContentProps } from '../docs/types'

export interface DeferredPageProps extends DeveloperPageContentProps {
  item: DeferredDetailViewModel
}

/** Inventory-only records deliberately ignore `preview` and `sources`. */
export function DeferredPage({ item }: DeferredPageProps) {
  return (
    <article>
      <DeveloperPageHeader
        eyebrow="Design System roadmap"
        title={item.title}
        description={item.description ?? 'This component is inventoried but is not distributable in the current release.'}
        badges={<StatusBadge status="deferred" />}
        metadata={
          <MetadataList
            items={[
              { label: 'Catalogue ID', value: <code className="font-mono text-xs">{item.id}</code> },
              { label: 'Category', value: item.category ?? 'Deferred inventory' },
              { label: 'Source evidence', value: <code className="break-all font-mono text-xs">{item.source}</code> },
            ]}
          />
        }
      />

      <DocSection id="status" title="Why it is deferred" description="Deferred means inventoried, not supported or copyable.">
        <div className="flex items-start gap-4 rounded-xl border border-amber-600/25 bg-amber-500/5 p-5">
          <Archive className="mt-0.5 size-6 shrink-0 text-amber-800 dark:text-amber-300" aria-hidden="true" />
          <p className="font-sans text-sm leading-7 text-foreground">{item.reason}</p>
        </div>
      </DocSection>

      <DocSection id="revisit" title="Revisit when" description="The product evidence required before this item can enter the paired component library.">
        <p className="rounded-xl border border-border bg-card p-5 font-sans text-sm leading-7 text-foreground">
          {item.revisitWhen}
        </p>
      </DocSection>

      <DocSection id="availability" title="Availability" description="The v1 security and support boundary applies to this record.">
        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-5">
          <EyeOff className="mt-0.5 size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-sans text-sm font-semibold text-foreground">Preview and copy actions are unavailable</p>
            <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
              Source metadata remains visible for roadmap context, but no live preview, install control, source tab, copy action, or download is exposed.
            </p>
          </div>
        </div>
      </DocSection>
    </article>
  )
}
