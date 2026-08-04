import { expect, test, type Page } from '@playwright/test'

const WORKSPACE_STORAGE_KEY = 'scud-workspace-state-v1'
const HISTORY_MARKER = '/brand?history-marker=before-legacy'

const legacyRoutes = [
  { from: '/colour', to: '/brand/identity/colour', heading: 'Colour Palette' },
  { from: '/logo', to: '/brand/identity/logo', heading: 'Logo & Usage' },
  { from: '/typography', to: '/brand/identity/typography', heading: 'Typography' },
  { from: '/voice', to: '/brand/expression/voice', heading: 'Voice & Tone' },
  { from: '/photography', to: '/brand/expression/photography', heading: 'Photography' },
  { from: '/graphics', to: '/brand/expression/graphics', heading: 'Graphics & Icons' },
  { from: '/applications', to: '/brand/applications', heading: 'Brand Applications' },
  { from: '/downloads', to: '/brand/resources', heading: 'Downloads' },
  { from: '/quick-reference', to: '/brand/quick-reference', heading: 'Quick Reference' },
  { from: '/charts', to: '/design-system/foundations/data-visualisation', heading: 'Charts' },
  { from: '/developer', to: '/design-system', heading: "Scudamore's UI" },
  { from: '/developer/components', to: '/design-system/components', heading: 'Components' },
  { from: '/developer/components/button', to: '/design-system/components/button', heading: 'Button' },
  { from: '/developer/patterns', to: '/design-system/patterns', heading: 'Patterns' },
  { from: '/developer/patterns/booking-card', to: '/design-system/patterns/booking-card', heading: 'Booking Card' },
  { from: '/developer/foundations', to: '/design-system/foundations', heading: 'Foundations' },
  { from: '/developer/foundations/tokens', to: '/design-system/foundations/tokens', heading: 'Tokens' },
  { from: '/developer/foundations/brands', to: '/design-system/foundations/themes', heading: 'Themes' },
  { from: '/developer/components/hover-card', to: '/design-system/roadmap/hover-card', heading: 'Hover Card' },
] as const

async function expectReplaceRedirect(
  page: Page,
  route: (typeof legacyRoutes)[number],
): Promise<void> {
  await page.goto(HISTORY_MARKER)
  await expect(page.getByRole('heading', { level: 1, name: 'Scudamore’s Brand' })).toBeVisible()

  await page.goto(`${route.from}?legacy-query=preserved#legacy-fragment`)
  await expect(page).toHaveURL(`${route.to}?legacy-query=preserved#legacy-fragment`)
  await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(HISTORY_MARKER)
}

test('every legacy Brand route and Developer route family redirects with replace history semantics', async ({ page }) => {
  test.slow()

  for (const route of legacyRoutes) {
    await expectReplaceRedirect(page, route)
  }
})

test('the first root visit opens Brand and later root visits restore the last valid workspace route', async ({ page }) => {
  await page.goto('/brand')
  await page.evaluate((key) => localStorage.removeItem(key), WORKSPACE_STORAGE_KEY)

  await page.goto('/')
  await expect(page).toHaveURL('/brand')

  await page.goto('/design-system/components/button')
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), WORKSPACE_STORAGE_KEY))
    .toContain('/design-system/components/button')

  await page.goto('/')
  await expect(page).toHaveURL('/design-system/components/button')
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()

  await page.goto('/design-system/not-a-real-route')
  await expect(page.getByRole('heading', { name: 'Design System page not found' })).toBeVisible()
  await page.goto('/')
  await expect(page).toHaveURL('/design-system/components/button')

  await page.goto('/design-system/components/not-a-real-component')
  await expect(page.getByRole('heading', { name: 'Design System page not found' })).toBeVisible()
  await page.goto('/')
  await expect(page).toHaveURL('/design-system/components/button')
})

test('malformed or stale workspace memory falls back safely to the Brand overview', async ({ page }) => {
  await page.goto('/brand')
  await page.evaluate((key) => localStorage.setItem(key, '{not-json'), WORKSPACE_STORAGE_KEY)
  await page.goto('/')
  await expect(page).toHaveURL('/brand')

  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      lastWorkspace: 'design-system',
      routes: {
        brand: '/brand/not-a-real-page',
        'design-system': '/design-system/components/not-a-real-component',
      },
    }))
  }, WORKSPACE_STORAGE_KEY)
  await page.goto('/')
  await expect(page).toHaveURL('/design-system')
})

