import {
  components,
  catalogVersion,
  recipes,
  type ComponentCatalogEntry,
  type RecipeCatalogEntry,
} from '@/features/developer/catalog'
import { hasPreview } from '@/features/developer/preview'

export type PreviewReviewStatus = 'unreviewed' | 'pass' | 'flagged'
export type PreviewReviewFilter = 'all' | 'unreviewed' | 'flagged'

export interface PreviewReviewEntry {
  readonly key: string
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: string
  readonly kind: 'component' | 'recipe'
  readonly route: string
  readonly states: readonly string[]
  readonly scenarios?: readonly {
    readonly id: string
    readonly title: string
    readonly description?: string
    readonly states?: readonly string[]
    readonly defaultViewport?: '360' | '768' | '1280' | 'fluid'
  }[]
}

export interface SavedPreviewReview {
  readonly status: Exclude<PreviewReviewStatus, 'unreviewed'>
  readonly note?: string
  readonly updatedAt: string
}

export type PreviewReviewRecords = Readonly<Record<string, SavedPreviewReview>>

interface StoredPreviewReviewState {
  readonly schemaVersion: 1
  readonly catalogVersion: string
  readonly entries: PreviewReviewRecords
}

const NOTE_LIMIT = 240
const REVIEW_SCHEMA_VERSION = 1 as const

export const PREVIEW_REVIEW_STORAGE_KEY =
  `scudamores.design-system.preview-review.v${REVIEW_SCHEMA_VERSION}.${catalogVersion}`

function toComponentReviewEntry(entry: ComponentCatalogEntry): PreviewReviewEntry {
  return Object.freeze({
    key: entry.key,
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    kind: 'component',
    route: entry.route,
    states: Object.freeze([...(entry.manifest.previews[0]?.states ?? ['default'])]),
  })
}

function toRecipeReviewEntry(entry: RecipeCatalogEntry): PreviewReviewEntry {
  const scenarios = entry.sourcePackage === 'pattern-library' && 'scenarios' in entry.manifest
    ? entry.manifest.scenarios
    : undefined
  return Object.freeze({
    key: entry.key,
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    kind: 'recipe',
    route: entry.route,
    states: Object.freeze([]),
    scenarios,
  })
}

/**
 * The handoff catalogue is the ordering authority. Registry checks only omit
 * entries that cannot produce a live preview, so the review route never
 * advertises a non-renderable queue item.
 */
export const previewReviewQueue: readonly PreviewReviewEntry[] = Object.freeze([
  ...components
    .filter((entry) => hasPreview('component', entry.id))
    .map(toComponentReviewEntry),
  ...recipes
    .filter((entry) => hasPreview('recipe', entry.id))
    .map(toRecipeReviewEntry),
])

const queueKeys = new Set(previewReviewQueue.map((entry) => entry.key))

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function parseSavedReview(value: unknown): SavedPreviewReview | undefined {
  if (!isRecord(value)) return undefined
  if (value.status !== 'pass' && value.status !== 'flagged') return undefined
  if (typeof value.updatedAt !== 'string') return undefined

  const note = typeof value.note === 'string'
    ? value.note.trim().slice(0, NOTE_LIMIT)
    : undefined

  return Object.freeze({
    status: value.status,
    ...(value.status === 'flagged' && note ? { note } : {}),
    updatedAt: value.updatedAt,
  })
}

export function readPreviewReviewRecords(): PreviewReviewRecords {
  try {
    const raw = window.localStorage.getItem(PREVIEW_REVIEW_STORAGE_KEY)
    if (!raw) return Object.freeze({})

    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed)) return Object.freeze({})
    if (parsed.schemaVersion !== REVIEW_SCHEMA_VERSION) return Object.freeze({})
    if (parsed.catalogVersion !== catalogVersion) return Object.freeze({})
    if (!isRecord(parsed.entries)) return Object.freeze({})

    const validEntries: Record<string, SavedPreviewReview> = {}
    for (const [key, value] of Object.entries(parsed.entries)) {
      if (!queueKeys.has(key)) continue
      const review = parseSavedReview(value)
      if (review) validEntries[key] = review
    }

    return Object.freeze(validEntries)
  } catch {
    return Object.freeze({})
  }
}

