import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('scud-dark-mode', 'false')
  })
})

test('persisted dark mode synchronizes the shell and canonical Toaster input', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const mainLayoutSource = await readFile(
    new URL('../src/components/layout/MainLayout.tsx', import.meta.url),
    'utf8',
  )
  expect(mainLayoutSource).toContain("theme={isDark ? 'dark' : 'light'}")

  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveClass(/app-dark/)
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('scud-dark-mode'))).toBe('true')
})

test('global Command adapter composes canonical Dialog accessibly', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-slot', 'dialog-content')
  await expect(page.getByRole('combobox', { name: 'Search brand kit' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('mobile navigation traps focus, isolates content, and restores its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Open navigation' })
  await trigger.click()

  const drawer = page.getByRole('dialog', { name: 'Brand Kit navigation' })
  await expect(drawer).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeFocused()
  await expect(page.locator('main')).toHaveAttribute('inert', '')

  await page.keyboard.press('Shift+Tab')
  expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)

  await page.keyboard.press('Escape')
  await expect(drawer).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator('main')).not.toHaveAttribute('inert', '')
})

test('Brand Kit navigation hands focus to the destination heading', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await page.locator('aside').first().getByRole('link', { name: 'Colour' }).click()
  await expect(page).toHaveURL(/\/colour$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Colour Palette' })).toBeFocused()
})

test('Colour controls use labelled canonical Select and Popover at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/colour')

  const foreground = page.getByLabel('Text (foreground)')
  const background = page.getByLabel('Background')
  await expect(foreground).toBeVisible()
  await expect(background).toBeVisible()
  const foregroundBox = await foreground.boundingBox()
  const backgroundBox = await background.boundingBox()
  expect(foregroundBox).not.toBeNull()
  expect(backgroundBox).not.toBeNull()
  expect(backgroundBox!.y).toBeGreaterThan(foregroundBox!.y + foregroundBox!.height)

  await foreground.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('Escape')

  await page.getByTitle(/view and copy formats/).first().click()
  const formats = page.getByRole('dialog', { name: /colour formats/ })
  await expect(formats).toBeVisible()
  const hexCopy = formats.getByRole('button', { name: /Copy HEX value/ })
  await hexCopy.click()
  await expect(hexCopy.locator('..').getByRole('status')).toContainText(
    'HEX value copied to the clipboard.',
  )

  await expect(page.getByRole('status').filter({ hasText: /contrast ratio/ })).toContainText(
    'AA normal text',
  )
})

test('Logo slider keeps the approved thin track and has an accessible name', async ({ page }) => {
  await page.goto('/logo')

  const slider = page.getByRole('slider', { name: 'Clear space multiplier' })
  await expect(slider).toHaveAttribute('aria-valuenow', '0.5')
  await expect.poll(async () =>
    (await page.locator('[data-slot="slider-track"]').boundingBox())?.height,
  ).toBe(6)

  await slider.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(slider).toHaveAttribute('aria-valuenow', '0.45')
})

test('canonical Sidebar Scroll Area retains bounded shell scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 700 })
  await page.goto('/')

  const sidebar = page.locator('aside').first()
  const viewport = sidebar.locator('[data-slot="scroll-area-viewport"]')
  await expect(viewport).toHaveAttribute('tabindex', '0')
  await expect(viewport).toHaveAttribute('role', 'region')
  await expect(viewport).toHaveAccessibleName('Brand Kit sections')
  const sidebarBox = await sidebar.boundingBox()
  const viewportBox = await viewport.boundingBox()
  expect(sidebarBox).not.toBeNull()
  expect(viewportBox).not.toBeNull()
  expect(viewportBox!.y).toBeGreaterThanOrEqual(sidebarBox!.y)
  expect(viewportBox!.y + viewportBox!.height).toBeLessThanOrEqual(
    sidebarBox!.y + sidebarBox!.height,
  )
})

test('copy and download controls expose asset-specific names', async ({ page }) => {
  await page.goto('/downloads')

  await expect(page.getByRole('button', { name: 'Copy CSS Custom Properties' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy JSON Tokens' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download Solid — Deep Navy SVG' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download White Outline SVG' })).toBeVisible()
})
