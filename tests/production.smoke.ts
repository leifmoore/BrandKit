import { expect, test } from '@playwright/test'

test('the production build serves the Brand Kit root and a Developer deep link', async ({ page }) => {
  const runtimeErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`))
  page.on('response', (response) => {
    if (response.status() >= 400 && new URL(response.url()).pathname.startsWith('/assets/')) {
      runtimeErrors.push(`asset: ${response.status()} ${response.url()}`)
    }
  })

  const rootResponse = await page.goto('/', { waitUntil: 'domcontentloaded' })
  expect(rootResponse?.ok(), 'The production root document should load').toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Where Cambridge')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('goes punting.')

  const deepResponse = await page.goto('/developer/components/button', {
    waitUntil: 'domcontentloaded',
  })
  expect(deepResponse?.ok(), 'The production server should serve the SPA deep link').toBe(true)
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()

  const livePreview = page.locator('section[data-preview-entry="button"]')
  await expect(livePreview).toHaveAttribute('data-preview-status', 'ready')
  await expect(livePreview.locator('[data-ui-preview="true"]')).toBeVisible()

  const source = page.locator('#source')
  await expect(source.locator('p[title="react/components/ui/button.tsx"]')).toBeVisible()
  await expect(source.locator('pre[aria-label="button.tsx source code"] code')).toContainText(
    'const Button = React.forwardRef',
  )

  expect(runtimeErrors).toEqual([])
})
