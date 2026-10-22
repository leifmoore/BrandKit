import {
  allCatalogEntries,
  catalogCounts,
  components,
  deferredComponents,
  foundations,
  handoffCatalog,
  patternHandoffCatalog,
  recipes,
  utilities,
} from './data'
import { flattenEntrySourcePaths, getEntrySourcePaths } from './entry-sources'
import { hasHandoffSource } from './raw-sources'
import type {
  CatalogValidationIssue,
  CatalogValidationResult,
  DeveloperCatalogEntry,
} from './types'

const expectedFoundationIds = [
  'tokens',
  'brands',
  'typography',
  'layout',
  'icons',
  'exceptions',
] as const

function addIssue(
  issues: CatalogValidationIssue[],
  code: string,
  message: string,
  path?: string,
): void {
  issues.push(Object.freeze({ code, message, path }))
}

function validateExpectedCount(
  issues: CatalogValidationIssue[],
  name: string,
  actual: number,
  expected: number,
): void {
  if (actual !== expected) {
    addIssue(
      issues,
      'count-mismatch',
      `Expected ${expected} ${name}; received ${actual}.`,
      `counts.${name}`,
    )
  }
}

function validateUniqueValues(
  issues: CatalogValidationIssue[],
  code: string,
  entries: readonly DeveloperCatalogEntry[],
  value: (entry: DeveloperCatalogEntry) => string,
): void {
  const seen = new Set<string>()
  for (const entry of entries) {
    const current = value(entry)
    if (seen.has(current)) {
      addIssue(issues, code, `Duplicate value "${current}".`, entry.key)
    }
    seen.add(current)
  }
}

function validateBundledSources(
  issues: CatalogValidationIssue[],
  entry: DeveloperCatalogEntry,
): void {
  const paths = flattenEntrySourcePaths(getEntrySourcePaths(entry))
  for (const path of paths) {
    if (!hasHandoffSource(path, entry.sourcePackage)) {
      addIssue(
        issues,
        'source-not-bundled',
        `Catalog source is missing from the raw Vite bundle: ${path}`,
        entry.key,
      )
    }
  }
}

