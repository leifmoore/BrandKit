/// <reference types="vite/client" />

import { getBundledManifestRawSource } from './raw-sources'
import { getDeveloperRoute } from './routes'
import type {
  AccessibilitySummary,
  CatalogCategory,
  ComponentCatalogEntry,
  ComponentManifest,
  DeferredCatalogEntry,
  DeveloperCatalogEntry,
  FoundationCatalogEntry,
  HandoffPackage,
  HandoffCatalogIndex,
  ParitySummary,
  PatternHandoffCatalogIndex,
  PatternRecipeManifest,
  RecipeCatalogEntry,
  RecipeManifest,
  UtilityCatalogEntry,
} from './types'

function parseRawJson<T>(raw: string | undefined, path: string): T {
  if (typeof raw !== 'string') {
    throw new Error(`Required handoff manifest was not bundled: ${path}`)
  }

  try {
    return JSON.parse(raw) as T
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : ''
    throw new Error(`Invalid JSON in handoff manifest ${path}${detail}`)
  }
}

function readManifest<T>(
  handoffPath: string,
  sourcePackage: HandoffPackage = 'component-library',
): T {
  return parseRawJson<T>(
    getBundledManifestRawSource(handoffPath, sourcePackage),
    `${sourcePackage}:${handoffPath}`,
  )
}

const notApplicableAccessibility = Object.freeze<AccessibilitySummary>({
  applicable: false,
  target: null,
  status: 'not-applicable',
  findings: Object.freeze([]),
})

const notAuditedAccessibility = Object.freeze<AccessibilitySummary>({
  applicable: true,
  target: 'WCAG 2.2 AA',
  status: 'not-audited',
  findings: Object.freeze([]),
  note: 'The handoff does not declare an accessibility audit result for recipes.',
})

const notApplicableParity = Object.freeze<ParitySummary>({
  applicable: false,
  classification: 'not-applicable',
  intentionalDifferences: Object.freeze([]),
})

const unassessedParity = Object.freeze<ParitySummary>({
  applicable: false,
  classification: 'unassessed',
  intentionalDifferences: Object.freeze([]),
  note: 'Framework parity is not declared for Design System infrastructure.',
})

const pairedFrameworks = Object.freeze(['react', 'blade'] as const)
const noFrameworks = Object.freeze([] as const)

export const handoffCatalog = Object.freeze(
  readManifest<HandoffCatalogIndex>('catalog/catalog.json'),
)

export const patternHandoffCatalog = Object.freeze(
  readManifest<PatternHandoffCatalogIndex>(
    'catalog/catalog.json',
    'pattern-library',
  ),
)

export const catalogVersion = `${handoffCatalog.version}+patterns-${patternHandoffCatalog.version}`

const parsedComponentManifests = Object.fromEntries(
  handoffCatalog.components.map((indexEntry) => {
    const manifest = readManifest<ComponentManifest>(indexEntry.manifest)
    return [manifest.id, Object.freeze(manifest)]
  }),
) as Record<string, ComponentManifest>

const parsedRecipeManifests = Object.fromEntries(
  handoffCatalog.recipes.map((indexEntry) => {
    const manifest = readManifest<RecipeManifest>(indexEntry.manifest)
    return [manifest.id, Object.freeze(manifest)]
  }),
) as Record<string, RecipeManifest>

const parsedPatternRecipeManifests = Object.fromEntries(
  patternHandoffCatalog.patterns.map((indexEntry) => {
    const manifest = readManifest<PatternRecipeManifest>(
      indexEntry.manifest,
      'pattern-library',
    )
    return [manifest.id, Object.freeze(manifest)]
  }),
) as Record<string, PatternRecipeManifest>

const duplicateRecipeIds = handoffCatalog.recipes
  .map((entry) => entry.id)
  .filter((id) => Object.prototype.hasOwnProperty.call(parsedPatternRecipeManifests, id))

if (duplicateRecipeIds.length > 0) {
  throw new Error(
    `Duplicate recipe IDs across component and pattern handoffs: ${duplicateRecipeIds.join(', ')}`,
  )
}

