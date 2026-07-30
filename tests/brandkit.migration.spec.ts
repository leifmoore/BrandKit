import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

function parseRgb(value: string) {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number)
  if (!channels || channels.length !== 3) throw new Error(`Unable to parse colour: ${value}`)
  return channels
}

function contrastRatio(foreground: string, background: string) {
  const luminance = (value: string) => {
    const [red, green, blue] = parseRgb(value).map(channel => {
      const normalized = channel / 255
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
  }
  const foregroundLuminance = luminance(foreground)
  const backgroundLuminance = luminance(background)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

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

test('Mood Explorer keeps every palette label readable and every swatch measurable', async ({ page }) => {
  await page.goto('/brand/identity/colour')

  for (const moodName of ['Day Tours', 'Fireworks', 'Weddings', 'Bat Safari']) {
    await page.getByRole('button', { name: moodName, pressed: false }).or(
      page.getByRole('button', { name: moodName, pressed: true }),
    ).click()

    const preview = page.getByText(`${moodName} palette`, { exact: true }).locator('xpath=../..')
    const background = await preview.evaluate(element => getComputedStyle(element).backgroundColor)
    const labels = preview.locator(':scope > div').first().locator('p')
    await expect(labels).toHaveCount(3)

    for (const label of await labels.all()) {
      const foreground = await label.evaluate(element => getComputedStyle(element).color)
      expect(contrastRatio(foreground, background), `${moodName} text contrast`).toBeGreaterThanOrEqual(4.5)
    }

    const swatches = preview.getByRole('button', { name: /View and copy colour formats/ })
    expect(await swatches.count()).toBeGreaterThan(0)
    for (const swatch of await swatches.all()) {
      const box = await swatch.boundingBox()
      expect(box?.width, `${moodName} swatch width`).toBeGreaterThanOrEqual(120)
    }
  }

  await expect(page.locator('h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty')).toHaveCount(0)
})

test('guidance tables preserve labelled content and keyboard scrolling at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })

  await page.goto('/brand/applications')
  const applications = page.getByRole('region', { name: 'Digital applications and production status' })
  await expect(applications.getByRole('columnheader', { name: "What's needed" })).toBeVisible()
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
  await expect(main.getByRole('note')).toContainText('Typography authority pending')
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
