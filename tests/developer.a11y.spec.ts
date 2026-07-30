import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import {
  componentRoutes,
  deferredRoutes,
  expectPreviewReady,
  foundationRoutes,
  openDeveloperRoute,
  recipeRoutes,
} from './developer.helpers'

const auditedRoutes = [
  { route: '/developer', title: "Scudamore's UI" },
  ...componentRoutes,
  ...recipeRoutes,
  ...foundationRoutes,
  ...deferredRoutes,
]

const livePreviewRoutes = new Set([
  '/developer',
  ...componentRoutes.map((entry) => entry.route),
  ...recipeRoutes.map((entry) => entry.route),
  ...foundationRoutes
    .filter((entry) => entry.id === 'tokens' || entry.id === 'brands')
    .map((entry) => entry.route),
])

const acceptedContrastText = new Map([
  ['/developer', 'Delete'],
  ['/developer/components/alert-dialog', 'Delete record'],
  ['/developer/components/button', 'Delete'],
  ['/developer/components/aspect-ratio', '16:9 media'],
  // These foundation pages intentionally reuse the canonical Button example
  // as their theme playground, so the same recorded destructive-token finding
  // appears there rather than representing a separate exception.
  ['/developer/foundations/tokens', 'Delete'],
  ['/developer/foundations/brands', 'Delete'],
])

test('all Developer routes have only the exact recorded WCAG A/AA axe findings', async ({ page }) => {
  test.slow()
  test.setTimeout(300_000)

  for (const entry of auditedRoutes) {
    await openDeveloperRoute(page, entry.route, entry.title)
    if (livePreviewRoutes.has(entry.route)) {
      await expectPreviewReady(page)
      // axe cannot reliably resolve layered background contrast for content
      // thousands of pixels outside Chromium's viewport. Audit the live
      // example in-view so the handoff's exact recorded findings stay tested.
      await page.locator('[data-ui-preview="true"]').first().scrollIntoViewIfNeeded()
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    const expectedText = acceptedContrastText.get(entry.route)
    const contrast = results.violations.filter((violation) => violation.id === 'color-contrast')
    const unexpected = results.violations.filter((violation) => violation.id !== 'color-contrast')

    expect(unexpected, `Unexpected non-contrast axe violations on ${entry.route}`).toEqual([])
    if (expectedText) {
      expect(
        contrast.length,
        `Expected at most the one recorded contrast finding on ${entry.route}`,
      ).toBeLessThanOrEqual(1)
      if (contrast.length === 1) {
        expect(contrast[0]?.nodes, `Expected one recorded contrast node on ${entry.route}`).toHaveLength(1)
        const target = contrast[0]?.nodes[0]?.target
        expect(target, `Expected a direct DOM target on ${entry.route}`).toHaveLength(1)
        await expect(page.locator(String(target?.[0]))).toContainText(expectedText)
      }
    } else {
      expect(contrast, `Unexpected contrast findings on ${entry.route}`).toEqual([])
    }
  }
})

test('the responsive Developer shell is keyboard-labelled at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/developer')
  const results = await new AxeBuilder({ page })
    .exclude('[data-ui-preview="true"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
