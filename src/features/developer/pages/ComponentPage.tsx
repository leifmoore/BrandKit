import { DocSection, DeveloperPageHeader } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { FrameworkBadge, MaturityBadge, StatusBadge } from '../docs/StatusBadges'
import {
  AccessibilityPanel,
  DependenciesPanel,
  FrameworkContracts,
  OptionsPanel,
  ParityPanel,
} from '../docs/ContractPanels'
import { Workbench, type DocumentationSection } from '../docs/Workbench'
import type { ComponentDetailViewModel, DeveloperPageContentProps } from '../docs/types'

export interface ComponentPageProps extends DeveloperPageContentProps {
  component: ComponentDetailViewModel
}

export function ComponentPage({ component, preview, sources = [] }: ComponentPageProps) {
  const documentation: DocumentationSection[] = [
    {
      id: 'guidance',
      label: 'Guidance',
      description: 'Purpose, usage guidance, and maintained handoff notes.',
      content: <SafeMarkdown markdown={component.documentation ?? component.description} />,
    },
    {
      id: 'api',
      label: 'API',
      description: 'Public APIs for both distributable framework editions.',
      content: (
        <>
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
        </>
      ),
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      description: 'Exact package, runtime, and internal requirements declared by the manifest.',
      content: <DependenciesPanel dependencies={component.dependencies} />,
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      description: 'The target, audit status, and every recorded finding.',
      content: <AccessibilityPanel accessibility={component.accessibility} />,
    },
    {
      id: 'parity',
      label: 'Parity',
      description: 'Intentional React and Blade differences. An unrecorded difference is a defect.',
      content: <ParityPanel parity={component.parity} />,
    },
  ]

  return (
    <article>
      <DeveloperPageHeader
        eyebrow={`Design System · ${component.category}`}
        title={component.title}
        description={component.description}
        compact
        badges={
          <>
            <MaturityBadge maturity={component.maturity} />
            <StatusBadge status={component.status ?? 'supported'} />
            {component.frameworks.map((framework) => (
              <FrameworkBadge key={framework} framework={framework} />
            ))}
          </>
        }
      />

      <Workbench title={component.title} preview={preview} sources={sources} documentation={documentation} />

      <DocSection id="usage" title="Usage" description="The essential contract stays visible below the workbench; open Documentation for the complete record.">
        <div className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">Use {component.title} for</h3>
            <p className="mt-2 max-w-3xl font-sans text-sm leading-6 text-muted-foreground">{component.description}</p>
            {component.responsiveBehavior?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 font-sans text-sm leading-6 text-muted-foreground">
                {component.responsiveBehavior.map((behavior) => <li key={behavior}>{behavior}</li>)}
              </ul>
            ) : null}
          </div>
          <dl className="grid content-start gap-2 text-xs md:min-w-48">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Catalogue ID</dt><dd><code className="font-mono">{component.id}</code></dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Maturity</dt><dd className="capitalize">{component.maturity}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Frameworks</dt><dd>React + Blade</dd></div>
          </dl>
        </div>
      </DocSection>
    </article>
  )
}
