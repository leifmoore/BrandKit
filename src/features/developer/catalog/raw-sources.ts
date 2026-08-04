/// <reference types="vite/client" />

import type { HandoffPackage, HandoffSource, SourceLanguage } from './types'

type RawSourceLoader = () => Promise<string>

const HANDOFF_ROOTS: Readonly<Record<HandoffPackage, string>> = Object.freeze({
  'component-library': '/_comp-lib/',
  'pattern-library': '/_pattern-lib/',
})

// These are data-only imports. Vite returns the original file content as text;
// nothing in the handoff is evaluated through this source API.
const eagerManifestSources = import.meta.glob(
  [
    '/_comp-lib/catalog/catalog.json',
    '/_comp-lib/catalog/components/*.json',
    '/_comp-lib/catalog/recipes/*.json',
    '/_pattern-lib/catalog/catalog.json',
    '/_pattern-lib/catalog/recipes/*.json',
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
    '/_pattern-lib/recipes/**/*.{json,md,php,ts,tsx}',
  ],
  { query: '?raw', import: 'default' },
) as Record<string, RawSourceLoader>

function packageForModulePath(modulePath: string): HandoffPackage | undefined {
  if (modulePath.startsWith(HANDOFF_ROOTS['component-library'])) return 'component-library'
  if (modulePath.startsWith(HANDOFF_ROOTS['pattern-library'])) return 'pattern-library'
  return undefined
}

function toPackagePath(sourcePackage: HandoffPackage, path: string): string {
  return `${sourcePackage}:${path}`
}

function toHandoffPath(modulePath: string, sourcePackage: HandoffPackage): string {
  const root = HANDOFF_ROOTS[sourcePackage]
  return modulePath.startsWith(root) ? modulePath.slice(root.length) : modulePath
}

function normalizeRequestedPath(
  path: string,
  defaultPackage: HandoffPackage,
): { sourcePackage: HandoffPackage; path: string } | undefined {
  const trimmed = path.trim()
  if (!trimmed || trimmed.includes('\\') || trimmed.includes('\0')) return undefined

  const withoutLeadingSlash = trimmed.replace(/^\//, '')
  const sourcePackage = withoutLeadingSlash.startsWith('_pattern-lib/')
    ? 'pattern-library'
    : withoutLeadingSlash.startsWith('_comp-lib/')
      ? 'component-library'
      : defaultPackage
  const withoutRoot = withoutLeadingSlash
    .replace(/^_comp-lib\//, '')
    .replace(/^_pattern-lib\//, '')
  const segments = withoutRoot.split('/')

  if (
    segments.some((segment) => !segment || segment === '.' || segment === '..') ||
    withoutRoot.includes('://')
  ) {
    return undefined
  }

  return { sourcePackage, path: segments.join('/') }
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

const loadersByHandoffPath = new Map<string, RawSourceLoader>()

for (const [modulePath, loader] of Object.entries(rawSourceLoaders)) {
  const sourcePackage = packageForModulePath(modulePath)
  if (!sourcePackage) continue
  loadersByHandoffPath.set(
    toPackagePath(sourcePackage, toHandoffPath(modulePath, sourcePackage)),
    loader,
  )
}

for (const [modulePath, source] of Object.entries(eagerManifestSources)) {
  const sourcePackage = packageForModulePath(modulePath)
  if (!sourcePackage) continue
  loadersByHandoffPath.set(
    toPackagePath(sourcePackage, toHandoffPath(modulePath, sourcePackage)),
    async () => source,
  )
}

export const availableHandoffSourcePaths = Object.freeze(
  [...loadersByHandoffPath.keys()].sort(),
)

export function getBundledManifestRawSource(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): string | undefined {
  const normalized = normalizeRequestedPath(path, sourcePackage)
  if (!normalized) return undefined
  return eagerManifestSources[`${HANDOFF_ROOTS[normalized.sourcePackage]}${normalized.path}`]
}

export function hasHandoffSource(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): boolean {
  const normalized = normalizeRequestedPath(path, sourcePackage)
  return normalized
    ? loadersByHandoffPath.has(toPackagePath(normalized.sourcePackage, normalized.path))
    : false
}

export async function getHandoffSource(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): Promise<HandoffSource | undefined> {
  const normalized = normalizeRequestedPath(path, sourcePackage)
  if (!normalized) return undefined

  const load = loadersByHandoffPath.get(
    toPackagePath(normalized.sourcePackage, normalized.path),
  )
  if (!load) return undefined

  const content = await load()
  const displayPath = normalized.sourcePackage === 'pattern-library'
    ? `_pattern-lib/${normalized.path}`
    : normalized.path
  return Object.freeze({
    path: displayPath,
    content,
    language: detectLanguage(normalized.path),
    bytes: new TextEncoder().encode(content).byteLength,
  })
}

export async function requireHandoffSource(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): Promise<HandoffSource> {
  const source = await getHandoffSource(path, sourcePackage)
  if (!source) {
    throw new Error(`Handoff source is not bundled or the path is invalid: ${path}`)
  }
  return source
}

export async function getHandoffSources(
  paths: readonly string[],
  sourcePackage: HandoffPackage = 'component-library',
): Promise<readonly HandoffSource[]> {
  // Catalog-declared sources are a contract, not an optional best-effort list.
  // Failing the whole request keeps missing chunks visible instead of silently
  // presenting an incomplete copy/download surface.
  return Object.freeze(
    await Promise.all(paths.map((path) => requireHandoffSource(path, sourcePackage))),
  )
}

export async function requireHandoffJson<T>(
  path: string,
  sourcePackage: HandoffPackage = 'component-library',
): Promise<T> {
  const source = await requireHandoffSource(path, sourcePackage)
  if (source.language !== 'json') {
    throw new Error(`Expected a JSON handoff source: ${path}`)
  }
  return JSON.parse(source.content) as T
}
