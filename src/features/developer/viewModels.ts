import type {
  ComponentCatalogEntry,
  DeferredCatalogEntry,
  DeveloperCatalogEntry,
  FoundationCatalogEntry,
  HandoffSource,
  RecipeCatalogEntry,
} from './catalog'
import type {
  AccessibilityViewModel,
  CatalogEntryViewModel,
  CatalogOverviewViewModel,
  ComponentDetailViewModel,
  DeferredDetailViewModel,
  DependencyViewModel,
  FoundationDetailViewModel,
  FrameworkContractViewModel,
  PropViewModel,
  RecipeDetailViewModel,
  SourceFileViewModel,
  SourceFramework,
} from './docs'

function sourceFramework(path: string): SourceFramework {
  if (path.startsWith('react/') || /\/react\//.test(path)) return 'react'
  if (path.startsWith('blade/') || /\/blade\//.test(path)) return 'blade'
  return 'shared'
}

function sourceKind(path: string): SourceFileViewModel['kind'] {
  if (path.endsWith('.md')) return 'documentation'
  if (/\/fixtures?\//.test(path)) return 'fixture'
  if (/\/examples?\//.test(path)) return 'example'
  if (/\.(json|css)$/.test(path)) return 'data'
  return 'implementation'
}

export function toSourceViewModels(
  sources: readonly HandoffSource[],
  copyable = true,
): readonly SourceFileViewModel[] {
  return sources.map((source) => ({
    id: source.path,
    path: source.path,
    content: source.content,
    framework: sourceFramework(source.path),
    kind: sourceKind(source.path),
    language: source.language,
    copyable,
  }))
}

function toProps(
  props: readonly {
    name: string
    type: string
    required: boolean
    default?: unknown
    description?: string
  }[],
): readonly PropViewModel[] {
  return props.map((prop) => ({
    name: prop.name,
    type: prop.type,
    required: prop.required,
    defaultValue: prop.default,
    description: prop.description,
  }))
}

function toAccessibility(
  entry: ComponentCatalogEntry,
): AccessibilityViewModel {
  return {
    target: entry.manifest.accessibility.wcagTarget,
    auditStatus: entry.manifest.accessibility.auditStatus,
    findings: entry.manifest.accessibility.findings,
  }
}

function componentContracts(
  entry: ComponentCatalogEntry,
): readonly FrameworkContractViewModel[] {
  return [
    {
      framework: 'react',
      exports: entry.manifest.react.exports,
      props: toProps(entry.manifest.react.props),
    },
    {
      framework: 'blade',
      canonicalTag: entry.manifest.blade.canonicalTag,
      compatibilityTags: entry.manifest.blade.legacyTags,
      props: toProps(entry.manifest.blade.props),
      slots: entry.manifest.blade.slots,
      events: entry.manifest.blade.events,
      installTargets: entry.manifest.blade.installTargets,
    },
  ]
}

function componentDependencies(
  entry: ComponentCatalogEntry,
): readonly DependencyViewModel[] {
  const reactPackages = entry.manifest.react.npmDependencies.map((dependency) => ({
    ...dependency,
    framework: 'react' as const,
    scope: 'npm' as const,
  }))
  const reactInternal = entry.manifest.react.internalDependencies.map((name) => ({
    name,
    framework: 'react' as const,
    scope: 'internal' as const,
    purpose: 'Canonical component dependency',
  }))
  const bladeRuntime = entry.manifest.blade.runtimeDependencies.map((dependency) => ({
    ...dependency,
    framework: 'blade' as const,
    scope: 'runtime' as const,
  }))
  const bladePhp = entry.manifest.blade.phpDependencies.map((name) => ({
    name,
    framework: 'blade' as const,
    scope: 'php' as const,
  }))
  return [...reactPackages, ...reactInternal, ...bladeRuntime, ...bladePhp]
}

export function toComponentViewModel(
  entry: ComponentCatalogEntry,
  documentation?: string,
): ComponentDetailViewModel {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    maturity: entry.maturity,
    status: 'supported',
    frameworks: entry.frameworks,
    documentation,
    variants: entry.manifest.shared.variants,
    sizes: entry.manifest.shared.sizes,
    states: entry.manifest.shared.states,
    responsiveBehavior: entry.manifest.shared.responsiveBehavior,
    tokens: entry.manifest.shared.tokens,
    contracts: componentContracts(entry),
    dependencies: componentDependencies(entry),
    accessibility: toAccessibility(entry),
    parity: entry.manifest.parity,
  }
}

export function toRecipeViewModel(
  entry: RecipeCatalogEntry,
  documentation?: string,
): RecipeDetailViewModel {
  if (entry.sourcePackage === 'pattern-library' && 'scenarios' in entry.manifest) {
    const manifest = entry.manifest
    const dependencies: DependencyViewModel[] = [
      ...manifest.dependencies.internal.map((name) => ({
        name,
        framework: 'react' as const,
        scope: 'internal' as const,
        purpose: 'Scudamore’s UI component dependency',
      })),
      ...manifest.dependencies.npm.map((name) => ({
        name,
        framework: 'react' as const,
        scope: 'npm' as const,
      })),
      ...manifest.dependencies.bladeRuntime.map((name) => ({
        name,
        framework: 'blade' as const,
        scope: 'runtime' as const,
      })),
    ]

    return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      category: entry.category,
      maturity: entry.maturity,
      status: 'supported',
      frameworks: entry.frameworks,
      documentation,
      contract: toProps([
        ...(manifest.contract.inputs ?? []),
        ...(manifest.contract.callbacks ?? []),
      ]),
      contractDetails: {
        support: manifest.contract.support,
        standaloneApi: manifest.contract.standaloneApi,
        fixturePolicy: manifest.contract.fixturePolicy,
        hostResponsibilities: manifest.contract.hostResponsibilities,
      },
      dependencies,
      responsiveBehavior: manifest.responsiveBehavior,
      accessibility: {
        target: 'WCAG 2.2 AA',
        auditStatus: manifest.accessibility.status,
        findings: manifest.accessibility.findings.map((finding, index) => ({
          id: `${manifest.id}-finding-${index + 1}`,
          summary: finding,
        })),
      },
      parity: {
        classification: manifest.parity.classification === 'intentional-difference'
          ? 'documented-exception'
          : manifest.parity.classification,
        intentionalDifferences: manifest.parity.differences,
      },
    }
  }

  const baseManifest = entry.manifest
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    maturity: entry.maturity,
    status: 'supported',
    frameworks: entry.frameworks,
    documentation,
    contract: [],
    contractDetails: {
      support: baseManifest.contract.support,
      standaloneApi: baseManifest.contract.standaloneApi,
      fixturePolicy: baseManifest.contract.fixturePolicy,
    },
    dependencies: [],
    parity: {
      classification: 'parity' in baseManifest.contract
        ? baseManifest.contract.parity
        : 'documented-exception',
      intentionalDifferences: [],
    },
  }
}

export function toFoundationViewModel(
  entry: FoundationCatalogEntry,
  documentation?: string,
): FoundationDetailViewModel {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    documentation,
    dataFiles: entry.dataPaths,
  }
}

