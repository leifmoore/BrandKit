import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('scud-dark-mode', 'false')
  })
})

test('persisted dark mode synchronizes the shell and canonical Toaster input', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/brand')

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

test('workspace Command adapter composes canonical Dialog accessibly', async ({ page }) => {
  await page.goto('/brand')
  await page.keyboard.press('Control+k')

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAttribute('data-slot', 'dialog-content')
  await expect(page.getByRole('combobox', { name: 'Search Brand' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('mobile navigation traps focus, isolates content, and restores its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/brand')

  const trigger = page.getByRole('button', { name: 'Open navigation' })
  await trigger.click()

  const drawer = page.getByRole('dialog', { name: 'Brand navigation' })
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
  await page.goto('/brand')

  await page.locator('aside').first().getByRole('link', { name: 'Colour' }).click()
  await expect(page).toHaveURL('/brand/identity/colour')
  const heading = page.getByRole('heading', { level: 1, name: 'Colour Palette' })
  await expect(heading).toBeFocused()
  await expect(heading).toHaveCSS('outline-style', 'none')
})

test('Brand guidance pages share canonical page framing and in-page navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/brand/identity/colour')

  const heading = page.getByRole('heading', { level: 1, name: 'Colour Palette' })
  await expect(heading.locator('xpath=ancestor::header')).toHaveCount(1)

  const sectionNavigation = page.getByRole('navigation', { name: 'On this page' })
  const sectionButtons = sectionNavigation.getByRole('button')
  await expect(sectionButtons).toHaveCount(7)
  await expect(sectionButtons.first()).toHaveAttribute('data-slot', 'button')
  await expect(sectionNavigation.getByRole('button', { name: 'Primary' })).toHaveAttribute('aria-current', 'location')

  const checkerButton = sectionNavigation.getByRole('button', { name: 'WCAG Checker' })
  await checkerButton.click()
  await expect(checkerButton).toHaveAttribute('aria-current', 'location')
  await expect(checkerButton).toBeFocused()
})

test('Mood Explorer renders compact anchored recipes and hands a context to the Playground', async ({ page }) => {
  await page.goto('/brand/identity/colour')

  const lightGlassMoods = new Set(['Day Tours', 'Weddings', 'Riverside'])
  for (const moodName of ['Day Tours', 'Private Tours', 'Weddings', 'Summer', 'Riverside', 'Twilight']) {
    await page.getByRole('button', { name: moodName, exact: true }).click()

    const preview = page.getByRole('region', { name: `${moodName} expression preview` })
    const panel = preview.locator('[data-mood-copy]')
    await expect(panel).toHaveCSS(
      'color',
      lightGlassMoods.has(moodName) ? 'rgb(20, 40, 75)' : 'rgb(254, 254, 253)',
    )

    const swatches = page.locator('[data-mood-swatch]')
    await expect(swatches).toHaveCount(4)
    for (const swatch of await swatches.all()) {
      const box = await swatch.boundingBox()
      expect(box?.width, `${moodName} swatch width`).toBeGreaterThanOrEqual(40)
    }
    await expect(page.locator('[data-mood-ramp-step]')).toHaveCount(5)
  }

  await page.getByRole('button', { name: 'Load Twilight in Playground' }).click()
  await expect(page).toHaveURL('/brand/expression/playground')
  await expect(page.getByRole('button', { name: 'Dusk violet, #a69de2' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Navy glass' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Grainy gradient' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty')).toHaveCount(0)
})

test('Brand ramps preserve the locked anchors and export compact expression scales', async ({ page }) => {
  await page.goto('/brand/identity/colour')

  await expect(page.getByText('#14284b · navy-900', { exact: true })).toBeVisible()
  await expect(page.getByText('#fefefd · cream-50', { exact: true })).toBeVisible()
  await expect(page.getByText('#a2cddb', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('#feeacd', { exact: true }).first()).toBeVisible()

  const expressionRamps = page.locator('[data-expression-ramp]')
  await expect(expressionRamps).toHaveCount(9)
  for (const ramp of await expressionRamps.all()) {
    await expect(ramp.locator('[data-expression-ramp-step]')).toHaveCount(5)
  }

  await page.goto('/brand/resources')
  const cssTokens = page.getByLabel('CSS Custom Properties code')
  await expect(cssTokens).toContainText('--color-navy-900:  #14284b')
  await expect(cssTokens).toContainText('--color-cream-50:  #fefefd')
  await expect(cssTokens).toContainText('--color-navy-300:  #a2cddb')
  await expect(cssTokens).toContainText('--color-cream-400: #feeacd')
  await expect(cssTokens).toContainText('--color-expression-violet-700:')
  const codeMetrics = await cssTokens.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    overflowY: getComputedStyle(element).overflowY,
  }))
  expect(codeMetrics.clientHeight).toBeLessThanOrEqual(320)
  expect(codeMetrics.scrollHeight).toBeGreaterThan(codeMetrics.clientHeight)
  expect(codeMetrics.overflowY).toBe('auto')
})

test('guidance tables preserve labelled content and keyboard scrolling at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })

  await page.goto('/brand/applications')
  const applications = page.getByRole('region', { name: 'Digital applications and production status' })
  await expect(applications.getByRole('columnheader', { name: 'What’s needed' })).toBeVisible()
  await expect(applications.getByText('Hero with tagline, product category cards, seasonal hero rotation')).toBeVisible()
  await applications.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => applications.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)

  await page.goto('/brand/expression/voice')
  const voice = page.getByRole('region', { name: 'Tone by channel' })
  await expect(voice.getByRole('columnheader', { name: 'Tone' })).toBeVisible()
  await expect(voice.getByText('Anchored, evocative, declarative')).toBeVisible()

  await page.goto('/brand/expression/photography')
  const photography = page.getByRole('region', { name: 'Required photography aspect ratios' })
  await expect(photography.getByRole('columnheader', { name: 'Notes' })).toBeVisible()
  await expect(photography.getByText('Shoot wide, crop after')).toBeVisible()
})

test('Expression guidance keeps experiments and unapproved policy explicit', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto('/brand/expression/voice')
  await expect(page.getByRole('heading', { name: 'Scudamore’s-isms' })).toBeVisible()
  await expect(page.getByText(/The provider, evaluation criteria, privacy handling/)).toBeVisible()
  await expect(page.getByText(/Powered by Claude/)).toHaveCount(0)

  await page.goto('/brand/expression/graphics')
  const libraries = page.getByRole('region', { name: 'Approved and candidate icon libraries' })
  await expect(libraries.getByRole('columnheader', { name: 'Status' })).toBeVisible()
  await expect(page.getByText(/Grainy gradients belong only on reviewed expression surfaces/)).toBeVisible()

  await page.goto('/brand/expression/photography')
  const consent = page.locator('#consent')
  await expect(consent.getByText('Operational draft')).toBeVisible()
  await expect(consent.getByText(/not legal sign-off/)).toBeVisible()
  await expect(consent.getByText(/Do not assume the location alone grants marketing permission/)).toBeVisible()

  const productHeroes = page.locator('#product-heroes')
  const titleBox = await productHeroes.getByRole('heading', { name: 'Product Hero Images' }).boundingBox()
  const introductionBox = await productHeroes.locator(':scope > p').boundingBox()
  expect(titleBox).not.toBeNull()
  expect(introductionBox).not.toBeNull()
  expect(introductionBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height)
})

