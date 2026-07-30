import { expect, test } from '@playwright/test'
import {
  componentRoutes,
  deferredRoutes,
  expectNoRuntimeErrors,
  expectPreviewReady,
  foundationRoutes,
  observeRuntimeErrors,
  openDeveloperRoute,
  recipeRoutes,
} from './developer.helpers'

test.describe('Developer catalogue routes', () => {
  test('renders every supported component with live React and copyable source', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of componentRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expectPreviewReady(page)
      const livePreview = page.locator(`section[data-preview-entry="${entry.id}"]`)
      await expect(livePreview.getByLabel('State')).toBeVisible()
      expect(
        await livePreview.getByLabel('State').locator('option').evaluateAll((options) =>
          options.map((option) => (option as HTMLOptionElement).value),
        ),
      ).toEqual(entry.states)
      await expect(livePreview.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-state', 'default')
      await expect(page.locator('#source pre code').first()).toBeVisible()
      await expect(page.locator('#api')).toBeVisible()
      await expect(page.locator('#accessibility')).toBeVisible()
      await expect(page.locator('#parity')).toBeVisible()
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('renders every fixture-backed pattern with live React and paired source', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of recipeRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expectPreviewReady(page)
      await expect(page.locator('#source pre code').first()).toBeVisible()
      await expect(page.locator('#contract')).toBeVisible()
      await expect(page.getByRole('tab', { name: 'React', exact: true })).toBeVisible()
      await expect(page.getByRole('tab', { name: 'Blade', exact: true })).toBeVisible()
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('renders every foundation with its maintained source', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of foundationRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expect(page.locator('#source pre code').first()).toBeVisible()
      if (entry.id === 'tokens' || entry.id === 'brands') await expectPreviewReady(page)
      const sourceActions = page.locator('#source').getByRole('button', { name: /^(Copy|Download) / })
      if (entry.id === 'tokens' || entry.id === 'brands' || entry.id === 'typography') {
        await expect(sourceActions.first()).toBeVisible()
      } else {
        await expect(sourceActions).toHaveCount(0)
      }
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('keeps every deferred component inventory-only', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of deferredRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expect(page.locator('#availability')).toContainText('Preview and copy actions are unavailable')
      await expect(page.locator('[data-ui-preview="true"]')).toHaveCount(0)
      await expect(page.locator('#source')).toHaveCount(0)
      await expect(page.getByRole('button', { name: /^Copy / })).toHaveCount(0)
      await expect(page.getByRole('button', { name: /^Download / })).toHaveCount(0)
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('handles collection aliases and unknown deep routes explicitly', async ({ page }) => {
    await page.goto('/developer/components')
    await expect(page).toHaveURL(/\/developer$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText("Scudamore's")

    await page.goto('/developer/components/not-a-real-component')
    await expect(page.getByRole('heading', { name: 'Developer page not found' })).toBeVisible()

    await page.goto('/developer/not-a-real-route')
    await expect(page.getByRole('heading', { name: 'Developer page not found' })).toBeVisible()
  })
})