export function storePreviewReviewRecords(records: PreviewReviewRecords): boolean {
  const state: StoredPreviewReviewState = {
    schemaVersion: REVIEW_SCHEMA_VERSION,
    catalogVersion,
    entries: records,
  }

  try {
    window.localStorage.setItem(PREVIEW_REVIEW_STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearPreviewReviewRecords(): boolean {
  try {
    window.localStorage.removeItem(PREVIEW_REVIEW_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function getPreviewReviewStatus(
  records: PreviewReviewRecords,
  key: string,
): PreviewReviewStatus {
  return records[key]?.status ?? 'unreviewed'
}

export function filterPreviewReviewQueue(
  records: PreviewReviewRecords,
  filter: PreviewReviewFilter,
): readonly PreviewReviewEntry[] {
  if (filter === 'all') return previewReviewQueue
  return previewReviewQueue.filter((entry) => getPreviewReviewStatus(records, entry.key) === filter)
}

export function updatePreviewReviewRecord(
  records: PreviewReviewRecords,
  key: string,
  status: PreviewReviewStatus,
  note: string,
  updatedAt = new Date().toISOString(),
): PreviewReviewRecords {
  const next: Record<string, SavedPreviewReview> = { ...records }

  if (status === 'unreviewed') {
    delete next[key]
  } else {
    const normalizedNote = note.trim().slice(0, NOTE_LIMIT)
    next[key] = Object.freeze({
      status,
      ...(status === 'flagged' && normalizedNote ? { note: normalizedNote } : {}),
      updatedAt,
    })
  }

  return Object.freeze(next)
}

export function getPreviewReviewCounts(records: PreviewReviewRecords) {
  let passed = 0
  let flagged = 0

  for (const entry of previewReviewQueue) {
    const status = getPreviewReviewStatus(records, entry.key)
    if (status === 'pass') passed += 1
    if (status === 'flagged') flagged += 1
  }

  return Object.freeze({
    total: previewReviewQueue.length,
    passed,
    flagged,
    reviewed: passed + flagged,
    unreviewed: previewReviewQueue.length - passed - flagged,
  })
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

export function createPreviewReviewMarkdown(records: PreviewReviewRecords): string {
  const counts = getPreviewReviewCounts(records)
  const lines = [
    `# Preview review — Scudamore's Design System ${catalogVersion}`,
    '',
    `Exported: ${new Date().toISOString()}`,
    '',
    `Progress: ${counts.reviewed}/${counts.total} reviewed (${counts.passed} passed, ${counts.flagged} flagged, ${counts.unreviewed} unreviewed).`,
    '',
    '| # | Type | Preview | Status | Note |',
    '|---:|---|---|---|---|',
  ]

  previewReviewQueue.forEach((entry, index) => {
    const saved = records[entry.key]
    lines.push(`| ${[
      String(index + 1),
      escapeMarkdownCell(entry.kind === 'component' ? 'Component' : 'Pattern'),
      escapeMarkdownCell(entry.title),
      saved?.status ?? 'unreviewed',
      escapeMarkdownCell(saved?.note ?? ''),
    ].join(' | ')} |`)
  })

  return `${lines.join('\n')}\n`
}

export function createPreviewReviewJson(records: PreviewReviewRecords): string {
  const counts = getPreviewReviewCounts(records)
  const exportValue = {
    schemaVersion: REVIEW_SCHEMA_VERSION,
    catalogVersion,
    exportedAt: new Date().toISOString(),
    summary: counts,
    entries: previewReviewQueue.map((entry, index) => ({
      order: index + 1,
      key: entry.key,
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      status: getPreviewReviewStatus(records, entry.key),
      note: records[entry.key]?.note ?? '',
      updatedAt: records[entry.key]?.updatedAt ?? null,
      route: entry.route,
    })),
  }

  return `${JSON.stringify(exportValue, null, 2)}\n`
}

export const PREVIEW_REVIEW_NOTE_LIMIT = NOTE_LIMIT
