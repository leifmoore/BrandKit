import type { CatalogKind, DeveloperCatalogEntry } from './types'

/** Canonical destination. Legacy `/developer/*` redirects are owned by the app router. */
export const DEVELOPER_ROOT_ROUTE = '/design-system' as const

const collectionByKind = {
  component: 'components',
  deferred: 'roadmap',
  recipe: 'patterns',
  foundation: 'foundations',
  utility: '',
} as const satisfies Record<CatalogKind, string>

export function getDeveloperRoute(kind: CatalogKind, id: string): string {
  const collection = collectionByKind[kind]

  if (kind === 'utility') {
    return DEVELOPER_ROOT_ROUTE
  }

  if (kind === 'foundation' && id === 'brands') {
    return `${DEVELOPER_ROOT_ROUTE}/foundations/themes`
  }

  return `${DEVELOPER_ROOT_ROUTE}/${collection}/${encodeURIComponent(id)}`
}

export function getEntryRoute(entry: Pick<DeveloperCatalogEntry, 'kind' | 'id'>): string {
  return getDeveloperRoute(entry.kind, entry.id)
}

export function getComponentRoute(id: string): string {
  return getDeveloperRoute('component', id)
}

export function getPatternRoute(id: string): string {
  return getDeveloperRoute('recipe', id)
}

export function getFoundationRoute(id: string): string {
  return getDeveloperRoute('foundation', id)
}

export interface ParsedDeveloperRoute {
  readonly kind: 'root' | 'component' | 'recipe' | 'foundation' | 'deferred'
  readonly id?: string
}

export function parseDeveloperRoute(pathname: string): ParsedDeveloperRoute | undefined {
  const path = pathname.split(/[?#]/, 1)[0]?.replace(/\/+$/, '') || '/'

  if (path === DEVELOPER_ROOT_ROUTE) {
    return { kind: 'root' }
  }

  const match = path.match(/^\/design-system\/(components|patterns|foundations|roadmap)\/([^/]+)$/)
  if (!match) return undefined

  const collection = match[1]
  const encodedId = match[2]
  if (!collection || !encodedId) return undefined

  let id: string
  try {
    id = decodeURIComponent(encodedId)
  } catch {
    return undefined
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return undefined

  if (collection === 'components') return { kind: 'component', id }
  if (collection === 'patterns') return { kind: 'recipe', id }
  if (collection === 'foundations') return { kind: 'foundation', id }
  return { kind: 'deferred', id }
}
