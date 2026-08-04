import { expect, test } from '@playwright/test'
import { readHandoffFile, expectPreviewReady, openDeveloperRoute } from './developer.helpers'

test.describe('Design System search, source, and preview controls', () => {
  test('workspace search opens the matching catalogue entry', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/design-system')
    await page.keyboard.press('Control+k')
    const search = page.getByRole('combobox', { name: 'Search Design System' })
    await search.fill('people popover')
    await page.getByRole('dialog').getByText('People Popover Content', { exact: true }).click()
    await expect(page).toHaveURL(/\/design-system\/patterns\/people-popover-content$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('People Popover Content')
  })

  test('workspace search uses catalogue search terms', async ({ page }) => {
    await page.goto('/design-system')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('combobox', { name: 'Search Design System' }).fill('disclosure')
    await expect(dialog.getByText('Accordion', { exact: true })).toBeVisible()
    await expect(dialog.getByText('Collapsible', { exact: true })).toBeVisible()
  })

  test('React and Blade workbench source remains byte-faithful', async ({ page }) => {
    await openDeveloperRoute(page, '/design-system/components/button', 'Button')

    const workbench = page.getByRole('region', { name: 'Button workbench' })
    const reactExpected = readHandoffFile('react/examples/button/basic.tsx')
    const bladeExpected = readHandoffFile('blade/examples/button/basic.blade.php')

    await workbench.getByRole('tab', { name: 'React', exact: true }).click()
    expect(await workbench.locator('pre:visible code').textContent()).toBe(reactExpected)
    await workbench.getByRole('tab', { name: 'Blade', exact: true }).click()
    expect(await workbench.locator('pre:visible code').textContent()).toBe(bladeExpected)
  })

  test('all themes, widths and directions are scoped to the preview', async ({ page }) => {
    await page.goto('/design-system')
    await expectPreviewReady(page)

    const playground = page.locator('section[data-preview-entry="button"]').first()
    const preview = playground.locator('[data-ui-preview="true"]')
    const htmlClassBefore = await page.locator('html').getAttribute('class')

    for (const brand of ['default', 'blue', 'emerald', 'red', 'orange', 'slate', 'violet']) {
      await playground.getByRole('button', { name: 'More', exact: true }).click()
      await page.getByLabel('Accent theme').selectOption(brand)
      await expect(preview).toHaveAttribute('data-ui-brand', brand)
      await page.keyboard.press('Escape')
    }

    await playground.getByRole('button', { name: 'Dark', exact: true }).click()
    await expect(preview).toHaveAttribute('data-ui-theme', 'dark')
    expect(await page.locator('html').getAttribute('class')).toBe(htmlClassBefore)

    await playground.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByRole('button', { name: 'RTL', exact: true }).click()
    await expect(preview).toHaveAttribute('dir', 'rtl')
    await page.keyboard.press('Escape')

    const widthFrame = preview.locator('..')
    for (const [option, expected] of [
      ['mobile', 'width: 360px'],
      ['tablet', 'width: 768px'],
      ['desktop', 'width: 1280px'],
      ['fluid', 'width: 100%'],
    ] as const) {
      await playground.getByLabel('Viewport').selectOption(option)
      await expect(widthFrame).toHaveAttribute('style', new RegExp(expected.replace(' ', '\\s*')))
    }
  })

  test('preview-owned Radix portals inherit theme and direction without styling the host', async ({ page }) => {
    await openDeveloperRoute(page, '/design-system/components/dialog', 'Dialog')
    const livePreview = page.locator('section[data-preview-entry="dialog"]')
    const hostPrimaryBefore = await page.locator('body').evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--primary'),
    )
    await livePreview.getByRole('button', { name: 'Dark', exact: true }).click()
    await livePreview.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByLabel('Accent theme').selectOption('violet')
    await page.getByRole('button', { name: 'RTL', exact: true }).click()
    await page.keyboard.press('Escape')
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
    await openDeveloperRoute(page, '/design-system/components/button', 'Button')
    let livePreview = page.locator('section[data-preview-entry="button"]')
    await livePreview.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByLabel('State').selectOption('disabled')
    await expect(livePreview.locator('[data-ui-preview="true"]')).toHaveAttribute('data-ui-state', 'disabled')
    await expect(livePreview.getByRole('button', { name: /Continue/ })).toBeDisabled()

    await page.getByLabel('State').selectOption('focus-visible')
    await expect(livePreview.locator('[data-preview-focus-visible="true"]')).toBeFocused()

    await openDeveloperRoute(page, '/design-system/components/input', 'Input')
    livePreview = page.locator('section[data-preview-entry="input"]')
    await livePreview.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByLabel('State').selectOption('invalid')
    await expect(livePreview.getByRole('textbox', { name: 'Reference' })).toHaveAttribute('aria-invalid', 'true')

    await openDeveloperRoute(page, '/design-system/components/checkbox', 'Checkbox')
    livePreview = page.locator('section[data-preview-entry="checkbox"]')
    await livePreview.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByLabel('State').selectOption('checked')
    await expect(livePreview.getByRole('checkbox', { name: 'Email me booking updates' })).toBeChecked()

    await openDeveloperRoute(page, '/design-system/components/dialog', 'Dialog')
    livePreview = page.locator('section[data-preview-entry="dialog"]')
    await livePreview.getByRole('button', { name: 'More', exact: true }).click()
    await page.getByLabel('State').selectOption('open')
    await expect(page.getByRole('dialog', { name: 'Edit booking' })).toBeVisible()
    await expect(page.locator('[data-ds-preview-portal][role="dialog"]')).toHaveAttribute('data-ui-theme', 'light')
  })

  test('toast preview is isolated from the host Sonner store', async ({ page }) => {
    await openDeveloperRoute(page, '/design-system/components/toast', 'Toast / Sonner')
    await expectPreviewReady(page)
    const livePreview = page.locator('section[data-preview-entry="toast"]')
    await expect(page.getByRole('region', { name: /^Notifications/ })).toHaveCount(1)
    await livePreview.getByRole('button', { name: 'Show toast' }).click()
    await expect(page.getByText('Changes saved', { exact: true })).toHaveCount(1)
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(1)
  })
})
