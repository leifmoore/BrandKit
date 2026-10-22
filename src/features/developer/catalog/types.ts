export type Framework = 'react' | 'blade'

export type HandoffPackage = 'component-library' | 'pattern-library'

export type ComponentCategory =
  | 'actions'
  | 'data-display'
  | 'disclosure'
  | 'feedback'
  | 'forms'
  | 'layout'
  | 'navigation'
  | 'overlays'

export type Maturity =
  | 'stable'
  | 'beta'
  | 'foundation'
  | 'deferred'
  | 'infrastructure'

export type Availability = 'supported' | 'deferred' | 'infrastructure'

export type CatalogKind =
  | 'component'
  | 'recipe'
  | 'foundation'
  | 'deferred'
  | 'utility'

export type AuditStatus =
  | 'pending'
  | 'passed'
  | 'passed-with-findings'
  | 'failed'
  | 'not-audited'
  | 'not-applicable'

export type ParityClassification =
  | 'exact'
  | 'framework-equivalent'
  | 'documented-exception'
  | 'not-applicable'
  | 'unassessed'

export interface NamedOption {
  readonly name: string
  readonly description?: string
  readonly default?: boolean
}

export interface ManifestProp {
  readonly name: string
  readonly type: string
  readonly required: boolean
  readonly default?: unknown
  readonly description?: string
}

export interface ManifestDependency {
  readonly name: string
  readonly version: string
  readonly purpose?: string
}

export interface SourceProvenanceFile {
  readonly path: string
  readonly sha256: string
}

export interface SourceProvenance {
  readonly commit: string
  readonly verifiedAt: string
  readonly files: readonly SourceProvenanceFile[]
  readonly decisionReferences: readonly string[]
}

export interface AccessibilityFinding {
  readonly id: string
  readonly severity: 'minor' | 'moderate' | 'serious' | 'critical'
  readonly status: 'open' | 'accepted' | 'fixed'
  readonly summary: string
  readonly detail?: string
}

export interface ComponentAccessibility {
  readonly wcagTarget: 'WCAG 2.2 AA'
  readonly auditStatus: Exclude<AuditStatus, 'not-audited' | 'not-applicable'>
  readonly findings: readonly AccessibilityFinding[]
}

export interface AccessibilitySummary {
  readonly applicable: boolean
  readonly target: 'WCAG 2.2 AA' | null
  readonly status: AuditStatus
  readonly findings: readonly AccessibilityFinding[]
  readonly note?: string
}

export interface ParitySummary {
  readonly applicable: boolean
  readonly classification: ParityClassification
  readonly intentionalDifferences: readonly string[]
  readonly note?: string
}

export interface ReactEdition {
  readonly files: readonly string[]
  readonly exports: readonly string[]
  readonly props: readonly ManifestProp[]
  readonly internalDependencies: readonly string[]
  readonly npmDependencies: readonly ManifestDependency[]
  readonly exampleFiles: readonly string[]
}

export interface BladeEdition {
  readonly files: readonly string[]
  readonly canonicalTag: string
  readonly legacyTags: readonly string[]
  readonly props: readonly ManifestProp[]
  readonly slots: readonly string[]
  readonly events: readonly string[]
  readonly phpDependencies: readonly string[]
  readonly runtimeDependencies: readonly ManifestDependency[]
  readonly installTargets: readonly string[]
  readonly exampleFiles: readonly string[]
}

export interface IconMapping {
  readonly meaning: string
  readonly react: string
  readonly blade: string
  readonly size?: string
  readonly weight?: string
}

export interface ComponentPreview {
  readonly id: string
  readonly title: string
  readonly reactExample: string
  readonly bladeExample: string
  readonly states: readonly string[]
  readonly supportsDirection?: boolean
}

export interface ComponentManifest {
  readonly $schema: string
  readonly schemaVersion: '1.0.0'
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: ComponentCategory
  readonly maturity: 'stable' | 'beta'
  readonly searchTerms: readonly string[]
  readonly react: ReactEdition
  readonly blade: BladeEdition
  readonly shared: {
    readonly variants: readonly NamedOption[]
    readonly sizes: readonly NamedOption[]
    readonly states: readonly string[]
    readonly responsiveBehavior: readonly string[]
    readonly tokens: readonly string[]
    readonly iconMappings: readonly IconMapping[]
  }
  readonly previews: readonly ComponentPreview[]
  readonly parity: {
    readonly classification: Extract<
      ParityClassification,
      'exact' | 'framework-equivalent' | 'documented-exception'
    >
    readonly intentionalDifferences: readonly string[]
  }
  readonly accessibility: ComponentAccessibility
  readonly source: SourceProvenance
}

