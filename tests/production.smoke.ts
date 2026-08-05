import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('the Vercel deployment config sends application routes to the SPA entry point', async () => {
  const config = JSON.parse(
    await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
  ) as {
    $schema?: string
    rewrites?: Array<{ source?: string; destination?: string }>
  }

  expect(config.$schema).toBe('https://openapi.vercel.sh/vercel.json')
  expect(config.rewrites).toContainEqual({
    source: '/(.*)',
    destination: '/index.html',
  })
})

test('the production build serves shared routes and preserves them across reloads', async ({ page }) => {
  const runtimeErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`))
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname
    if (
      response.status() >= 400
      && (pathname.startsWith('/assets/') || pathname.startsWith('/logos/'))
    ) {
      runtimeErrors.push(`asset: ${response.status()} ${response.url()}`)
    }
  })

  const rootResponse = await page.goto('/', { waitUntil: 'domcontentloaded' })
  expect(rootResponse?.ok(), 'The production root document should load').toBe(true)
  await expect(page.getByRole('heading', { level: 1, name: 'Scudamore’s Brand' })).toBeVisible()
  const brandStatement = page.getByRole('region', { name: 'Brand statement' })
  await expect(brandStatement.locator('p').filter({ hasText: 'Where Cambridge' })).toHaveText(
    /Where Cambridge\s*goes punting\./,
  )

  const collectionResponse = await page.goto('/design-system/components?layout=cards', {
    waitUntil: 'domcontentloaded',
  })
  expect(collectionResponse?.ok(), 'The shared Components URL should load').toBe(true)
  await expect(page).toHaveURL(/\/design-system\/components\?layout=cards$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
  await expect(
    page.getByRole('group', { name: 'Component view' }).getByRole('button', { name: 'Card view' }),
  ).toHaveAttribute('aria-pressed', 'true')

  const reloadedCollectionResponse = await page.reload({ waitUntil: 'domcontentloaded' })
  expect(reloadedCollectionResponse?.ok(), 'The shared Components URL should survive a hard reload').toBe(true)
  await expect(page).toHaveURL(/\/design-system\/components\?layout=cards$/)
  await expect(page.getByRole('heading', { level: 2, name: 'All Components' })).toBeVisible()

  const deepResponse = await page.goto('/design-system/components/button', {
    waitUntil: 'domcontentloaded',
  })
  expect(deepResponse?.ok(), 'The production server should serve the SPA deep link').toBe(true)
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()

  const livePreview = page.locator('section[data-preview-entry="button"]')
  await expect(livePreview).toHaveAttribute('data-preview-status', 'ready')
  await expect(livePreview.locator('[data-ui-preview="true"]')).toBeVisible()

  const workbench = page.getByRole('region', { name: 'Button workbench' })
  await workbench.getByRole('tab', { name: 'React', exact: true }).click()
  await expect(workbench.locator('pre:visible code').first()).toContainText(
    'import { Button } from "../../components/ui/button"',
  )

  const brandResponse = await page.goto('/brand/identity/colour', {
    waitUntil: 'domcontentloaded',
  })
  expect(brandResponse?.ok(), 'A Brand workspace deep link should load').toBe(true)
  await expect(page.getByRole('heading', { level: 1, name: 'Colour Palette' })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('the production build serves static assets as files rather than HTML', async ({ request }) => {
  const indexResponse = await request.get('/')
  expect(indexResponse.ok(), 'The production entry document should load').toBe(true)
  const indexHtml = await indexResponse.text()
  const builtAssetPaths = Array.from(
    indexHtml.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g),
    (match) => match[1],
  )

  const scriptPath = builtAssetPaths.find((path) => path.endsWith('.js'))
  const stylesheetPath = builtAssetPaths.find((path) => path.endsWith('.css'))
  expect(scriptPath, 'The production document should reference a built JavaScript asset').toBeTruthy()
  expect(stylesheetPath, 'The production document should reference a built stylesheet').toBeTruthy()

  const scriptResponse = await request.get(scriptPath!)
  expect(scriptResponse.ok(), 'The built JavaScript asset should load').toBe(true)
  expect(scriptResponse.headers()['content-type']).toMatch(/(?:application|text)\/javascript/)

  const stylesheetResponse = await request.get(stylesheetPath!)
  expect(stylesheetResponse.ok(), 'The built stylesheet should load').toBe(true)
  expect(stylesheetResponse.headers()['content-type']).toContain('text/css')
  const stylesheet = await stylesheetResponse.text()
  const fontReference = stylesheet.match(/url\(([^)]+\.woff2)\)/)?.[1]?.replace(/["']/g, '')
  expect(fontReference, 'The built stylesheet should reference a font asset').toBeTruthy()

  const fontUrl = new URL(fontReference!, new URL(stylesheetPath!, 'http://127.0.0.1:4174'))
  const fontResponse = await request.get(`${fontUrl.pathname}${fontUrl.search}`)
  expect(fontResponse.ok(), 'The built font asset should load').toBe(true)
  expect(fontResponse.headers()['content-type']).toMatch(/font\/woff2|application\/font-woff2/)

  const logoResponse = await request.get('/logos/logo-full.svg')
  expect(logoResponse.ok(), 'The public SVG asset should load').toBe(true)
  expect(logoResponse.headers()['content-type']).toContain('image/svg+xml')
})
