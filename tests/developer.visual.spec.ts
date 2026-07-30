import { expect, test } from '@playwright/test'
import { expectPreviewReady } from './developer.helpers'

const hostViewport = { width: 1920, height: 1080 }

const cases = [
  { name: '360-light-ltr', preset: 'mobile', pixels: 360, mode: 'light', direction: 'ltr' },
  { name: '360-dark-ltr', preset: 'mobile', pixels: 360, mode: 'dark', direction: 'ltr' },
  { name: '768-light-rtl', preset: 'tablet', pixels: 768, mode: 'light', direction: 'rtl' },
  { name: '768-dark-ltr', preset: 'tablet', pixels: 768, mode: 'dark', direction: 'ltr' },
  { name: '1280-light-ltr', preset: 'desktop', pixels: 1280, mode: 'light', direction: 'ltr' },
  { name: '1280-dark-ltr', preset: 'desktop', pixels: 1280, mode: 'dark', direction: 'ltr' },
] as const

for (const visualCase of cases) {
  test(`button preview matches ${visualCase.name} baseline`, async ({ page }) => {
    await page.setViewportSize(hostViewport)
    await page.goto('/developer/components/button')
    await expectPreviewReady(page)
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const livePreview = page.locator('section[data-preview-entry="button"]')
    const preview = livePreview.locator('[data-ui-preview="true"]')

    await livePreview.getByLabel('Mode').selectOption(visualCase.mode)
    if (visualCase.direction === 'rtl') {
      await livePreview.getByRole('button', { name: 'RTL', exact: true }).click()
    }
    await livePreview.getByLabel('Width').selectOption(visualCase.preset)

    await expect(preview).toHaveAttribute('data-ui-width', visualCase.preset)
    await expect(preview).toHaveAttribute('data-ui-theme', visualCase.mode)
    await expect(preview).toHaveAttribute('dir', visualCase.direction)
    await expect.poll(async () => (await preview.boundingBox())?.width).toBe(visualCase.pixels)

    await expect(preview).toHaveScreenshot(
      `developer-button-${visualCase.name}.png`,
    )
  })
}