export const componentManifests: Readonly<Record<string, ComponentManifest>> =
  Object.freeze(parsedComponentManifests)

export const recipeManifests: Readonly<
  Record<string, RecipeManifest | PatternRecipeManifest>
> =
  Object.freeze({ ...parsedRecipeManifests, ...parsedPatternRecipeManifests })

export const manifestsByPath: Readonly<
  Record<string, ComponentManifest | RecipeManifest | PatternRecipeManifest>
> = Object.freeze(
  Object.fromEntries([
    ...handoffCatalog.components.map((entry) => [
      `component-library:${entry.manifest}`,
      parsedComponentManifests[entry.id],
    ]),
    ...handoffCatalog.recipes.map((entry) => [
      `component-library:${entry.manifest}`,
      parsedRecipeManifests[entry.id],
    ]),
    ...patternHandoffCatalog.patterns.map((entry) => [
      `pattern-library:${entry.manifest}`,
      parsedPatternRecipeManifests[entry.id],
    ]),
  ]),
)

export const components: readonly ComponentCatalogEntry[] = Object.freeze(
  handoffCatalog.components.map((indexEntry): ComponentCatalogEntry => {
    const manifest = parsedComponentManifests[indexEntry.id]
    if (!manifest) {
      throw new Error(`Missing component manifest for ${indexEntry.id}`)
    }

    return Object.freeze({
      key: `component:${indexEntry.id}`,
      id: indexEntry.id,
      title: manifest.title,
      description: manifest.description,
      category: manifest.category,
      kind: 'component',
      maturity: manifest.maturity,
      availability: 'supported',
      frameworks: pairedFrameworks,
      searchTerms: Object.freeze([...manifest.searchTerms]),
      route: getDeveloperRoute('component', indexEntry.id),
      copyable: true,
      sourcePackage: 'component-library',
      accessibility: Object.freeze({
        applicable: true,
        target: manifest.accessibility.wcagTarget,
        status: manifest.accessibility.auditStatus,
        findings: manifest.accessibility.findings,
      }),
      parity: Object.freeze({
        applicable: true,
        classification: manifest.parity.classification,
        intentionalDifferences: manifest.parity.intentionalDifferences,
      }),
      manifestPath: indexEntry.manifest,
      documentationPath: `docs/components/${indexEntry.id}.md`,
      manifest,
    })
  }),
)

const baseRecipes: readonly RecipeCatalogEntry[] = Object.freeze(
  handoffCatalog.recipes.map((indexEntry): RecipeCatalogEntry => {
    const manifest = parsedRecipeManifests[indexEntry.id]
    if (!manifest) {
      throw new Error(`Missing recipe manifest for ${indexEntry.id}`)
    }

    return Object.freeze({
      key: `recipe:${indexEntry.id}`,
      id: indexEntry.id,
      title: manifest.title,
      description: manifest.description,
      category: manifest.category,
      kind: 'recipe',
      maturity: manifest.maturity,
      availability: 'supported',
      frameworks: pairedFrameworks,
      searchTerms: Object.freeze([...manifest.searchTerms]),
      route: getDeveloperRoute('recipe', indexEntry.id),
      copyable: true,
      sourcePackage: 'component-library',
      accessibility: notAuditedAccessibility,
      parity: Object.freeze({
        applicable: true,
        classification: manifest.contract.parity,
        intentionalDifferences: Object.freeze([]),
      }),
      manifestPath: indexEntry.manifest,
      documentationPath: manifest.documentation,
      fixturePath: manifest.fixture,
      manifest,
    })
  }),
)

