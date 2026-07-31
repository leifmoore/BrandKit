import { mkdir } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const routes = [
  { label: 'Overview', path: '/brand', heading: 'Scudamore’s Brand' },
  { label: 'Quick Reference', path: '/brand/quick-reference', heading: 'Quick Reference' },
  { label: 'Logo', path: '/brand/identity/logo', heading: 'Logo & Usage' },
  { label: 'Colour', path: '/brand/identity/colour', heading: 'Colour Palette' },
  { label: 'Typography', path: '/brand/identity/typography', heading: 'Typography' },
  { label: 'Voice', path: '/brand/expression/voice', heading: 'Voice & Tone' },
  { label: 'Photography', path: '/brand/expression/photography', heading: 'Photography' },
  { label: 'Graphics', path: '/brand/expression/graphics', heading: 'Graphics & Icons' },
  { label: 'Playground', path: '/brand/expression/playground', heading: 'Brand Playground' },
  { label: 'Applications', path: '/brand/applications', heading: 'Brand Applications' },
  { label: 'Resources', path: '/brand/resources', heading: 'Downloads' },
] as const

test('captures Brand routes at top, middle, and bottom positions', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.metadata.captureBrandAudit !== true, 'Run npm run audit:brand:visual to generate the manual Brand route contact sheet.')
  test.slow()
  await page.setViewportSize({ width: 1440, height: 900 })
  const outputDirectory = testInfo.outputPath('brand-route-audit')
  await mkdir(outputDirectory, { recursive: true })
  const captures: Array<{ label: string; position: string; data: string }> = []

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    await expect(page.locator('aside').first().getByText('Brand Kit', { exact: true })).toBeVisible()
    await page.evaluate(() => new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()))
    }))
    const main = page.locator('main')

    for (const [position, ratio] of [['top', 0], ['middle', 0.5], ['bottom', 1]] as const) {
      await main.evaluate((element, scrollRatio) => {
        element.scrollTop = (element.scrollHeight - element.clientHeight) * scrollRatio
      }, ratio)
      await page.waitForTimeout(100)
      const screenshot = await page.screenshot({
        path: `${outputDirectory}/${route.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${position}.png`,
        animations: 'disabled',
      })
      captures.push({ label: route.label, position, data: screenshot.toString('base64') })
    }
  }

  const gallery = await context.newPage()
  await gallery.setViewportSize({ width: 1280, height: 720 })
  await gallery.setContent(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 16px; background: #d9dce2; color: #14284b; font: 14px system-ui, sans-serif; }
          h1 { margin: 0 0 16px; font-size: 24px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          figure { margin: 0; overflow: hidden; border: 1px solid #b8bdc7; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgb(20 40 75 / 12%); }
          figcaption { padding: 8px 10px; border-bottom: 1px solid #d9dce2; font-weight: 650; }
          img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
        </style>
      </head>
      <body>
        <h1>Brand route audit · 1440 × 900 · top / middle / bottom</h1>
        <div class="grid">
          ${captures.map((capture) => `<figure><figcaption>${capture.label} · ${capture.position}</figcaption><img src="data:image/png;base64,${capture.data}" alt=""></figure>`).join('')}
        </div>
      </body>
    </html>`)
  await gallery.screenshot({
    path: `${outputDirectory}/contact-sheet.png`,
    fullPage: true,
    animations: 'disabled',
  })
  await gallery.close()
})
