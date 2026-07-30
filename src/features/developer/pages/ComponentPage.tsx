import { DocSection, DeveloperPageHeader, MetadataList, PageState } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { FrameworkBadge, MaturityBadge, StatusBadge } from '../docs/StatusBadges'
import {
  AccessibilityPanel,
  DependenciesPanel,
  FrameworkContracts,
  OptionsPanel,
  ParityPanel,
} from '../docs/ContractPanels'
import { SourceViewer } from '../docs/SourceViewer'
import type { ComponentDetailViewModel, DeveloperPageContentProps } from '../docs/types'

export interface ComponentPageProps extends DeveloperPageContentProps {
  component: ComponentDetailViewModel
}

export function ComponentPage({ component, preview, sources = [] }: ComponentPageProps) {
  return (
    <article>
      <DeveloperPageHeader
        eyebrow={`Developer · ${component.category}`}
        title={component.title}
        description={component.description}
        badges={
          <>
            <MaturityBadge maturity={component.maturity} />
            <StatusBadge status={component.status ?? 'supported'} />
            {component.frameworks.map((framework) => (
              <FrameworkBadge key={framework} framework={framework} />
            ))}
          </>
        }
        metadata={
          <MetadataList
            items={[
              { label: 'Catalogue ID', value: <code className="font-mono text-xs">{component.id}</code> },
              { label: 'Category', value: component.category },
              { label: 'Frameworks', value: component.frameworks.map((framework) => framework === 'react' ? 'React' : 'Blade').join(' + ') },
            ]}
          />
        }
      />

      <DocSection id="overview" title="Overview" description="Purpose, usage guidance, and the maintained handoff notes.">
        <SafeMarkdown markdown={component.documentation ?? component.description} />
      </DocSection>

      <DocSection id="example" title="Interactive example" description="The React edition is the live visual target. Use the preview controls to inspect supported themes, widths, direction, and states.">
        {preview ?? (
          <PageState
            kind="empty"
            title="Preview unavailable"
            description="The live React example could not be mounted. The source and contract remain available below."
          />
        )}
      </DocSection>

      <DocSection id="source" title="Source" description="Displayed source is loaded from the handoff files. Copy and download preserve the supplied text byte-for-byte.">
        <SourceViewer files={sources} />
      </DocSection>

      <DocSection id="api" title="Props and contract" description="Public APIs for both distributable framework editions.">
        <FrameworkContracts contracts={component.contracts} />
        <OptionsPanel
          groups={[
            { label: 'Variants', values: component.variants ?? [] },
            { label: 'Sizes', values: component.sizes ?? [] },
            { label: 'States', values: component.states ?? [] },
            { label: 'Responsive behaviour', values: component.responsiveBehavior ?? [] },
            { label: 'Semantic tokens', values: component.tokens ?? [] },
          ]}
        />
      </DocSection>

      <DocSection id="dependencies" title="Dependencies" description="Exact package, runtime, and internal requirements declared by the manifest.">
        <DependenciesPanel dependencies={component.dependencies} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility" description="The target, current audit status, and every recorded finding remain visible at the point of use.">
        <AccessibilityPanel accessibility={component.accessibility} />
      </DocSection>

      <DocSection id="parity" title="React and Blade parity" description="Intentional differences belong here; an unrecorded difference is a defect.">
        <ParityPanel parity={component.parity} />
      </DocSection>
    </article>
  )
}