export function toDeferredViewModel(
  entry: DeferredCatalogEntry,
): DeferredDetailViewModel {
  return {
    id: entry.id,
    title: entry.title,
    source: entry.sourceReference,
    reason: entry.reason,
    revisitWhen: entry.revisitWhen,
    description: entry.description,
    category: 'Deferred inventory',
  }
}

export function toCatalogEntryViewModel(entry: DeveloperCatalogEntry): CatalogEntryViewModel {
  const kind = entry.kind === 'deferred' ? 'deferred' : entry.kind
  const searchTerms = entry.kind === 'recipe'
    && entry.sourcePackage === 'pattern-library'
    && 'scenarios' in entry.manifest
    ? [
        ...entry.searchTerms,
        ...entry.manifest.contract.hostResponsibilities,
        ...(entry.manifest.contract.inputs ?? []).flatMap((input) => [input.name, input.type]),
        ...(entry.manifest.contract.callbacks ?? []).flatMap((callback) => [callback.name, callback.type]),
        ...entry.manifest.dependencies.internal,
        ...entry.manifest.dependencies.npm,
        ...entry.manifest.dependencies.bladeRuntime,
        ...entry.manifest.responsiveBehavior,
        ...entry.manifest.accessibility.findings,
        ...entry.manifest.parity.differences,
        ...entry.manifest.scenarios.flatMap((scenario) => [
          scenario.id,
          scenario.title,
          scenario.description ?? '',
          ...(scenario.states ?? []),
        ]),
      ]
    : entry.searchTerms
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    href: entry.route,
    category: entry.category,
    kind,
    maturity:
      entry.maturity === 'stable' ||
      entry.maturity === 'beta' ||
      entry.maturity === 'infrastructure'
        ? entry.maturity
        : undefined,
    status: entry.kind === 'deferred' ? 'deferred' : 'supported',
    frameworks: entry.frameworks,
    searchTerms,
  }
}

export function toCatalogOverviewViewModel(
  entries: readonly DeveloperCatalogEntry[],
  counts: {
    components: number
    stable: number
    beta: number
    deferred: number
    recipes: number
    foundations: number
  },
  version: string,
  name: string,
  installation?: string,
): CatalogOverviewViewModel {
  return {
    name,
    version,
    description:
      'Interactive, paired React and Blade documentation generated from the verified Scudamore’s UI base handoff and its separate Pattern Library add-on.',
    releaseStatus: 'Validated sibling handoffs',
    counts: [
      { label: 'Paired components', value: counts.components, description: 'Interactive React previews with matching Blade source.' },
      { label: 'Stable', value: counts.stable, description: 'Supported components ready for product use.' },
      { label: 'Beta', value: counts.beta, description: 'Supported components with a narrower maturity contract.' },
      { label: 'Patterns', value: counts.recipes, description: 'Fixture-driven product compositions.' },
      { label: 'Foundations', value: counts.foundations, description: 'Tokens, brands, typography, layout, icons, and exceptions.' },
      { label: 'Deferred', value: counts.deferred, description: 'Inventoried entries with no preview or copy actions.' },
    ],
    entries: entries.map(toCatalogEntryViewModel),
    installation,
  }
}