const addOnRecipes: readonly RecipeCatalogEntry[] = Object.freeze(
  patternHandoffCatalog.patterns.map((indexEntry): RecipeCatalogEntry => {
    const manifest = parsedPatternRecipeManifests[indexEntry.id]
    if (!manifest) {
      throw new Error(`Missing add-on pattern manifest for ${indexEntry.id}`)
    }

    return Object.freeze({
      key: `recipe:${indexEntry.id}`,
      id: indexEntry.id,
      title: manifest.title,
      description: manifest.description,
      category: manifest.category,
      kind: 'recipe',
      maturity: manifest.maturity,
      availability: 'supported',
      frameworks: pairedFrameworks,
      searchTerms: Object.freeze([...manifest.searchTerms]),
      route: getDeveloperRoute('recipe', indexEntry.id),
      copyable: true,
      sourcePackage: 'pattern-library',
      accessibility: Object.freeze({
        applicable: true,
        target: 'WCAG 2.2 AA',
        status: manifest.accessibility.status,
        findings: Object.freeze([]),
        note: manifest.accessibility.findings.join(' '),
      }),
      parity: Object.freeze({
        applicable: true,
        classification: manifest.parity.classification === 'intentional-difference'
          ? 'documented-exception'
          : manifest.parity.classification,
        intentionalDifferences: Object.freeze([...manifest.parity.differences]),
      }),
      manifestPath: indexEntry.manifest,
      documentationPath: manifest.documentation,
      fixturePath: manifest.fixture,
      manifest,
    })
  }),
)

export const recipes: readonly RecipeCatalogEntry[] = Object.freeze([
  ...baseRecipes,
  ...addOnRecipes,
])

export const foundations: readonly FoundationCatalogEntry[] = Object.freeze(
  handoffCatalog.foundations.map((indexEntry): FoundationCatalogEntry =>
    Object.freeze({
      key: `foundation:${indexEntry.id}`,
      id: indexEntry.id,
      title: indexEntry.title,
      description: `${indexEntry.title} foundation guidance and canonical handoff assets.`,
      category: 'foundations',
      kind: 'foundation',
      maturity: 'foundation',
      availability: 'supported',
      frameworks: noFrameworks,
      searchTerms: Object.freeze([
        indexEntry.id,
        indexEntry.title,
        'foundation',
        'design system',
      ]),
      route: getDeveloperRoute('foundation', indexEntry.id),
      copyable: indexEntry.data.length > 0,
      sourcePackage: 'component-library',
      accessibility: notApplicableAccessibility,
      parity: notApplicableParity,
      documentationPath: indexEntry.documentation,
      dataPaths: Object.freeze([...indexEntry.data]),
    }),
  ),
)

export const deferredComponents: readonly DeferredCatalogEntry[] = Object.freeze(
  handoffCatalog.deferredComponents.map((indexEntry): DeferredCatalogEntry =>
    Object.freeze({
      key: `deferred:${indexEntry.id}`,
      id: indexEntry.id,
      title: indexEntry.title,
      description: indexEntry.reason,
      category: 'deferred',
      kind: 'deferred',
      maturity: 'deferred',
      availability: 'deferred',
      frameworks: noFrameworks,
      searchTerms: Object.freeze([
        indexEntry.id,
        indexEntry.title,
        'deferred',
        'not shipped',
      ]),
      route: getDeveloperRoute('deferred', indexEntry.id),
      copyable: false,
      sourcePackage: 'component-library',
      accessibility: notApplicableAccessibility,
      parity: notApplicableParity,
      documentationPath: `docs/components/${indexEntry.id}.md`,
      sourceReference: indexEntry.source,
      reason: indexEntry.reason,
      revisitWhen: indexEntry.revisitWhen,
    }),
  ),
)

export const utilities: readonly UtilityCatalogEntry[] = Object.freeze(
  handoffCatalog.utilities.map((indexEntry): UtilityCatalogEntry =>
    Object.freeze({
      key: `utility:${indexEntry.id}`,
      id: indexEntry.id,
      title: indexEntry.title,
      description: 'Design System preview infrastructure supplied by the handoff.',
      category: indexEntry.category,
      kind: 'utility',
      maturity: 'infrastructure',
      availability: 'infrastructure',
      frameworks: Object.freeze([...indexEntry.frameworks]),
      searchTerms: Object.freeze([...indexEntry.searchTerms]),
      route: getDeveloperRoute('utility', indexEntry.id),
      copyable: false,
      sourcePackage: 'component-library',
      accessibility: notApplicableAccessibility,
      parity: unassessedParity,
      manifestPath: indexEntry.manifest,
    }),
  ),
)