export interface RecipeManifest {
  readonly schemaVersion: '1.0.0'
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly maturity: 'stable' | 'beta'
  readonly kind: 'recipe'
  readonly searchTerms: readonly string[]
  readonly fixture: string
  readonly documentation: string
  readonly react: {
    readonly files: readonly string[]
    readonly exampleData: string
  }
  readonly blade: {
    readonly files: readonly string[]
    readonly exampleData: string
  }
  readonly contract: {
    readonly support: 'composition-recipe'
    readonly standaloneApi: boolean
    readonly fixturePolicy: string
    readonly parity: Extract<
      ParityClassification,
      'exact' | 'framework-equivalent' | 'documented-exception'
    >
  }
  readonly source: SourceProvenance
}

export interface PatternScenario {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly fixture: string
  readonly states?: readonly string[]
  readonly defaultViewport?: '360' | '768' | '1280' | 'fluid'
}

export interface PatternContractMember {
  readonly name: string
  readonly type: string
  readonly required: boolean
  readonly description?: string
}

export interface PatternRecipeManifest {
  readonly schemaVersion: '1.0.0'
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly maturity: 'beta'
  readonly kind: 'recipe'
  readonly searchTerms: readonly string[]
  readonly fixture: string
  readonly documentation: string
  readonly scenarios: readonly PatternScenario[]
  readonly react: {
    readonly files: readonly string[]
    readonly entry: string
    readonly export: string
    readonly exampleData: string
  }
  readonly blade: {
    readonly files: readonly string[]
    readonly exampleData: string
    readonly events?: readonly string[]
  }
  readonly contract: {
    readonly support: 'composition-recipe'
    readonly standaloneApi: false
    readonly fixturePolicy: 'neutral DTOs only'
    readonly hostResponsibilities: readonly string[]
    readonly inputs?: readonly PatternContractMember[]
    readonly callbacks?: readonly PatternContractMember[]
  }
  readonly dependencies: {
    readonly internal: readonly string[]
    readonly npm: readonly string[]
    readonly bladeRuntime: readonly string[]
  }
  readonly responsiveBehavior: readonly string[]
  readonly accessibility: {
    readonly status: 'pending' | 'passed' | 'passed-with-findings'
    readonly findings: readonly string[]
  }
  readonly parity: {
    readonly classification: 'framework-equivalent' | 'intentional-difference'
    readonly differences: readonly string[]
  }
  readonly source: SourceProvenance
}

export interface CatalogIndexEntry {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly kind: 'component' | 'recipe' | 'utility'
  readonly maturity: 'stable' | 'beta' | 'infrastructure'
  readonly manifest: string
  readonly frameworks: readonly Framework[]
  readonly searchTerms: readonly string[]
}

export interface FoundationIndexEntry {
  readonly id: string
  readonly title: string
  readonly data: readonly string[]
  readonly documentation: string
}

export interface DeferredIndexEntry {
  readonly id: string
  readonly title: string
  readonly source: string
  readonly reason: string
  readonly revisitWhen: string
}

export interface HandoffCatalogIndex {
  readonly $schema: string
  readonly schemaVersion: '1.0.0'
  readonly version: '0.1.0'
  readonly name: string
  readonly components: readonly CatalogIndexEntry[]
  readonly recipes: readonly CatalogIndexEntry[]
  readonly foundations: readonly FoundationIndexEntry[]
  readonly utilities: readonly CatalogIndexEntry[]
  readonly deferredComponents: readonly DeferredIndexEntry[]
  readonly counts: {
    readonly stable: number
    readonly beta: number
    readonly paired: number
    readonly deferred: number
    readonly recipes: number
    readonly utilities: number
  }
}

