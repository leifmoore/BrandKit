import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', heading: 'Where Cambridge goes punting.' },
  { path: '/colour', heading: 'Colour Palette' },
  { path: '/logo', heading: 'Logo & Usage' },
  { path: '/typography', heading: 'Typography' },
  { path: '/voice', heading: 'Voice & Tone' },
  { path: '/photography', heading: 'Photography' },
  { path: '/graphics', heading: 'Graphics & Icons' },
  { path: '/charts', heading: 'Charts' },
  { path: '/applications', heading: 'Brand Applications' },
  { path: '/quick-reference', heading: 'Quick Reference' },
  { path: '/downloads', heading: 'Downloads' },
]

test('every Brand Kit route renders responsively without unexpected WCAG A/AA findings', async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 360, height: 800 })

  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  for (const route of routes) {
    await page.goto(route.path)
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(horizontalOverflow, `Unexpected viewport overflow on ${route.path}`).toBeLessThanOrEqual(1)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, `Unexpected axe findings on ${route.path}`).toEqual([])
  }

  expect(consoleErrors).toEqual([])
})
