import { PropsTable, AccessibilityPanel, DependenciesPanel, ParityPanel } from '../docs/ContractPanels'
import { DocSection, DeveloperPageHeader, MetadataList, PageState } from '../docs/PageScaffold'
import { SafeMarkdown } from '../docs/SafeMarkdown'
import { SourceViewer } from '../docs/SourceViewer'
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

  return (
    <article>
      <DeveloperPageHeader
        eyebrow={`Developer pattern · ${recipe.category}`}
        title={recipe.title}
        description={recipe.description}
        badges={
          <>
            <MaturityBadge maturity={recipe.maturity} />
            <StatusBadge status={recipe.status ?? 'supported'} />
            {recipe.frameworks.map((framework) => (
              <FrameworkBadge key={framework} framework={framework} />
            ))}
          </>
        }
        metadata={
          <MetadataList
            items={[
              { label: 'Recipe ID', value: <code className="font-mono text-xs">{recipe.id}</code> },
              { label: 'Category', value: recipe.category },
              { label: 'Frameworks', value: recipe.frameworks.map((framework) => framework === 'react' ? 'React' : 'Blade').join(' + ') },
            ]}
          />
        }
      />

      <DocSection id="overview" title="Overview" description="Composition guidance, host responsibilities, and fixture assumptions.">
        <SafeMarkdown markdown={recipe.documentation ?? recipe.description} />
      </DocSection>

      <DocSection id="example" title="Interactive example" description="The React recipe runs against neutral fixture data; host navigation, permissions, and fetching stay outside the pattern.">
        {preview ?? (
          <PageState
            kind="empty"
            title="Preview unavailable"
            description="The fixture-driven React example could not be mounted. Its source contract remains available below."
          />
        )}
      </DocSection>

      <DocSection id="source" title="Source" description="React and Blade examples are loaded directly from the handoff and are never evaluated in this documentation view.">
        <SourceViewer files={sources} />
      </DocSection>

      <DocSection id="contract" title="Props and fixture contract" description="The neutral inputs and callbacks the host must provide.">
        {contractFacts.length > 0 ? <MetadataList items={contractFacts} className="mb-5" /> : null}
        <PropsTable props={recipe.contract ?? []} />
      </DocSection>

      <DocSection id="dependencies" title="Dependencies" description="Packages and component primitives required by this composition.">
        <DependenciesPanel dependencies={recipe.dependencies ?? []} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility" description="Recorded recipe-level behaviour and audit findings.">
        {recipe.accessibility ? (
          <AccessibilityPanel accessibility={recipe.accessibility} />
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm leading-6 text-muted-foreground">
            No separate recipe audit is declared. Apply the accessibility contracts of every composed component and verify the fixture-driven interaction as a whole.
          </p>
        )}
      </DocSection>

      <DocSection id="parity" title="React and Blade parity" description="Framework-specific orchestration remains explicit.">
        {recipe.parity ? (
          <ParityPanel parity={recipe.parity} />
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 font-sans text-sm leading-6 text-muted-foreground">
            No recipe-level parity classification was supplied to this view. Do not infer parity from visual similarity alone.
          </p>
        )}
      </DocSection>
    </article>
  )
}