export const allCatalogEntries: readonly DeveloperCatalogEntry[] = Object.freeze([
  ...components,
  ...recipes,
  ...foundations,
  ...deferredComponents,
  ...utilities,
])

export const documentedCatalogEntries: readonly DeveloperCatalogEntry[] = Object.freeze([
  ...components,
  ...recipes,
  ...foundations,
  ...deferredComponents,
])

function toCategoryTitle(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function groupByCategory<TEntry extends DeveloperCatalogEntry>(
  entries: readonly TEntry[],
): readonly CatalogCategory<TEntry>[] {
  const grouped = new Map<string, TEntry[]>()

  for (const entry of entries) {
    const categoryEntries = grouped.get(entry.category) ?? []
    categoryEntries.push(entry)
    grouped.set(entry.category, categoryEntries)
  }

  return Object.freeze(
    [...grouped.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([id, categoryEntries]) =>
        Object.freeze({
          id,
          title: toCategoryTitle(id),
          count: categoryEntries.length,
          entries: Object.freeze(categoryEntries),
        }),
      ),
  )
}

export const componentCategories = groupByCategory(components)
export const recipeCategories = groupByCategory(recipes)

export const catalogCategories = Object.freeze({
  components: componentCategories,
  recipes: recipeCategories,
  foundations: groupByCategory(foundations),
  deferred: groupByCategory(deferredComponents),
})

export const handoffCounts = Object.freeze({ ...handoffCatalog.counts })

export const patternHandoffCounts = Object.freeze({ ...patternHandoffCatalog.counts })

export const catalogCounts = Object.freeze({
  components: components.length,
  paired: components.length,
  stable: components.filter((entry) => entry.maturity === 'stable').length,
  beta: components.filter((entry) => entry.maturity === 'beta').length,
  deferred: deferredComponents.length,
  recipes: recipes.length,
  foundations: foundations.length,
  utilities: utilities.length,
  supported: components.length + recipes.length + foundations.length,
  documented: documentedCatalogEntries.length,
  total: allCatalogEntries.length,
})

const entriesByKey = new Map(allCatalogEntries.map((entry) => [entry.key, entry]))

export function getCatalogEntry(
  kind: DeveloperCatalogEntry['kind'],
  id: string,
): DeveloperCatalogEntry | undefined {
  return entriesByKey.get(`${kind}:${id}`)
}

export function getComponent(id: string): ComponentCatalogEntry | undefined {
  return entriesByKey.get(`component:${id}`) as ComponentCatalogEntry | undefined
}

export function getDeferredComponent(id: string): DeferredCatalogEntry | undefined {
  return entriesByKey.get(`deferred:${id}`) as DeferredCatalogEntry | undefined
}

export function getComponentOrDeferred(
  id: string,
): ComponentCatalogEntry | DeferredCatalogEntry | undefined {
  return getComponent(id) ?? getDeferredComponent(id)
}

export function getRecipe(id: string): RecipeCatalogEntry | undefined {
  return entriesByKey.get(`recipe:${id}`) as RecipeCatalogEntry | undefined
}

export function getFoundation(id: string): FoundationCatalogEntry | undefined {
  return entriesByKey.get(`foundation:${id}`) as FoundationCatalogEntry | undefined
}

export function getComponentManifest(id: string): ComponentManifest | undefined {
  return componentManifests[id]
}

export function getRecipeManifest(
  id: string,
): RecipeManifest | PatternRecipeManifest | undefined {
  return recipeManifests[id]
}

export function getManifestByPath(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): ComponentManifest | RecipeManifest | PatternRecipeManifest | undefined {
  return manifestsByPath[`${sourcePackage}:${path}`]
}
