import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { expectPreviewReady, openDeveloperRoute, readHandoffFile } from './developer.helpers'

const workbenchViewKey = 'scudamores.design-system.workbench-view.v1'
const previewPreferencesKey = 'scudamores.design-system.preview.v1'

test.describe('Design System component workbench', () => {
  test('puts Preview first, persists a valid view in the URL, and ignores malformed preferences', async ({ page }) => {
    await page.addInitScript(({ storedViewKey, storedPreviewKey }) => {
      window.localStorage.setItem(storedViewKey, 'not-a-workbench-view')
      window.localStorage.setItem(storedPreviewKey, '{malformed json')
    }, {
      storedViewKey: workbenchViewKey,
      storedPreviewKey: previewPreferencesKey,
    })

    await openDeveloperRoute(page, '/design-system/components/button', 'Button')
    await expectPreviewReady(page)

    const workbench = page.getByRole('region', { name: 'Button workbench' })
    const previewTab = workbench.getByRole('tab', { name: 'Preview', exact: true })
    const reactTab = workbench.getByRole('tab', { name: 'React', exact: true })
    const bladeTab = workbench.getByRole('tab', { name: 'Blade', exact: true })
    const preview = workbench.locator('[data-ui-preview="true"]')

    await expect(previewTab).toHaveAttribute('aria-selected', 'true')
    await expect(preview).toHaveAttribute('data-ui-theme', 'light')
    await expect(preview).toHaveAttribute('data-ui-brand', 'default')
    await expect(preview).toHaveAttribute('data-ui-width', 'fluid')
    await expect(preview).toHaveAttribute('dir', 'ltr')
    await expect(workbench.locator('[aria-label="Source file actions"]')).toBeVisible()

    await reactTab.click()
    await expect(page).toHaveURL(/[?&]view=react(?:&|$)/)
    await expect(reactTab).toHaveAttribute('aria-selected', 'true')
    expect(await workbench.locator('pre:visible code').textContent()).toBe(
      readHandoffFile('react/examples/button/basic.tsx'),
    )
    await expect(workbench.locator('[aria-label="Source file actions"]')).toBeVisible()

    await bladeTab.click()
    await expect(page).toHaveURL(/[?&]view=blade(?:&|$)/)
    await expect(bladeTab).toHaveAttribute('aria-selected', 'true')
    expect(await workbench.locator('pre:visible code').textContent()).toBe(
      readHandoffFile('blade/examples/button/basic.blade.php'),
    )
    await expect(workbench.locator('[aria-label="Source file actions"]')).toBeVisible()

    await page.reload()
    await expect(page.getByRole('region', { name: 'Button workbench' })
      .getByRole('tab', { name: 'Blade', exact: true })).toHaveAttribute('aria-selected', 'true')
  })

  test('deep-links documentation sections and browser Back closes the sheet with focus restored', async ({ page }) => {
    await openDeveloperRoute(page, '/design-system/components/button?view=preview', 'Button')

    const workbench = page.getByRole('region', { name: 'Button workbench' })
    const documentationTrigger = workbench.getByRole('button', { name: 'Documentation', exact: true })
    await documentationTrigger.click()
    await expect(page).toHaveURL(/[?&]docs=api(?:&|$)/)

    let dialog = page.getByRole('dialog', { name: 'Button documentation' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2, name: 'API' })).toBeVisible()
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)

    await dialog.getByRole('button', { name: 'Accessibility', exact: true }).click()
    await expect(page).toHaveURL(/[?&]docs=accessibility(?:&|$)/)
    await page.reload()
    dialog = page.getByRole('dialog', { name: 'Button documentation' })
    await expect(dialog.getByRole('heading', { level: 2, name: 'Accessibility' })).toBeVisible()

    await page.goBack()
    await expect(page).not.toHaveURL(/[?&]docs=/)
    await expect(dialog).toHaveCount(0)
    await expect(documentationTrigger).toBeFocused()
  })

  test('copies and downloads the exact selected handoff file from persistent actions', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openDeveloperRoute(page, '/design-system/components/button', 'Button')

    const workbench = page.getByRole('region', { name: 'Button workbench' })
    const expected = readHandoffFile('react/examples/button/basic.tsx')
    const sourceActions = workbench.locator('[aria-label="Source file actions"]')

    await sourceActions.getByRole('button', { name: 'Copy', exact: true }).click()
    const copyMenu = page.getByRole('dialog').filter({
      has: page.getByText('Copy an exact handoff file', { exact: true }),
    })
    await copyMenu.getByRole('button', {
      name: 'React · react/examples/button/basic.tsx',
      exact: true,
    }).click()
    await expect(page.getByText('react/examples/button/basic.tsx copied to the clipboard.', { exact: true })).toBeAttached()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected)

    await page.keyboard.press('Escape')
    await sourceActions.getByRole('button', { name: 'Download', exact: true }).click()
    const downloadMenu = page.getByRole('dialog').filter({
      has: page.getByText('Download an exact handoff file', { exact: true }),
    })
    const downloadPromise = page.waitForEvent('download')
    await downloadMenu.getByRole('button', {
      name: 'React · react/examples/button/basic.tsx',
      exact: true,
    }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('basic.tsx')
    const downloadedPath = await download.path()
    expect(downloadedPath).not.toBeNull()
    expect(readFileSync(downloadedPath!, 'utf8')).toBe(expected)
  })
})
