import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expectNoRuntimeErrors, expectPreviewReady, observeRuntimeErrors, openDeveloperRoute } from './developer.helpers'

const patternRoot = resolve(process.cwd(), '_pattern-lib')
const patternCatalog = JSON.parse(
  readFileSync(resolve(patternRoot, 'catalog/catalog.json'), 'utf8'),
) as { patterns: { id: string; title: string; manifest: string }[] }

test.describe('Pattern Library add-on integration', () => {
  test('merges 25 add-on patterns with six base patterns and exposes manifest search and retained findings', async ({ page }) => {
    await page.goto('/design-system/patterns')
    await expect(page.getByRole('heading', { level: 1, name: 'Patterns' })).toBeVisible()
    await expect(page.locator('a[href^="/design-system/patterns/"]')).toHaveCount(31)
    await expect(page.locator('[data-pattern-preview-card]')).toHaveCount(31)
    await expect(page.locator('[data-pattern-card-grid] section[data-preview-entry]').first()).toHaveAttribute('data-preview-status', 'ready')
    await expect(page.getByRole('heading', { name: '2 retained visual-parity accessibility findings' })).toBeVisible()
    await expect(page.getByText('3.66:1 in light mode and 4.01:1 in dark mode', { exact: false })).toBeVisible()
    await expect(page.getByText('selected-query pill measures 3.66:1 in light mode and 3.66:1 in dark mode', { exact: false })).toBeVisible()

    await page.getByRole('searchbox', { name: 'Search patterns' }).fill('safe area')
    await expect(page.getByText('2 of 31 patterns')).toBeVisible()
    await expect(page.getByRole('link', { name: /Contextual Action Dock/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Mobile Bottom Navigation/ })).toBeVisible()

    await page.getByRole('button', { name: 'Clear pattern search' }).click()
    await page.getByRole('searchbox', { name: 'Search patterns' }).fill('selected-query pill')
    await expect(page.getByText('2 of 31 patterns')).toBeVisible()
    await expect(page.getByRole('link', { name: /EPOS Booking Journey/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Multi-query Manager/ })).toBeVisible()
  })

  test('uses the generated registry scenarios and exact manifest-declared source files', async ({ page }) => {
    const runtimeErrors = observeRuntimeErrors(page)
    const entry = patternCatalog.patterns.find(({ id }) => id === 'booking-review-summary')!
    const manifest = JSON.parse(
      readFileSync(resolve(patternRoot, entry.manifest), 'utf8'),
    ) as {
      scenarios: { id: string; title: string; fixture: string }[]
      react: { files: string[] }
      blade: { files: string[] }
    }

    await openDeveloperRoute(page, `/design-system/patterns/${entry.id}`, entry.title)
    await expectPreviewReady(page)

    const detailNavigation = page.getByRole('navigation', { name: 'Pattern navigation' })
    await expect(detailNavigation.getByRole('link', { name: 'Back to all patterns' })).toHaveAttribute('href', '/design-system/patterns')
    await expect(detailNavigation.getByRole('link', { name: /^Previous:/ })).toHaveAttribute('href', /^\/design-system\/patterns\//)
    await expect(detailNavigation.getByRole('link', { name: /^Next:/ })).toHaveAttribute('href', /^\/design-system\/patterns\//)

    const workbench = page.getByRole('region', { name: `${entry.title} workbench` })
    await workbench.getByRole('group', { name: 'Preview controls' }).getByRole('button', { name: 'More' }).click()
    const scenario = page.getByLabel('Scenario')
    await expect(scenario).toHaveValue(manifest.scenarios[0]!.id)
    await expect(scenario.locator('option')).toHaveCount(manifest.scenarios.length)
    await scenario.selectOption('collapsed')
    await expect(workbench.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-width', 'mobile')
    await expect(workbench.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-state', 'collapsed')

    await workbench.getByRole('tab', { name: 'React', exact: true }).click()
    await expect(workbench.getByText(`_pattern-lib/${manifest.react.files[0]}`, { exact: true })).toBeVisible()

    await workbench.getByRole('tab', { name: 'Blade', exact: true }).click()
    await expect(workbench.getByText(`_pattern-lib/${manifest.blade.files[0]}`, { exact: true })).toBeVisible()

    await workbench.getByRole('tab', { name: 'Fixture / example', exact: true }).click()
    for (const declaredScenario of manifest.scenarios) {
      await expect(workbench.getByText(declaredScenario.fixture.split('/').at(-1)!, { exact: true })).toBeVisible()
    }

    await workbench.getByRole('button', { name: 'Documentation', exact: true }).click()
    const documentation = page.getByRole('dialog', { name: `${entry.title} documentation` })
    for (const section of ['API', 'Dependencies', 'Accessibility', 'Parity']) {
      await expect(documentation.getByRole('button', { name: section, exact: true })).toBeVisible()
    }
    expectNoRuntimeErrors(runtimeErrors, entry.id)
  })

  test('contains viewport-positioned pattern chrome inside its preview canvas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/design-system/patterns')
    await page.getByRole('searchbox', { name: 'Search patterns' }).fill('mobile bottom navigation')

    const card = page.locator('[data-pattern-preview-card="mobile-bottom-navigation"]')
    const cardPreview = card.locator('[data-ui-preview="true"]')
    const cardNavigation = card.locator('nav[aria-label="Primary navigation"]')
    await expect(cardPreview).toHaveAttribute('data-preview-viewport-containment', 'true')
    await expect(cardNavigation).toBeVisible()

    const cardBounds = await cardPreview.boundingBox()
    const cardNavigationBounds = await cardNavigation.boundingBox()
    expect(cardBounds).not.toBeNull()
    expect(cardNavigationBounds).not.toBeNull()
    expect(cardNavigationBounds!.y).toBeGreaterThanOrEqual(cardBounds!.y)
    expect(cardNavigationBounds!.y + cardNavigationBounds!.height).toBeLessThanOrEqual(cardBounds!.y + cardBounds!.height + 1)

    await openDeveloperRoute(page, '/design-system/patterns/mobile-bottom-navigation', 'Mobile Bottom Navigation')
    await expectPreviewReady(page)
    const detailPreview = page.locator('section[data-preview-entry="mobile-bottom-navigation"] [data-ui-preview="true"]')
    const detailNavigation = detailPreview.locator('nav[aria-label="Primary navigation"]')
    const previewBounds = await detailPreview.boundingBox()
    const navigationBounds = await detailNavigation.boundingBox()
    expect(previewBounds).not.toBeNull()
    expect(navigationBounds).not.toBeNull()
    expect(navigationBounds!.y).toBeGreaterThanOrEqual(previewBounds!.y)
    expect(navigationBounds!.y + navigationBounds!.height).toBeLessThanOrEqual(previewBounds!.y + previewBounds!.height + 1)
  })

  test('renders every add-on pattern from the generated live preview registry', async ({ page }) => {
    test.slow()
    const runtimeErrors = observeRuntimeErrors(page)

    for (const entry of patternCatalog.patterns) {
      await openDeveloperRoute(page, `/design-system/patterns/${entry.id}`, entry.title)
      await expectPreviewReady(page)
      await page.getByRole('group', { name: 'Preview controls' }).getByRole('button', { name: 'More' }).click()
      await expect(page.getByLabel('Scenario')).toBeVisible()
      expectNoRuntimeErrors(runtimeErrors, entry.id)
    }
  })
})
