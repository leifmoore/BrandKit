import { PropsTable, AccessibilityPanel, DependenciesPanel, ParityPanel } from '../docs/ContractPanels'
import { DocSection, DeveloperPageHeader, MetadataList } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { Workbench, type DocumentationSection } from '../docs/Workbench'
import { FrameworkBadge, MaturityBadge, StatusBadge } from '../docs/StatusBadges'
import type { DeveloperPageContentProps, RecipeDetailViewModel } from '../docs/types'

export interface RecipePageProps extends DeveloperPageContentProps {
  recipe: RecipeDetailViewModel
}

export function RecipePage({ recipe, preview, sources = [] }: RecipePageProps) {
  const contractFacts = [
    recipe.contractDetails?.support
      ? { label: 'Support model', value: recipe.contractDetails.support }
      : null,
    recipe.contractDetails?.standaloneApi !== undefined
      ? { label: 'Standalone API', value: recipe.contractDetails.standaloneApi ? 'Yes' : 'No' }
      : null,
    recipe.contractDetails?.fixturePolicy
      ? { label: 'Fixture policy', value: recipe.contractDetails.fixturePolicy }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null)

  const documentation: DocumentationSection[] = [
    {
      id: 'guidance',
      label: 'Guidance',
      description: 'Composition guidance, host responsibilities, and fixture assumptions.',
      content: <SafeMarkdown markdown={recipe.documentation ?? recipe.description} />,
    },
    {
      id: 'api',
      label: 'API',
      description: 'Neutral fixture inputs and callbacks the host must provide.',
      content: (
        <>
          {contractFacts.length > 0 ? <MetadataList items={contractFacts} className="mb-5" /> : null}
          <PropsTable props={recipe.contract ?? []} />
        </>
      ),
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      description: 'Packages and component primitives required by this composition.',
      content: <DependenciesPanel dependencies={recipe.dependencies ?? []} />,
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      description: 'Recorded recipe-level behaviour and audit findings.',
      content: recipe.accessibility ? (
        <AccessibilityPanel accessibility={recipe.accessibility} />
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm leading-6 text-muted-foreground">
          No separate recipe audit is declared. Apply every composed component contract and verify the interaction as a whole.
        </p>
      ),
    },
    {
      id: 'parity',
      label: 'Parity',
      description: 'Framework-specific orchestration and intentional differences.',
      content: recipe.parity ? (
        <ParityPanel parity={recipe.parity} />
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm leading-6 text-muted-foreground">
          No recipe-level parity classification was supplied. Do not infer parity from visual similarity alone.
        </p>
      ),
    },
  ]

  return (
    <article>
      <DeveloperPageHeader
        eyebrow={`Design System pattern · ${recipe.category}`}
        title={recipe.title}
        description={recipe.description}
        compact
        badges={
          <>
            <MaturityBadge maturity={recipe.maturity} />
            <StatusBadge status={recipe.status ?? 'supported'} />
            {recipe.frameworks.map((framework) => (
              <FrameworkBadge key={framework} framework={framework} />
            ))}
          </>
        }
      />

      <Workbench title={recipe.title} preview={preview} sources={sources} documentation={documentation} />

      <DocSection id="usage" title="Usage" description="Host responsibilities remain visible while the detailed record lives in Documentation.">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm leading-6 text-muted-foreground">{recipe.description}</p>
          {contractFacts.length > 0 ? <MetadataList items={contractFacts} className="mt-5" /> : null}
        </div>
      </DocSection>
    </article>
  )
}
