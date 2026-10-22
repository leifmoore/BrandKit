import type { ReactNode } from 'react'

export type DeveloperFramework = 'react' | 'blade'

export type SourceFramework = DeveloperFramework | 'shared'

export type DeveloperMaturity = 'stable' | 'beta' | 'infrastructure'

export type DeveloperStatus =
  | 'supported'
  | 'deferred'
  | 'reference'
  | 'deprecated'

export type DeveloperEntryKind =
  | 'component'
  | 'deferred'
  | 'recipe'
  | 'foundation'
  | 'utility'

export interface SourceFileViewModel {
  /** Stable ID for tab selection. Defaults to `path` when omitted. */
  id?: string
  path: string
  content: string
  framework: SourceFramework
  kind?: 'implementation' | 'example' | 'fixture' | 'data' | 'documentation'
  language?: string
  label?: string
  downloadName?: string
  /** Explicitly disable copy/download for inventory-only evidence. */
  copyable?: boolean
}

export interface NamedOptionViewModel {
  name: string
  description?: string
  default?: boolean
}

export interface PropViewModel {
  name: string
  type: string
  required: boolean
  defaultValue?: unknown
  description?: string
}

export interface DependencyViewModel {
  name: string
  version?: string
  purpose?: string
  framework?: DeveloperFramework
  scope?: 'npm' | 'runtime' | 'internal' | 'php'
}

export interface FrameworkContractViewModel {
  framework: DeveloperFramework
  exports?: readonly string[]
  canonicalTag?: string
  compatibilityTags?: readonly string[]
  props: readonly PropViewModel[]
  slots?: readonly string[]
  events?: readonly string[]
  installTargets?: readonly string[]
}

export interface AccessibilityFindingViewModel {
  id: string
  severity?: 'minor' | 'moderate' | 'serious' | 'critical'
  status?: 'open' | 'accepted' | 'fixed'
  summary: string
  detail?: string
}

export interface AccessibilityViewModel {
  target: string
  auditStatus: 'pending' | 'passed' | 'passed-with-findings' | 'failed'
  findings: readonly AccessibilityFindingViewModel[]
}

export interface ParityViewModel {
  classification: 'exact' | 'framework-equivalent' | 'documented-exception'
  intentionalDifferences: readonly string[]
}

export interface CatalogEntryViewModel {
  id: string
  title: string
  description?: string
  href: string
  category: string
  kind: DeveloperEntryKind
  maturity?: DeveloperMaturity
  status?: DeveloperStatus
  frameworks?: readonly DeveloperFramework[]
  searchTerms?: readonly string[]
}

export interface CatalogCountViewModel {
  label: string
  value: number
  description?: string
}

export interface CatalogOverviewViewModel {
  name: string
  version: string
  description: string
  releaseStatus?: string
  counts: readonly CatalogCountViewModel[]
  entries: readonly CatalogEntryViewModel[]
  installation?: string
}

export interface ComponentDetailViewModel {
  id: string
  title: string
  description: string
  category: string
  maturity: DeveloperMaturity
  status?: DeveloperStatus
  frameworks: readonly DeveloperFramework[]
  documentation?: string
  variants?: readonly NamedOptionViewModel[]
  sizes?: readonly NamedOptionViewModel[]
  states?: readonly string[]
  responsiveBehavior?: readonly string[]
  tokens?: readonly string[]
  contracts: readonly FrameworkContractViewModel[]
  dependencies: readonly DependencyViewModel[]
  accessibility: AccessibilityViewModel
  parity: ParityViewModel
}

export interface DeferredDetailViewModel {
  id: string
  title: string
  source: string
  reason: string
  revisitWhen: string
  description?: string
  category?: string
}

export interface RecipeDetailViewModel {
  id: string
  title: string
  description: string
  category: string
  maturity: DeveloperMaturity
  status?: DeveloperStatus
  frameworks: readonly DeveloperFramework[]
  documentation?: string
  contract?: readonly PropViewModel[]
  contractDetails?: {
    support?: string
    standaloneApi?: boolean
    fixturePolicy?: string
    hostResponsibilities?: readonly string[]
  }
  dependencies?: readonly DependencyViewModel[]
  responsiveBehavior?: readonly string[]
  accessibility?: AccessibilityViewModel
  parity?: ParityViewModel
}

export interface FoundationDetailViewModel {
  id: string
  title: string
  description: string
  documentation?: string
  dataFiles?: readonly string[]
  principles?: readonly string[]
}

export interface DeveloperPageContentProps {
  preview?: ReactNode
  sources?: readonly SourceFileViewModel[]
}
