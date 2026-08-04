import { DocSection, DeveloperPageHeader, MetadataList, PageState } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { SourceViewer } from '../docs/SourceViewer'
import type { DeveloperPageContentProps, FoundationDetailViewModel } from '../docs/types'

export interface FoundationPageProps extends DeveloperPageContentProps {
  foundation: FoundationDetailViewModel
}

export function FoundationPage({ foundation, preview, sources = [] }: FoundationPageProps) {
  return (
    <article>
      <DeveloperPageHeader
        eyebrow="Design System foundation"
        title={foundation.title}
        description={foundation.description}
        metadata={
          <MetadataList
            items={[
              { label: 'Foundation ID', value: <code className="font-mono text-xs">{foundation.id}</code> },
              { label: 'Maintained data', value: foundation.dataFiles?.length ? foundation.dataFiles.join(', ') : 'Documentation only' },
              { label: 'Availability', value: 'React and Blade consumers' },
            ]}
          />
        }
      />

      <DocSection id="overview" title="Overview" description="Canonical guidance from the handoff; raw HTML is displayed as text and is never injected into the Brand Kit.">
        <SafeMarkdown markdown={foundation.documentation ?? foundation.description} />
        {foundation.id === 'tokens' ? (
          <aside className="mt-6 rounded-lg border border-amber-600/25 bg-amber-500/5 p-4" aria-labelledby="destination-token-correction-heading">
            <h3 id="destination-token-correction-heading" className="font-sans text-sm font-semibold text-foreground">
              Destination accessibility correction
            </h3>
            <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
              The 0.1.0 <code className="font-mono text-xs">muted-foreground</code> values miss AA on some muted and popover surfaces. This destination uses <code className="font-mono text-xs">#626b7b</code> in light mode for 4.88:1 and <code className="font-mono text-xs">#b0b8c4</code> in dark mode for 5.15:1. Apply equivalent reviewed overrides when copying the immutable token data into a consumer.
            </p>
          </aside>
        ) : null}
      </DocSection>

      {preview ? (
        <DocSection id="example" title="Interactive example" description="A visual reference driven by the maintained foundation data.">
          {preview}
        </DocSection>
      ) : null}

      {foundation.principles?.length ? (
        <DocSection id="principles" title="Working principles" description="Portable rules to apply when authoring components and product interfaces.">
          <ul className="grid gap-3 md:grid-cols-2">
            {foundation.principles.map((principle) => (
              <li key={principle} className="rounded-lg border border-border bg-card p-4 font-sans text-sm leading-6 text-muted-foreground">
                {principle}
              </li>
            ))}
          </ul>
        </DocSection>
      ) : null}

      <DocSection id="source" title="Foundation source" description="Maintained data and generated artefacts can be copied into a consumer project without a registry.">
        {sources.length > 0 ? (
          <SourceViewer files={sources} />
        ) : (
          <PageState kind="empty" title="Source unavailable" description="No foundation source files were supplied to this view." />
        )}
      </DocSection>
    </article>
  )
}
