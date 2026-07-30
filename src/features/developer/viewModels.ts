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
  if (/\/examples?\//.test(path)) return 'example'
  if (/\.(json|css)$/.test(path) || /\/fixtures?\//.test(path)) return 'data'
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
      support: entry.manifest.contract.support,
      standaloneApi: entry.manifest.contract.standaloneApi,
      fixturePolicy: entry.manifest.contract.fixturePolicy,
    },
    dependencies: [],
    parity: {
      classification: entry.manifest.contract.parity,
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
    searchTerms: entry.searchTerms,
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
      'Interactive, paired React and Blade documentation generated from the verified Scudamore\'s UI handoff.',
    releaseStatus: 'Validated handoff',
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
