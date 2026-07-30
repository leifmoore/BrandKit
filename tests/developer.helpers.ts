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

interface ComponentManifestPreview {
  states: string[]
}

interface ComponentManifest {
  previews: ComponentManifestPreview[]
}

export const workspaceRoot = resolve(process.cwd())
export const handoffRoot = resolve(workspaceRoot, '_comp-lib')
export const catalog = JSON.parse(
  readFileSync(resolve(handoffRoot, 'catalog/catalog.json'), 'utf8'),
) as HandoffCatalog

export const componentRoutes = catalog.components.map((entry) => {
  const manifest = JSON.parse(readHandoffFile(entry.manifest!)) as ComponentManifest
  return {
    ...entry,
    route: `/developer/components/${entry.id}`,
    states: manifest.previews[0]?.states ?? [],
  }
})

export const deferredRoutes = catalog.deferredComponents.map((entry) => ({
  ...entry,
  route: `/developer/components/${entry.id}`,
}))

export const recipeRoutes = catalog.recipes.map((entry) => ({
  ...entry,
  route: `/developer/patterns/${entry.id}`,
}))

export const foundationRoutes = catalog.foundations.map((entry) => ({
  ...entry,
  route: `/developer/foundations/${entry.id}`,
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  await expect(page.getByRole('status', { name: 'Loading Developer documentation' })).toHaveCount(0)
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
