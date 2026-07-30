import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { readHandoffFile, expectPreviewReady, openDeveloperRoute } from './developer.helpers'

test.describe('Developer search, source, and preview controls', () => {
  test('local catalogue search opens the matching entry', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/developer')

    const search = page.getByRole('searchbox', { name: 'Search the Developer catalogue' })
    await search.fill('people popover')
    await expect(page.getByRole('navigation', { name: 'Developer search results' })).toContainText('People Popover Content')
    await page
      .getByRole('navigation', { name: 'Developer search results' })
      .getByRole('link', { name: /People Popover Content/ })
      .click()
    await expect(page).toHaveURL(/\/developer\/patterns\/people-popover-content$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('People Popover Content')
  })

  test('global command palette searches the lazy Developer catalogue', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByPlaceholder('Search brand kit…').fill('booking card')
    await dialog.getByText('Booking Card', { exact: true }).click()
    await expect(page).toHaveURL(/\/developer\/patterns\/booking-card$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Booking Card')
  })

  test('React and Blade source remains byte-faithful and copy/download works', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openDeveloperRoute(page, '/developer/components/button', 'Button')

    const source = page.locator('#source')
    const reactExpected = readHandoffFile('react/components/ui/button.tsx')
    const bladeExpected = readHandoffFile('blade/library/resources/views/components/ui/button.blade.php')

    await source.getByRole('tab', { name: 'button.tsx', exact: true }).click()
    expect(await source.locator('pre:visible code').textContent()).toBe(reactExpected)
    await source.getByRole('button', { name: 'Copy button.tsx', exact: true }).click()
    await expect(source.getByRole('button', { name: 'Copied button.tsx', exact: true })).toBeVisible()
    expect(await page.evaluate(() => (
      navigator as Navigator & { clipboard: { readText: () => Promise<string> } }
    ).clipboard.readText())).toBe(reactExpected)

    const downloadPromise = page.waitForEvent('download')
    await source.getByRole('button', { name: 'Download button.tsx', exact: true }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('button.tsx')
    const downloadedPath = await download.path()
    expect(downloadedPath).not.toBeNull()
    expect(readFileSync(downloadedPath!, 'utf8')).toBe(reactExpected)

    await source.getByRole('tab', { name: 'Blade', exact: true }).click()
    await source.getByRole('tab', { name: 'button.blade.php', exact: true }).click()
    expect(await source.locator('pre:visible code').textContent()).toBe(bladeExpected)
  })

  test('all themes, widths and directions are scoped to the preview', async ({ page }) => {
    await page.goto('/developer')
    await expectPreviewReady(page)

    const playground = page.locator('section[data-preview-entry="button"]').first()
    const preview = playground.locator('[data-ui-preview="true"]')
    const htmlClassBefore = await page.locator('html').getAttribute('class')

    for (const brand of ['default', 'blue', 'emerald', 'red', 'orange', 'slate', 'violet']) {
      await playground.getByLabel('Brand').selectOption(brand)
      await expect(preview).toHaveAttribute('data-ui-brand', brand)
    }

    await playground.getByLabel('Mode').selectOption('dark')
    await expect(preview).toHaveAttribute('data-ui-theme', 'dark')
    expect(await page.locator('html').getAttribute('class')).toBe(htmlClassBefore)

    await playground.getByRole('button', { name: 'RTL', exact: true }).click()
    await expect(preview).toHaveAttribute('dir', 'rtl')

    const widthFrame = preview.locator('..')
    for (const [option, expected] of [
      ['mobile', 'width: 360px'],
      ['tablet', 'width: 768px'],
      ['desktop', 'width: 1280px'],
      ['fluid', 'width: 100%'],
    ] as const) {
      await playground.getByLabel('Width').selectOption(option)
      await expect(widthFrame).toHaveAttribute('style', new RegExp(expected.replace(' ', '\\s*')))
    }
  })

  test('preview-owned Radix portals inherit theme and direction without styling the host', async ({ page }) => {
    await openDeveloperRoute(page, '/developer/components/dialog', 'Dialog')
    const livePreview = page.locator('section[data-preview-entry="dialog"]')
    const hostPrimaryBefore = await page.locator('body').evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--primary'),
    )
    await livePreview.getByLabel('Mode').selectOption('dark')
    await livePreview.getByLabel('Brand').selectOption('violet')
    await livePreview.getByRole('button', { name: 'RTL', exact: true }).click()
    await livePreview.getByRole('button', { name: 'Open dialog', exact: true }).click()

    const portal = page.locator(
      '[data-ds-preview-portal][role="dialog"], [data-ds-preview-portal]:has([role="dialog"])',
    ).first()
    await expect(portal).toHaveAttribute('data-ui-theme', 'dark')
    await expect(portal).toHaveAttribute('data-ui-brand', 'violet')
    await expect(portal).toHaveAttribute('dir', 'rtl')
    expect(
      await portal.evaluate((element) => getComputedStyle(element).getPropertyValue('--primary')),
    ).toBe(
      await livePreview.locator('[data-ui-preview="true"]').evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--primary'),
      ),
    )
    await expect(page.locator('html')).not.toHaveAttribute('data-ui-brand', 'violet')
    await expect(page.locator('body')).not.toHaveAttribute('data-ui-brand', 'violet')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Edit booking' })).toHaveCount(0)
    await expect(page.locator('[data-ds-preview-portal]')).toHaveCount(0)

    await page.keyboard.press('Control+k')
    const hostDialog = page.getByRole('dialog')
    await expect(hostDialog).toBeVisible()
    expect(await hostDialog.evaluate((element) => {
      let root: Element = element
      while (root.parentElement && root.parentElement !== document.body) root = root.parentElement
      return root.hasAttribute('data-ds-preview-portal')
    })).toBe(false)
    expect(await page.locator('body').evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--primary'),
    )).toBe(hostPrimaryBefore)
  })

  test('manifest state controls apply common visual and interaction states', async ({ page }) => {
    await openDeveloperRoute(page, '/developer/components/button', 'Button')
    let livePreview = page.locator('section[data-preview-entry="button"]')
    await livePreview.getByLabel('State').selectOption('disabled')
    await expect(livePreview.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-state', 'disabled')
    await expect(livePreview.getByRole('button', { name: /Continue/ })).toBeDisabled()

    await livePreview.getByLabel('State').selectOption('focus-visible')
    await expect(livePreview.locator('[data-preview-focus-visible="true"]')).toBeFocused()

    await openDeveloperRoute(page, '/developer/components/input', 'Input')
    livePreview = page.locator('section[data-preview-entry="input"]')
    await livePreview.getByLabel('State').selectOption('invalid')
    await expect(livePreview.getByRole('textbox', { name: 'Reference' })).toHaveAttribute('aria-invalid', 'true')

    await openDeveloperRoute(page, '/developer/components/checkbox', 'Checkbox')
    livePreview = page.locator('section[data-preview-entry="checkbox"]')
    await livePreview.getByLabel('State').selectOption('checked')
    await expect(livePreview.getByRole('checkbox', { name: 'Email me booking updates' })).toBeChecked()

    await openDeveloperRoute(page, '/developer/components/dialog', 'Dialog')
    livePreview = page.locator('section[data-preview-entry="dialog"]')
    await livePreview.getByLabel('State').selectOption('open')
    await expect(page.getByRole('dialog', { name: 'Edit booking' })).toBeVisible()
    await expect(page.locator('[data-ds-preview-portal][role="dialog"]')).toHaveAttribute('data-ui-theme', 'light')
  })

  test('toast preview is isolated from the host Sonner store', async ({ page }) => {
    await openDeveloperRoute(page, '/developer/components/toast', 'Toast / Sonner')
    await expectPreviewReady(page)
    const livePreview = page.locator('section[data-preview-entry="toast"]')
    await expect(page.getByRole('region', { name: /^Notifications/ })).toHaveCount(1)
    await livePreview.getByRole('button', { name: 'Show toast' }).click()
    await expect(page.getByText('Changes saved', { exact: true })).toHaveCount(1)
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(1)
  })
})
