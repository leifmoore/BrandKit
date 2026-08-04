import { expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface CatalogIndexEntry {
  id: string
  title: string
  manifest?: string
}

interface HandoffCatalog {
  components: CatalogIndexEntry[]
  deferredComponents: CatalogIndexEntry[]
  recipes: CatalogIndexEntry[]
  foundations: CatalogIndexEntry[]
}

interface PatternHandoffCatalog {
  patterns: CatalogIndexEntry[]
}

interface ComponentManifestPreview {
  states: string[]
}

interface ComponentManifest {
  previews: ComponentManifestPreview[]
}

export const workspaceRoot = resolve(process.cwd())
export const handoffRoot = resolve(workspaceRoot, '_comp-lib')
export const patternHandoffRoot = resolve(workspaceRoot, '_pattern-lib')
export const catalog = JSON.parse(
  readFileSync(resolve(handoffRoot, 'catalog/catalog.json'), 'utf8'),
) as HandoffCatalog
export const patternCatalog = JSON.parse(
  readFileSync(resolve(patternHandoffRoot, 'catalog/catalog.json'), 'utf8'),
) as PatternHandoffCatalog

export const componentRoutes = catalog.components.map((entry) => {
  const manifest = JSON.parse(readHandoffFile(entry.manifest!)) as ComponentManifest
  return {
    ...entry,
    route: `/design-system/components/${entry.id}`,
    states: manifest.previews[0]?.states ?? [],
  }
})

export const deferredRoutes = catalog.deferredComponents.map((entry) => ({
  ...entry,
  route: `/design-system/roadmap/${entry.id}`,
}))

export const recipeRoutes = [
  ...catalog.recipes.map((entry) => ({ ...entry, sourcePackage: 'component-library' as const })),
  ...patternCatalog.patterns.map((entry) => ({ ...entry, sourcePackage: 'pattern-library' as const })),
].map((entry) => ({
    ...entry,
    route: `/design-system/patterns/${entry.id}`,
  }))

export const foundationRoutes = catalog.foundations.map((entry) => ({
  ...entry,
  title: entry.id === 'brands' ? 'Themes' : entry.title,
  route: entry.id === 'brands'
    ? '/design-system/foundations/themes'
    : `/design-system/foundations/${entry.id}`,
}))

export function readHandoffFile(path: string): string {
  return readFileSync(resolve(handoffRoot, path), 'utf8')
}

export function observeRuntimeErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`))
  page.on('requestfailed', (request) => {
    errors.push(`request: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'failed'})`)
  })
  return errors
}

export async function openDeveloperRoute(
  page: Page,
  route: string,
  title: string,
): Promise<void> {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response?.ok(), `${route} should return a successful document response`).toBe(true)
  await expect(page.locator('[data-developer-route-content] h1').first()).toHaveText(title)
  await expect(page.getByRole('status', { name: 'Loading Design System documentation' })).toHaveCount(0)
}

export async function expectPreviewReady(page: Page): Promise<void> {
  const preview = page.locator('[data-ui-preview="true"]')
  await expect(preview).toBeVisible()
  await expect(preview.getByText('Loading preview…', { exact: true })).toHaveCount(0)
  await expect(preview.getByText('Live preview unavailable', { exact: true })).toHaveCount(0)
  await expect(preview.getByText('Preview could not load', { exact: true })).toHaveCount(0)
  await expect(preview.getByText('Preview could not render', { exact: true })).toHaveCount(0)
}

export function expectNoRuntimeErrors(errors: string[], route: string): void {
  expect(errors.splice(0), `Unexpected runtime failures on ${route}`).toEqual([])
}
