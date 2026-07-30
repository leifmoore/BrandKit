import { allCatalogEntries } from './data'
import type {
  DeveloperCatalogEntry,
  SearchDocument,
  SearchOptions,
  SearchResult,
} from './types'

function compact(values: readonly (string | undefined)[]): readonly string[] {
  return Object.freeze(
    [...new Set(values.filter((value): value is string => Boolean(value?.trim())))],
  )
}

function entryTerms(entry: DeveloperCatalogEntry): readonly string[] {
  const common = [
    entry.id,
    entry.title,
    entry.description,
    entry.category,
    entry.kind,
    entry.maturity,
    entry.availability,
    ...entry.frameworks,
    ...entry.searchTerms,
    entry.parity.classification,
    entry.accessibility.status,
  ]

  switch (entry.kind) {
    case 'component':
      return compact([
        ...common,
        ...entry.manifest.react.exports,
        ...entry.manifest.react.props.map((prop) => prop.name),
        ...entry.manifest.blade.props.map((prop) => prop.name),
        entry.manifest.blade.canonicalTag,
        ...entry.manifest.blade.legacyTags,
        ...entry.manifest.shared.states,
        ...entry.manifest.shared.tokens,
        ...entry.manifest.parity.intentionalDifferences,
        ...entry.manifest.accessibility.findings.flatMap((finding) => [
          finding.id,
          finding.severity,
          finding.status,
          finding.summary,
        ]),
      ])
    case 'recipe':
      return compact([
        ...common,
        entry.manifest.contract.support,
        entry.manifest.contract.fixturePolicy,
        entry.manifest.contract.parity,
      ])
    case 'foundation':
      return compact([
        ...common,
        entry.documentationPath,
        ...entry.dataPaths,
      ])
    case 'deferred':
      return compact([
        ...common,
        entry.reason,
        entry.revisitWhen,
        entry.sourceReference,
      ])
    case 'utility':
      return compact([...common, entry.manifestPath])
  }
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en-GB')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function toSearchDocument(entry: DeveloperCatalogEntry): SearchDocument {
  const terms = entryTerms(entry)
  return Object.freeze({
    id: entry.key,
    entryId: entry.id,
    kind: entry.kind,
    availability: entry.availability,
    maturity: entry.maturity,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    frameworks: entry.frameworks,
    route: entry.route,
    terms,
    searchableText: normalizeSearchText(terms.join(' ')),
  })
}

export const searchDocuments: readonly SearchDocument[] = Object.freeze(
  allCatalogEntries.map(toSearchDocument),
)

function matchesFilters(document: SearchDocument, options: SearchOptions): boolean {
  if (options.kinds && !options.kinds.includes(document.kind)) return false
  if (
    options.availabilities &&
    !options.availabilities.includes(document.availability)
  ) {
    return false
  }
  if (
    options.frameworks &&
    !options.frameworks.every((framework) => document.frameworks.includes(framework))
  ) {
    return false
  }
  return true
}

function scoreDocument(document: SearchDocument, query: string): number {
  if (!query) return 0
  if (!document.searchableText.includes(query)) {
    const words = query.split(' ')
    if (!words.every((word) => document.searchableText.includes(word))) return -1
  }

  const title = normalizeSearchText(document.title)
  const id = normalizeSearchText(document.entryId)
  const category = normalizeSearchText(document.category)
  const normalizedTerms = document.terms.map(normalizeSearchText)
  const words = query.split(' ')

  let score = words.reduce(
    (total, word) => total + (document.searchableText.includes(word) ? 3 : 0),
    0,
  )
  if (title === query || id === query) score += 100
  else if (title.startsWith(query) || id.startsWith(query)) score += 50
  else if (title.includes(query) || id.includes(query)) score += 30
  if (normalizedTerms.includes(query)) score += 25
  if (category === query) score += 15
  if (document.availability === 'supported') score += 2
  return score
}

export function searchCatalog(
  query: string,
  options: SearchOptions = {},
): readonly SearchResult[] {
  const normalizedQuery = normalizeSearchText(query)
  const limit = Math.max(0, options.limit ?? searchDocuments.length)

  return Object.freeze(
    searchDocuments
      .filter((document) => matchesFilters(document, options))
      .map((document) => ({
        document,
        score: scoreDocument(document, normalizedQuery),
      }))
      .filter((result) => result.score >= 0)
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.document.title.localeCompare(right.document.title),
      )
      .slice(0, limit)
      .map((result) => Object.freeze(result)),
  )
}
