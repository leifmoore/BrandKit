import { expect, test, type Locator } from '@playwright/test'
import { expectPreviewReady, openDeveloperRoute } from './developer.helpers'

interface CalendarGeometry {
  canvasWidth: number
  contentWidth: number
  calendarWidth: number
  canvasScrollWidth: number
  canvasClientWidth: number
  contentScrollWidth: number
  contentClientWidth: number
}

async function readCalendarGeometry(livePreview: Locator): Promise<CalendarGeometry> {
  return livePreview.evaluate((section) => {
    const canvas = section.querySelector<HTMLElement>('[data-ui-preview="true"]')
    const content = canvas?.querySelector<HTMLElement>(':scope > div[data-ui-theme] > div')
    const calendar = content?.firstElementChild as HTMLElement | null
    if (!canvas || !content || !calendar) throw new Error('Calendar preview geometry is unavailable.')

    return {
      canvasWidth: canvas.getBoundingClientRect().width,
      contentWidth: content.getBoundingClientRect().width,
      calendarWidth: calendar.getBoundingClientRect().width,
      canvasScrollWidth: canvas.scrollWidth,
      canvasClientWidth: canvas.clientWidth,
      contentScrollWidth: content.scrollWidth,
      contentClientWidth: content.clientWidth,
    }
  })
}

test.describe('Calendar preview presentation', () => {
  test('hugs its content at tablet and desktop preview widths', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await openDeveloperRoute(page, '/design-system/components/calendar', 'Calendar')
    await expectPreviewReady(page)

    const livePreview = page.locator('section[data-preview-entry="calendar"]')
    const canvas = livePreview.locator('[data-ui-preview="true"]')
    await expect(canvas).toHaveAttribute('data-preview-layout', 'intrinsic')

    for (const viewport of ['tablet', 'desktop'] as const) {
      await livePreview.getByLabel('Viewport').selectOption(viewport)
      await expect(canvas).toHaveAttribute('data-ui-width', viewport)

      const geometry = await readCalendarGeometry(livePreview)
      expect(geometry.contentWidth).toBeLessThanOrEqual(352)
      expect(geometry.calendarWidth).toBeLessThanOrEqual(352)
      expect(geometry.contentWidth).toBeLessThan(geometry.canvasWidth * 0.6)
    }
  })

  test('remains bounded without page or preview-content overflow at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openDeveloperRoute(page, '/design-system/components/calendar', 'Calendar')
    await expectPreviewReady(page)

    const livePreview = page.locator('section[data-preview-entry="calendar"]')
    const canvas = livePreview.locator('[data-ui-preview="true"]')
    await livePreview.getByLabel('Viewport').selectOption('mobile')
    await expect(canvas).toHaveAttribute('data-ui-width', 'mobile')
    await expect(canvas).toHaveAttribute('data-preview-layout', 'intrinsic')

    const geometry = await readCalendarGeometry(livePreview)
    expect(geometry.contentWidth).toBeLessThanOrEqual(352)
    expect(geometry.calendarWidth).toBeLessThanOrEqual(geometry.contentWidth)
    expect(geometry.contentScrollWidth).toBeLessThanOrEqual(geometry.contentClientWidth)
    expect(geometry.canvasScrollWidth).toBeLessThanOrEqual(geometry.canvasClientWidth)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
})
