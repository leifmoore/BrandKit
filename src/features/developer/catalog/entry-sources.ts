import { getHandoffSources, requireHandoffSource } from './raw-sources'
import type {
  ComponentCatalogEntry,
  DeveloperCatalogEntry,
  EntrySourcePaths,
  HandoffSource,
  RecipeCatalogEntry,
} from './types'

const emptyPaths = Object.freeze([]) as readonly string[]

function unique(paths: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(paths)])
}

function componentSourcePaths(entry: ComponentCatalogEntry): EntrySourcePaths {
  return Object.freeze({
    manifest: Object.freeze([entry.manifestPath]),
    documentation: Object.freeze([entry.documentationPath]),
    react: unique([
      ...entry.manifest.react.files,
      ...entry.manifest.react.exampleFiles,
    ]),
    blade: unique([
      ...entry.manifest.blade.files,
      ...entry.manifest.blade.exampleFiles,
    ]),
    fixtures: emptyPaths,
    data: emptyPaths,
  })
}

function recipeSourcePaths(entry: RecipeCatalogEntry): EntrySourcePaths {
  return Object.freeze({
    manifest: Object.freeze([entry.manifestPath]),
    documentation: Object.freeze([entry.documentationPath]),
    react: unique(entry.manifest.react.files),
    blade: unique(entry.manifest.blade.files),
    fixtures: unique([
      entry.fixturePath,
      entry.manifest.react.exampleData,
      entry.manifest.blade.exampleData,
    ]),
    data: emptyPaths,
  })
}

export function getEntrySourcePaths(entry: DeveloperCatalogEntry): EntrySourcePaths {
  switch (entry.kind) {
    case 'component':
      return componentSourcePaths(entry)
    case 'recipe':
      return recipeSourcePaths(entry)
    case 'foundation':
      return Object.freeze({
        manifest: emptyPaths,
        documentation: Object.freeze([entry.documentationPath]),
        react: emptyPaths,
        blade: emptyPaths,
        fixtures: emptyPaths,
        data: unique(entry.dataPaths),
      })
    case 'deferred':
      return Object.freeze({
        manifest: emptyPaths,
        documentation: Object.freeze([entry.documentationPath]),
        react: emptyPaths,
        blade: emptyPaths,
        fixtures: emptyPaths,
        data: emptyPaths,
      })
    case 'utility':
      return Object.freeze({
        manifest: Object.freeze([entry.manifestPath]),
        documentation: emptyPaths,
        react: emptyPaths,
        blade: emptyPaths,
        fixtures: emptyPaths,
        data: emptyPaths,
      })
  }
}

export function flattenEntrySourcePaths(paths: EntrySourcePaths): readonly string[] {
  return unique([
    ...paths.manifest,
    ...paths.documentation,
    ...paths.react,
    ...paths.blade,
    ...paths.fixtures,
    ...paths.data,
  ])
}

export async function getEntrySources(
  entry: DeveloperCatalogEntry,
): Promise<readonly HandoffSource[]> {
  return getHandoffSources(flattenEntrySourcePaths(getEntrySourcePaths(entry)))
}

export async function getManifestSource(
  entry: ComponentCatalogEntry | RecipeCatalogEntry,
): Promise<HandoffSource> {
  return requireHandoffSource(entry.manifestPath)
}

export async function getDocumentationSource(
  entry: Exclude<DeveloperCatalogEntry, { kind: 'utility' }>,
): Promise<HandoffSource> {
  return requireHandoffSource(entry.documentationPath)
}
