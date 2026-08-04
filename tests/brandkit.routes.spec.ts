import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const canonicalRoutes = [
  { path: '/brand', heading: 'Scudamore’s Brand' },
  { path: '/brand/quick-reference', heading: 'Quick Reference' },
  { path: '/brand/identity/colour', heading: 'Colour Palette' },
  { path: '/brand/identity/logo', heading: 'Logo & Usage' },
  { path: '/brand/identity/typography', heading: 'Typography' },
  { path: '/brand/expression/voice', heading: 'Voice & Tone' },
  { path: '/brand/expression/photography', heading: 'Photography' },
  { path: '/brand/expression/graphics', heading: 'Graphics & Icons' },
  { path: '/brand/expression/playground', heading: 'Brand Playground' },
  { path: '/brand/applications', heading: 'Brand Applications' },
  { path: '/brand/resources', heading: 'Downloads' },
  { path: '/design-system/foundations/themes', heading: 'Themes' },
  { path: '/design-system/foundations/accessibility', heading: 'Accessibility' },
  { path: '/design-system/foundations/data-visualisation', heading: 'Charts' },
  { path: '/design-system/resources', heading: 'Build from the canonical source.' },
] as const

test('canonical Brand and Design System routes render responsively without unexpected WCAG A/AA findings', async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 360, height: 800 })

  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  for (const route of canonicalRoutes) {
    await page.goto(route.path)
    await expect(page).toHaveURL(route.path)
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()

    const overflowEvidence = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth
      return {
        amount: document.documentElement.scrollWidth - viewportWidth,
        offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map(element => ({
            element,
            rect: element.getBoundingClientRect(),
          }))
          .filter(({ rect }) => rect.right > viewportWidth + 1)
          .slice(0, 8)
          .map(({ element, rect }) => ({
            tag: element.tagName.toLowerCase(),
            id: element.id,
            className: element.className.toString().slice(0, 160),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          })),
      }
    })
    expect(
      overflowEvidence.amount,
      `Unexpected viewport overflow on ${route.path}: ${JSON.stringify(overflowEvidence.offenders)}`,
    ).toBeLessThanOrEqual(1)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, `Unexpected axe findings on ${route.path}`).toEqual([])
  }

  expect(consoleErrors).toEqual([])
})