test('workspace links restore each workspace last route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/brand/identity/logo')

  const workspaceSwitcher = page.getByRole('group', { name: 'Workspace' })
  await workspaceSwitcher.getByRole('link', { name: 'Design System' }).click()
  await expect(page).toHaveURL('/design-system')

  await page.goto('/design-system/components/button')
  await expect(page.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible()

  await page.getByRole('group', { name: 'Workspace' }).getByRole('link', { name: 'Brand' }).click()
  await expect(page).toHaveURL('/brand/identity/logo')

  await page.getByRole('group', { name: 'Workspace' }).getByRole('link', { name: 'Design System' }).click()
  await expect(page).toHaveURL('/design-system/components/button')
})

test('Design System foundation deep links focus and reveal their destination', async ({ page }) => {
  await page.goto('/design-system/foundations/themes#brand-workspace-candidates')

  const candidates = page.locator('#brand-workspace-candidates')
  await expect(candidates).toBeFocused()
  await expect(candidates).toHaveCSS('outline-style', 'none')
  await expect(candidates.getByRole('heading', { name: 'Brand workspace colour candidates' })).toBeVisible()
  await expect(candidates.getByText('Candidate · unapproved')).toHaveCount(3)
})

test('Command search is scoped to the active workspace', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/brand')
  await page.keyboard.press('Control+k')

  const brandSearch = page.getByRole('combobox', { name: 'Search Brand' })
  await brandSearch.fill('River coral')
  await expect(page.getByRole('dialog').getByText('River coral', { exact: true })).toBeVisible()
  await brandSearch.fill('Lantern Gold')
  await expect(page.getByText('No results found in Brand.')).toBeVisible()
  await brandSearch.fill('Button')
  await expect(page.getByText('No results found in Brand.')).toBeVisible()
  await page.keyboard.press('Escape')

  await page.getByRole('group', { name: 'Workspace' }).getByRole('link', { name: 'Design System' }).click()
  await page.keyboard.press('Control+k')

  const designSystemSearch = page.getByRole('combobox', { name: 'Search Design System' })
  await designSystemSearch.fill('Button')
  await page.getByRole('dialog').getByText('Button', { exact: true }).click()
  await expect(page).toHaveURL('/design-system/components/button')
})

test('route scrolling stays inside the content pane without moving the shell into blank space', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/brand/identity/colour')

  const main = page.locator('#main-content')
  await main.evaluate((element) => {
    element.scrollTop = element.scrollHeight
  })
  const mainBox = await main.boundingBox()
  expect(mainBox).not.toBeNull()
  await page.mouse.move(mainBox!.x + mainBox!.width / 2, mainBox!.y + mainBox!.height / 2)
  await page.mouse.wheel(0, 5000)

  const desktopMetrics = await page.evaluate(() => ({
    windowScrollY: window.scrollY,
    viewportHeight: document.documentElement.clientHeight,
    rootHeight: document.getElementById('root')!.getBoundingClientRect().height,
    mainHeight: document.getElementById('main-content')!.getBoundingClientRect().height,
    bodyOverflow: getComputedStyle(document.body).overflow,
    rootOverflow: getComputedStyle(document.getElementById('root')!).overflow,
  }))
  expect(desktopMetrics).toEqual({
    windowScrollY: 0,
    viewportHeight: 900,
    rootHeight: 900,
    mainHeight: 900,
    bodyOverflow: 'hidden',
    rootOverflow: 'hidden',
  })
  await expect(page.locator('aside[aria-label="Brand workspace"]')).toBeVisible()

  await page.setViewportSize({ width: 360, height: 800 })
  await main.evaluate((element) => {
    element.scrollTop = element.scrollHeight
  })
  await page.mouse.wheel(0, 5000)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible()
})

test('the mobile workspace drawer is modal, traps focus, restores its trigger, and closes after switching workspace', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/design-system')

  const trigger = page.getByRole('button', { name: 'Open navigation' })
  await trigger.click()

  const drawer = page.getByRole('dialog', { name: 'Design System navigation' })
  await expect(drawer).toHaveAttribute('aria-modal', 'true')
  await expect(drawer).toHaveClass(/bg-card/)
  await expect(page.getByRole('button', { name: 'Close navigation' })).toBeFocused()
  await expect(page.locator('main')).toHaveAttribute('inert', '')

  await page.keyboard.press('Shift+Tab')
  expect(await drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true)

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator('main')).not.toHaveAttribute('inert', '')

  await trigger.click()
  await drawer.getByRole('group', { name: 'Workspace' }).getByRole('link', { name: 'Brand' }).click()
  await expect(page).toHaveURL('/brand')
  await expect(drawer).toBeHidden()
})