test('Activation guidance distinguishes working inventory, software semantics, and exported ramps', async ({ page }) => {
  await page.goto('/brand/applications')

  await expect(page.getByRole('note')).toContainText('Planning metadata only')
  const digital = page.getByRole('region', { name: 'Digital applications and production status' })
  const dashboards = digital.getByRole('row').filter({ hasText: 'Internal — dashboards' })
  await expect(dashboards).toContainText('separately governed chart palette')
  await expect(dashboards).toContainText('never inherit Brand expression accents')
  await expect(dashboards).not.toContainText('shadcn defaults')
  await expect(page.getByText(/Platform requirements can change/)).toBeVisible()

  await page.goto('/brand/resources')
  const resourceNavigation = page.getByRole('navigation', { name: 'On this page' })
  await expect(resourceNavigation.getByRole('button')).toHaveCount(3)
  await expect(page.getByText(/documented context-led expression ramps/)).toBeVisible()
  await expect(page.getByText(/A ramp does not approve a composition/)).toBeVisible()

  const typographyButton = resourceNavigation.getByRole('button', { name: 'Typography' })
  await typographyButton.click()
  await expect(typographyButton).toHaveAttribute('aria-current', 'location')
  await expect(typographyButton).toBeFocused()
})

test('Charts exposes keyboard highlighting, theme-aware axes, and equivalent data tables', async ({ page }) => {
  await page.goto('/design-system/foundations/data-visualisation')

  const main = page.locator('main')
  await expect(main.getByRole('navigation', { name: 'On this page' }).getByRole('button')).toHaveCount(4)
  await expect(main.getByRole('img', { name: 'Monthly chauffeured-tour bookings from January to June 2024' })).toBeVisible()

  const monthGroup = main.getByRole('group', { name: 'Highlight booking month' })
  await expect(monthGroup.getByRole('button', { name: 'May' })).toHaveAttribute('aria-pressed', 'true')
  await monthGroup.getByRole('button', { name: 'Jan' }).click()
  await expect(monthGroup.getByRole('button', { name: 'Jan' })).toHaveAttribute('aria-pressed', 'true')
  await expect(main.getByRole('status')).toContainText('Highlighted: Jan, 42 bookings.')

  const dataDisclosures = main.locator('details')
  await expect(dataDisclosures).toHaveCount(5)
  await dataDisclosures.first().getByText('View data table').click()
  const monthlyData = main.getByRole('region', { name: 'Monthly chauffeured-tour bookings, January to June 2024' })
  await expect(monthlyData.getByRole('cell', { name: 'Jan' })).toBeVisible()
  await expect(monthlyData.getByRole('cell', { name: '42' })).toBeVisible()

  const firstAxisTick = main.locator('svg text').first()
  const lightFill = await firstAxisTick.evaluate(element => getComputedStyle(element).fill)
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  const darkFill = await firstAxisTick.evaluate(element => getComputedStyle(element).fill)
  expect(darkFill).not.toBe(lightFill)
  await expect(main.getByRole('note')).toHaveCount(0)
  const chartTypography = main.getByRole('region', { name: 'Chart typography guidance' })
  await expect(chartTypography).toContainText('Gill Sans Nova Bold')
  await expect(chartTypography).toContainText('Instrument Sans Regular')
})

test('Colour controls use labelled canonical Select and Popover at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/brand/identity/colour')

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
  await expect(page.getByRole('option', { name: /River coral/ })).toBeVisible()
  await expect(page.getByRole('option', { name: /Legacy Lantern Gold/ })).toHaveCount(0)
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
  await page.goto('/brand/identity/logo')

  await expect(page.getByText('Use only the supplied Solid Deep Navy, White Outline, or Full Colour artwork'))
    .toBeVisible()

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
  await page.goto('/brand')

  const sidebar = page.locator('aside').first()
  const viewport = sidebar.locator('[data-slot="scroll-area-viewport"]')
  await expect(viewport).toHaveAttribute('tabindex', '0')
  await expect(viewport).toHaveAttribute('role', 'region')
  await expect(viewport).toHaveAccessibleName('Brand sections')
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
  await page.goto('/brand/resources')

  await expect(page.getByRole('button', { name: 'Copy CSS Custom Properties' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy JSON Tokens' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download Solid — Deep Navy SVG' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download White Outline SVG' })).toBeVisible()
})