export interface PatternHandoffCatalogIndex {
  readonly schemaVersion: '1.0.0'
  readonly version: '0.1.0'
  readonly name: string
  readonly baseLibrary: string
  readonly patterns: readonly CatalogIndexEntry[]
  readonly counts: {
    readonly patterns: number
    readonly react: number
    readonly blade: number
  }
}

export interface CatalogEntryBase {
  readonly key: string
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly kind: CatalogKind
  readonly maturity: Maturity
  readonly availability: Availability
  readonly frameworks: readonly Framework[]
  readonly searchTerms: readonly string[]
  readonly route: string
  readonly copyable: boolean
  readonly sourcePackage: HandoffPackage
  readonly accessibility: AccessibilitySummary
  readonly parity: ParitySummary
}

export interface ComponentCatalogEntry extends CatalogEntryBase {
  readonly kind: 'component'
  readonly maturity: 'stable' | 'beta'
  readonly availability: 'supported'
  readonly frameworks: readonly ['react', 'blade']
  readonly manifestPath: string
  readonly documentationPath: string
  readonly manifest: ComponentManifest
}

export interface RecipeCatalogEntry extends CatalogEntryBase {
  readonly kind: 'recipe'
  readonly maturity: 'stable' | 'beta'
  readonly availability: 'supported'
  readonly frameworks: readonly ['react', 'blade']
  readonly manifestPath: string
  readonly documentationPath: string
  readonly fixturePath: string
  readonly manifest: RecipeManifest | PatternRecipeManifest
}

export interface FoundationCatalogEntry extends CatalogEntryBase {
  readonly kind: 'foundation'
  readonly maturity: 'foundation'
  readonly availability: 'supported'
  readonly frameworks: readonly []
  readonly documentationPath: string
  readonly dataPaths: readonly string[]
}

export interface DeferredCatalogEntry extends CatalogEntryBase {
  readonly kind: 'deferred'
  readonly maturity: 'deferred'
  readonly availability: 'deferred'
  readonly frameworks: readonly []
  readonly documentationPath: string
  readonly sourceReference: string
  readonly reason: string
  readonly revisitWhen: string
}

export interface UtilityCatalogEntry extends CatalogEntryBase {
  readonly kind: 'utility'
  readonly maturity: 'infrastructure'
  readonly availability: 'infrastructure'
  readonly manifestPath: string
}

export type DeveloperCatalogEntry =
  | ComponentCatalogEntry
  | RecipeCatalogEntry
  | FoundationCatalogEntry
  | DeferredCatalogEntry
  | UtilityCatalogEntry

export interface CatalogCategory<TEntry extends DeveloperCatalogEntry = DeveloperCatalogEntry> {
  readonly id: string
  readonly title: string
  readonly count: number
  readonly entries: readonly TEntry[]
}

export type SourceLanguage =
  | 'blade'
  | 'css'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'php'
  | 'shell'
  | 'text'
  | 'typescript'
  | 'tsx'

export interface HandoffSource {
  readonly path: string
  readonly content: string
  readonly language: SourceLanguage
  readonly bytes: number
}

export interface EntrySourcePaths {
  readonly manifest: readonly string[]
  readonly documentation: readonly string[]
  readonly react: readonly string[]
  readonly blade: readonly string[]
  readonly fixtures: readonly string[]
  readonly data: readonly string[]
}

export interface SearchDocument {
  readonly id: string
  readonly entryId: string
  readonly kind: CatalogKind
  readonly availability: Availability
  readonly maturity: Maturity
  readonly title: string
  readonly description: string
  readonly category: string
  readonly frameworks: readonly Framework[]
  readonly route: string
  readonly terms: readonly string[]
  readonly searchableText: string
}

export interface SearchOptions {
  readonly kinds?: readonly CatalogKind[]
  readonly availabilities?: readonly Availability[]
  readonly frameworks?: readonly Framework[]
  readonly limit?: number
}

export interface SearchResult {
  readonly document: SearchDocument
  readonly score: number
}

export interface CatalogValidationIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface CatalogValidationResult {
  readonly valid: boolean
  readonly issues: readonly CatalogValidationIssue[]
  readonly counts: {
    readonly components: number
    readonly deferred: number
    readonly recipes: number
    readonly foundations: number
    readonly utilities: number
  }
}
