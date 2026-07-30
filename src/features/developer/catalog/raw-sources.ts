/// <reference types="vite/client" />

import type { HandoffSource, SourceLanguage } from './types'

type RawSourceLoader = () => Promise<string>

const HANDOFF_ROOT = '/_comp-lib/'

// These are data-only imports. Vite returns the original file content as text;
// nothing in the handoff is evaluated through this source API.
const eagerManifestSources = import.meta.glob(
  [
    '/_comp-lib/catalog/catalog.json',
    '/_comp-lib/catalog/components/*.json',
    '/_comp-lib/catalog/recipes/*.json',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

const rawSourceLoaders = import.meta.glob(
  [
    '/_comp-lib/*.md',
    '/_comp-lib/*.json',
    '/_comp-lib/VERSION',
    '/_comp-lib/catalog/**/*.json',
    '!/_comp-lib/catalog/catalog.json',
    '!/_comp-lib/catalog/components/*.json',
    '!/_comp-lib/catalog/recipes/*.json',
    '/_comp-lib/docs/**/*.md',
    '/_comp-lib/foundations/**/*.{css,json,md}',
    '/_comp-lib/react/**/*.{json,md,ts,tsx}',
    '/_comp-lib/blade/**/*.{css,js,json,md,php}',
    '/_comp-lib/recipes/**/*.{json,md,php,tsx}',
  ],
  { query: '?raw', import: 'default' },
) as Record<string, RawSourceLoader>

function toHandoffPath(modulePath: string): string {
  return modulePath.startsWith(HANDOFF_ROOT)
    ? modulePath.slice(HANDOFF_ROOT.length)
    : modulePath
}

function normalizeRequestedPath(path: string): string | undefined {
  const trimmed = path.trim()
  if (!trimmed || trimmed.includes('\\') || trimmed.includes('\0')) return undefined

  const withoutRoot = trimmed
    .replace(/^\//, '')
    .replace(/^_comp-lib\//, '')
  const segments = withoutRoot.split('/')

  if (
    segments.some((segment) => !segment || segment === '.' || segment === '..') ||
    withoutRoot.includes('://')
  ) {
    return undefined
  }

  return segments.join('/')
}

function detectLanguage(path: string): SourceLanguage {
  if (path.endsWith('.blade.php')) return 'blade'
  if (path.endsWith('.tsx')) return 'tsx'
  if (path.endsWith('.ts')) return 'typescript'
  if (path.endsWith('.md')) return 'markdown'
  if (path.endsWith('.json')) return 'json'
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.mjs') || path.endsWith('.js')) return 'javascript'
  if (path.endsWith('.php')) return 'php'
  if (path.endsWith('.sh')) return 'shell'
  return 'text'
}

const loadersByHandoffPath = new Map<string, RawSourceLoader>([
  ...Object.entries(rawSourceLoaders).map(
    ([modulePath, loader]): [string, RawSourceLoader] => [
      toHandoffPath(modulePath),
      loader,
    ],
  ),
  ...Object.entries(eagerManifestSources).map(
    ([modulePath, source]): [string, RawSourceLoader] => [
      toHandoffPath(modulePath),
      async () => source,
    ],
  ),
])

export const availableHandoffSourcePaths = Object.freeze(
  [...loadersByHandoffPath.keys()].sort(),
)

export function getBundledManifestRawSource(path: string): string | undefined {
  const normalized = normalizeRequestedPath(path)
  if (!normalized) return undefined
  return eagerManifestSources[`${HANDOFF_ROOT}${normalized}`]
}

export function hasHandoffSource(path: string): boolean {
  const normalized = normalizeRequestedPath(path)
  return normalized ? loadersByHandoffPath.has(normalized) : false
}

export async function getHandoffSource(path: string): Promise<HandoffSource | undefined> {
  const normalized = normalizeRequestedPath(path)
  if (!normalized) return undefined

  const load = loadersByHandoffPath.get(normalized)
  if (!load) return undefined

  const content = await load()
  return Object.freeze({
    path: normalized,
    content,
    language: detectLanguage(normalized),
    bytes: new TextEncoder().encode(content).byteLength,
  })
}

export async function requireHandoffSource(path: string): Promise<HandoffSource> {
  const source = await getHandoffSource(path)
  if (!source) {
    throw new Error(`Handoff source is not bundled or the path is invalid: ${path}`)
  }
  return source
}

export async function getHandoffSources(
  paths: readonly string[],
): Promise<readonly HandoffSource[]> {
  // Catalog-declared sources are a contract, not an optional best-effort list.
  // Failing the whole request keeps missing chunks visible instead of silently
  // presenting an incomplete copy/download surface.
  return Object.freeze(await Promise.all(paths.map(requireHandoffSource)))
}

export async function requireHandoffJson<T>(path: string): Promise<T> {
  const source = await requireHandoffSource(path)
  if (source.language !== 'json') {
    throw new Error(`Expected a JSON handoff source: ${path}`)
  }
  return JSON.parse(source.content) as T
}