export function validateDeveloperCatalog(): CatalogValidationResult {
  const issues: CatalogValidationIssue[] = []

  validateExpectedCount(issues, 'components', components.length, 39)
  validateExpectedCount(issues, 'deferred', deferredComponents.length, 10)
  validateExpectedCount(issues, 'recipes', recipes.length, 31)
  validateExpectedCount(issues, 'foundations', foundations.length, 6)
  validateExpectedCount(issues, 'utilities', utilities.length, 1)
  validateExpectedCount(issues, 'stable', catalogCounts.stable, 30)
  validateExpectedCount(issues, 'beta', catalogCounts.beta, 9)

  if (handoffCatalog.counts.paired !== components.length) {
    addIssue(
      issues,
      'handoff-count-mismatch',
      'The handoff paired count does not match normalized components.',
      'catalog/catalog.json',
    )
  }
  if (handoffCatalog.counts.deferred !== deferredComponents.length) {
    addIssue(
      issues,
      'handoff-count-mismatch',
      'The handoff deferred count does not match normalized deferred components.',
      'catalog/catalog.json',
    )
  }
  if (patternHandoffCatalog.counts.patterns !== 25) {
    addIssue(
      issues,
      'handoff-count-mismatch',
      'The add-on handoff must declare exactly 25 patterns.',
      '_pattern-lib/catalog/catalog.json',
    )
  }

  const foundationIds = new Set(foundations.map((entry) => entry.id))
  for (const id of expectedFoundationIds) {
    if (!foundationIds.has(id)) {
      addIssue(issues, 'foundation-missing', `Missing required foundation: ${id}`)
    }
  }
  for (const id of foundationIds) {
    if (!expectedFoundationIds.includes(id as (typeof expectedFoundationIds)[number])) {
      addIssue(issues, 'foundation-unexpected', `Unexpected foundation: ${id}`)
    }
  }

  validateUniqueValues(issues, 'duplicate-key', allCatalogEntries, (entry) => entry.key)
  validateUniqueValues(issues, 'duplicate-route', allCatalogEntries, (entry) => entry.route)

  for (const entry of components) {
    const indexEntry = handoffCatalog.components.find((item) => item.id === entry.id)
    if (!indexEntry) {
      addIssue(
        issues,
        'index-entry-missing',
        `Component ${entry.id} has no catalog index entry.`,
        entry.manifestPath,
      )
      continue
    }
    if (entry.id !== entry.manifest.id) {
      addIssue(
        issues,
        'manifest-id-mismatch',
        `Component index id ${entry.id} does not match manifest id ${entry.manifest.id}.`,
        entry.manifestPath,
      )
    }
    if (
      indexEntry.title !== entry.manifest.title ||
      indexEntry.category !== entry.manifest.category ||
      indexEntry.maturity !== entry.manifest.maturity
    ) {
      addIssue(
        issues,
        'manifest-index-mismatch',
        `Component index metadata does not match the ${entry.id} manifest.`,
        entry.manifestPath,
      )
    }
    if (
      indexEntry.kind !== 'component' ||
      indexEntry.frameworks.length !== 2 ||
      !indexEntry.frameworks.includes('react') ||
      !indexEntry.frameworks.includes('blade')
    ) {
      addIssue(
        issues,
        'framework-availability-mismatch',
        `Supported component ${entry.id} must declare paired React and Blade editions.`,
        entry.manifestPath,
      )
    }
    if (entry.manifest.previews.length === 0) {
      addIssue(
        issues,
        'preview-missing',
        `Supported component ${entry.id} has no preview.`,
        entry.manifestPath,
      )
    }
    if (!entry.accessibility.target || entry.accessibility.status === 'not-audited') {
      addIssue(
        issues,
        'component-a11y-missing',
        `Supported component ${entry.id} has no authored accessibility result.`,
        entry.manifestPath,
      )
    }
    validateBundledSources(issues, entry)
  }

  for (const entry of recipes) {
    const indexEntry = entry.sourcePackage === 'pattern-library'
      ? patternHandoffCatalog.patterns.find((item) => item.id === entry.id)
      : handoffCatalog.recipes.find((item) => item.id === entry.id)
    if (!indexEntry) {
      addIssue(
        issues,
        'index-entry-missing',
        `Recipe ${entry.id} has no catalog index entry.`,
        entry.manifestPath,
      )
      continue
    }
    if (entry.id !== entry.manifest.id) {
      addIssue(
        issues,
        'manifest-id-mismatch',
        `Recipe index id ${entry.id} does not match manifest id ${entry.manifest.id}.`,
        entry.manifestPath,
      )
    }
    if (
      indexEntry.kind !== 'recipe' ||
      indexEntry.title !== entry.manifest.title ||
      indexEntry.category !== entry.manifest.category ||
      indexEntry.maturity !== entry.manifest.maturity ||
      indexEntry.frameworks.length !== 2 ||
      !indexEntry.frameworks.includes('react') ||
      !indexEntry.frameworks.includes('blade')
    ) {
      addIssue(
        issues,
        'manifest-index-mismatch',
        `Recipe index metadata does not match the ${entry.id} manifest.`,
        entry.manifestPath,
      )
    }
    if (entry.manifest.contract.support !== 'composition-recipe') {
      addIssue(
        issues,
        'recipe-contract-invalid',
        `Recipe ${entry.id} is not marked as a composition recipe.`,
        entry.manifestPath,
      )
    }
    if (entry.sourcePackage === 'pattern-library') {
      const manifest = entry.manifest
      if (!('scenarios' in manifest) || manifest.scenarios.length === 0) {
        addIssue(
          issues,
          'recipe-scenarios-missing',
          `Add-on pattern ${entry.id} has no declared preview scenarios.`,
          entry.manifestPath,
        )
      }
      if (!('accessibility' in manifest) || manifest.accessibility.status === 'pending') {
        addIssue(
          issues,
          'recipe-a11y-missing',
          `Add-on pattern ${entry.id} has no released accessibility result.`,
          entry.manifestPath,
        )
      }
    }
    validateBundledSources(issues, entry)
  }

  for (const entry of foundations) validateBundledSources(issues, entry)

  for (const entry of deferredComponents) {
    if (entry.copyable) {
      addIssue(
        issues,
        'deferred-copyable',
        `Deferred component ${entry.id} must not expose install/copy controls.`,
        entry.documentationPath,
      )
    }
    validateBundledSources(issues, entry)
  }

  for (const entry of utilities) validateBundledSources(issues, entry)

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    counts: Object.freeze({
      components: components.length,
      deferred: deferredComponents.length,
      recipes: recipes.length,
      foundations: foundations.length,
      utilities: utilities.length,
    }),
  })
}

export const catalogValidation = validateDeveloperCatalog()

export function assertDeveloperCatalogValid(): void {
  if (catalogValidation.valid) return

  const details = catalogValidation.issues
    .map((issue) => `${issue.code}: ${issue.message}`)
    .join('\n')
  throw new Error(`Design System catalog validation failed:\n${details}`)
}
