import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { componentRoutes, observeRuntimeErrors, expectNoRuntimeErrors } from './developer.helpers'

test.describe('Components collection discovery', () => {
  test('defaults to a compact alphabetized All Components list', async ({ page }) => {
    const runtimeErrors = observeRuntimeErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/design-system/components')

    await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'All Components' })).toBeVisible()
    await expect(page.getByRole('searchbox', { name: 'Search components' })).toBeVisible()

    const view = page.getByRole('group', { name: 'Component view' })
    await expect(view.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'true')
    await expect(view.getByRole('button', { name: 'Card view' })).toHaveAttribute('aria-pressed', 'false')

    const links = page.getByRole('list', { name: 'All components' }).getByRole('link')
    await expect(links).toHaveCount(componentRoutes.length)
    const labels = await links.evaluateAll(elements => elements.map(element => element.querySelector('span')?.textContent?.trim() ?? ''))
    expect(labels).toEqual([...labels].sort((left, right) => left.localeCompare(right)))
    await expect(page.locator('[data-component-card-grid]')).toHaveCount(0)
    expectNoRuntimeErrors(runtimeErrors, '/design-system/components')
  })

  test('filters from the URL and provides a recoverable empty state', async ({ page }) => {
    await page.goto('/design-system/components')
    const search = page.getByRole('searchbox', { name: 'Search components' })

    await search.fill('calendar')
    await expect(page).toHaveURL(/[?&]q=calendar(?:&|$)/)
    await expect(page.getByRole('list', { name: 'All components' }).getByRole('link')).toHaveCount(1)
    await expect(page.getByRole('link', { name: /Calendar/i })).toBeVisible()
    await expect(page.getByRole('status')).toContainText(`1 of ${componentRoutes.length} components`)

    await page.reload()
    await expect(search).toHaveValue('calendar')
    await search.fill('not-a-component-name')
    await expect(page.getByRole('heading', { name: 'No components found' })).toBeVisible()
    await page.getByRole('button', { name: 'Clear search' }).click()
    await expect(page).not.toHaveURL(/[?&]q=/)
    await expect(page.getByRole('list', { name: 'All components' }).getByRole('link')).toHaveCount(componentRoutes.length)
  })

  test('switches to lazy compact preview cards without mounting the full catalogue', async ({ page }) => {
    const runtimeErrors = observeRuntimeErrors(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/design-system/components')

    await page.getByRole('group', { name: 'Component view' }).getByRole('button', { name: 'Card view' }).click()
    await expect(page).toHaveURL(/[?&]layout=cards(?:&|$)/)
    await expect(page.locator('[data-component-preview-card]')).toHaveCount(componentRoutes.length)

    const loadedThumbnails = page.locator('[data-component-card-grid] section[data-preview-entry]')
    await expect(loadedThumbnails.first()).toBeAttached()
    await expect(loadedThumbnails.first()).toHaveAttribute('data-preview-status', 'ready')
    expect(await loadedThumbnails.count()).toBeLessThan(componentRoutes.length)

    const firstCanvas = loadedThumbnails.first().locator('[data-ui-preview="true"]')
    await expect(firstCanvas).toHaveAttribute('aria-hidden', 'true')
    expect(await firstCanvas.evaluate(element => (element as HTMLElement).inert)).toBe(true)
    const previewBox = await loadedThumbnails.first().locator('..').boundingBox()
    expect(previewBox?.height).toBeLessThanOrEqual(176)

    await page.reload()
    await expect(page.getByRole('group', { name: 'Component view' }).getByRole('button', { name: 'Card view' })).toHaveAttribute('aria-pressed', 'true')
    expectNoRuntimeErrors(runtimeErrors, '/design-system/components?layout=cards')
  })

  test('keeps both collection layouts free of unexpected WCAG A/AA findings', async ({ page }) => {
    await page.goto('/design-system/components')
    let results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])

    await page.getByRole('button', { name: 'Card view' }).click()
    await expect(page.locator('[data-component-card-grid] section[data-preview-entry]').first()).toHaveAttribute('data-preview-status', 'ready')
    results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
})
