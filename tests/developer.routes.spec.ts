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

test.describe('Design System catalogue routes', () => {
  test('renders every supported component in a preview-first workbench', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of componentRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expectPreviewReady(page)

      const workbench = page.getByRole('region', { name: `${entry.title} workbench` })
      const workbenchTabs = workbench.getByRole('tablist', { name: 'Workbench view' })
      const livePreview = workbench.locator(`section[data-preview-entry="${entry.id}"]`)
      await expect(workbenchTabs.getByRole('tab', { name: 'Preview', exact: true })).toHaveAttribute('aria-selected', 'true')
      await expect(workbenchTabs.getByRole('tab', { name: 'React', exact: true })).toBeVisible()
      await expect(workbenchTabs.getByRole('tab', { name: 'Blade', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Copy', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Documentation', exact: true })).toBeVisible()
      await expect(livePreview.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-state', 'default')
      await expect(page.locator('#usage')).toBeVisible()
      expect(
        await page.locator('article').evaluate((article) => {
          const workbenchNode = article.querySelector('[aria-label$=" workbench"]')
          const usage = article.querySelector('#usage')
          return Boolean(
            workbenchNode
            && usage
            && (workbenchNode.compareDocumentPosition(usage) & Node.DOCUMENT_POSITION_FOLLOWING),
          )
        }),
        'The interactive workbench should precede the expanded Usage summary.',
      ).toBe(true)
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('renders every fixture-backed pattern in the same workbench contract', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of recipeRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expectPreviewReady(page)
      const workbench = page.getByRole('region', { name: `${entry.title} workbench` })
      const workbenchTabs = workbench.getByRole('tablist', { name: 'Workbench view' })
      await expect(workbenchTabs.getByRole('tab', { name: 'Preview', exact: true })).toHaveAttribute('aria-selected', 'true')
      await expect(workbenchTabs.getByRole('tab', { name: 'React', exact: true })).toBeVisible()
      await expect(workbenchTabs.getByRole('tab', { name: 'Blade', exact: true })).toBeVisible()
      await expect(workbenchTabs.getByRole('tab', { name: 'Fixture / example', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Copy', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
      await expect(workbench.getByRole('button', { name: 'Documentation', exact: true })).toBeVisible()
      await expect(page.locator('#usage')).toBeVisible()
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('renders every foundation with its maintained source', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of foundationRoutes) {
      if (entry.id === 'brands') {
        const response = await page.goto(entry.route, { waitUntil: 'domcontentloaded' })
        expect(response?.ok()).toBe(true)
        await expect(page).toHaveURL(/\/design-system\/foundations\/themes$/)
        await expect(page.getByRole('heading', { level: 1, name: 'Themes' })).toBeVisible()
        expectNoRuntimeErrors(runtimeErrors, entry.route)
        continue
      }
      await openDeveloperRoute(page, entry.route, entry.title)
      await expect(page.locator('#source pre code').first()).toBeVisible()
      if (entry.id === 'tokens') await expectPreviewReady(page)
      const sourceActions = page.locator('#source').getByRole('button', { name: /^(Copy|Download) / })
      if (entry.id === 'tokens' || entry.id === 'typography') {
        await expect(sourceActions.first()).toBeVisible()
      } else {
        await expect(sourceActions).toHaveCount(0)
      }
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('keeps every roadmap entry inventory-only', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of deferredRoutes) {
      await openDeveloperRoute(page, entry.route, entry.title)
      await expect(page.locator('#availability')).toContainText('Preview and copy actions are unavailable')
      await expect(page.locator('[data-ui-preview="true"]')).toHaveCount(0)
      await expect(page.getByRole('button', { name: /^Copy(?: |$)/ })).toHaveCount(0)
      await expect(page.getByRole('button', { name: /^Download(?: |$)/ })).toHaveCount(0)
      expectNoRuntimeErrors(runtimeErrors, entry.route)
    }
  })

  test('uses collection routes, one workspace navigation, and explicit not-found states', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })

    await page.goto('/design-system/components')
    await expect(page).toHaveURL(/\/design-system\/components$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
    await expect(page.locator('a[href^="/design-system/components/"]')).toHaveCount(componentRoutes.length)
    await expect(page.getByRole('navigation', { name: 'Design System navigation' })).toHaveCount(1)
    await expect(page.getByRole('complementary', { name: 'Design System catalogue navigation' })).toHaveCount(0)
    await expect(page.getByText('Design System navigation', { exact: true })).toHaveCount(0)

    await page.goto('/design-system/patterns')
    await expect(page.getByRole('heading', { level: 1, name: 'Patterns' })).toBeVisible()
    await expect(page.locator('a[href^="/design-system/patterns/"]')).toHaveCount(recipeRoutes.length)

    await page.goto('/design-system/roadmap')
    await expect(page.getByRole('heading', { level: 1, name: 'Roadmap' })).toBeVisible()
    await expect(page.locator('a[href^="/design-system/roadmap/"]')).toHaveCount(deferredRoutes.length)

    await page.goto('/developer/components/carousel')
    await expect(page).toHaveURL(/\/design-system\/roadmap\/carousel$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Carousel' })).toBeVisible()
    await expect(page.locator('#availability')).toContainText('Preview and copy actions are unavailable')

    await page.goto('/design-system/components/not-a-real-component')
    await expect(page.getByText('Design System page not found', { exact: true })).toBeVisible()

    await page.goto('/design-system/not-a-real-route')
    await expect(page.getByText('Design System page not found', { exact: true })).toBeVisible()
  })

  test('provides back and cyclic sibling navigation on component and pattern details', async ({ page }) => {
    await openDeveloperRoute(page, componentRoutes[0]!.route, componentRoutes[0]!.title)
    const componentNavigation = page.getByRole('navigation', { name: 'Component navigation' })
    await expect(componentNavigation.getByRole('link', { name: 'Back to all components' })).toHaveAttribute('href', '/design-system/components')
    await expect(componentNavigation.getByRole('link', { name: /^Previous:/ })).toHaveAttribute('href', /^\/design-system\/components\//)
    const nextComponent = componentNavigation.getByRole('link', { name: /^Next:/ })
    const nextComponentHref = await nextComponent.getAttribute('href')
    expect(nextComponentHref).not.toBe(componentRoutes[0]!.route)
    await nextComponent.click()
    await expect(page).toHaveURL(new RegExp(`${nextComponentHref!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))

    await openDeveloperRoute(page, recipeRoutes[0]!.route, recipeRoutes[0]!.title)
    const patternNavigation = page.getByRole('navigation', { name: 'Pattern navigation' })
    await expect(patternNavigation.getByRole('link', { name: 'Back to all patterns' })).toHaveAttribute('href', '/design-system/patterns')
    await expect(patternNavigation.getByRole('link', { name: /^Previous:/ })).toHaveAttribute('href', /^\/design-system\/patterns\//)
    await expect(patternNavigation.getByRole('link', { name: /^Next:/ })).toHaveAttribute('href', /^\/design-system\/patterns\//)
  })
})
