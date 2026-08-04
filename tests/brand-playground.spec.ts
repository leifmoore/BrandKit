import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const DRAFT_KEY = 'scudamores:brand-playground:draft:v1'
const SAVED_KEY = 'scudamores:brand-playground:saved:v1'

test.beforeEach(async ({ page }) => {
  // Clear once before the test. An init script would run again on page.reload()
  // and erase the persistence state this suite is intended to verify.
  await page.goto('/brand')
  await page.evaluate(({ draftKey, savedKey }) => {
    localStorage.removeItem(draftKey)
    localStorage.removeItem(savedKey)
    localStorage.setItem('scud-dark-mode', 'false')
  }, { draftKey: DRAFT_KEY, savedKey: SAVED_KEY })
})

test('switches adaptive patterns, art-directed images, and expression controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/brand/expression/playground')

  await expect(page.getByRole('heading', { level: 1, name: 'Brand Playground' })).toBeVisible()
  await expect(page.getByText('Deep Navy', { exact: true })).toBeVisible()
  await expect(page.getByText('Off-White', { exact: true })).toBeVisible()
  await expect(page.getByText('Derived accent', { exact: true })).toBeVisible()
  await expect(page.getByText('Accent source tone', { exact: true })).toHaveCount(0)

  const preview = page.getByRole('region', { name: 'Brand expression preview' })
  const previewRoot = preview.locator('[data-brand-preview-pattern]')
  await expect(previewRoot).toHaveAttribute('data-brand-preview-pattern', 'booking-hero')
  await expect(previewRoot).toHaveAttribute('data-brand-preview-viewport', 'desktop')
  await expect(preview.getByRole('img', { name: /chauffeur punting customers/ })).toHaveAttribute(
    'src',
    /kings-private-landscape-960\.jpg/,
  )

  await page.getByRole('button', { name: 'Portrait' }).click()
  await expect(previewRoot).toHaveAttribute('data-brand-preview-viewport', 'mobile')
  await expect(preview.getByRole('img', { name: /chauffeur punting customers/ })).toHaveAttribute(
    'src',
    /kings-private-portrait-720\.jpg/,
  )

  await page.getByRole('button', { name: 'Product feature' }).click()
  await expect(previewRoot).toHaveAttribute('data-brand-preview-pattern', 'product-feature')
  await expect(preview.getByRole('heading', { name: 'Private College Backs Tour' })).toBeVisible()

  await page.getByRole('button', { name: 'White glass' }).click()
  await expect(previewRoot).toHaveAttribute('data-brand-glass-tone', 'white')
  await expect(preview.getByRole('heading', { name: 'Private College Backs Tour' })).toHaveCSS('color', 'rgb(20, 40, 75)')
  const cardOpacity = page.getByRole('slider', { name: 'Frosted card opacity' })
  await cardOpacity.focus()
  await page.keyboard.press('Home')
  await expect(cardOpacity).toHaveAttribute('aria-valuenow', '0')
  await expect(preview.locator('[data-brand-glass-panel="white"]')).toHaveCSS(
    'background-image',
    /rgba\(254, 254, 253, 0\).*rgba\(248, 243, 227, 0\)/,
  )
  await page.keyboard.press('End')
  await expect(cardOpacity).toHaveAttribute('aria-valuenow', '100')

  const apricot = page.getByRole('button', { name: 'Sunlit apricot, #faa183' })
  await apricot.click()
  await expect(apricot).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Grainy gradient' }).click()
  await expect(previewRoot).toHaveAttribute('data-brand-accent-treatment', 'grainy-gradient')
  const gradientAction = preview.getByRole('button', { name: /View private tours/ })
  await expect(gradientAction).toHaveCSS('background-image', /linear-gradient/)
  await expect(page.getByRole('slider', { name: 'Gradient range' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Accent grain' })).toBeVisible()

  const intensity = page.getByRole('slider', { name: 'Accent intensity' })
  await intensity.focus()
  await page.keyboard.press('Home')
  await expect(intensity).toHaveAttribute('aria-valuenow', '0')

  await page.getByRole('slider', { name: 'Image grain' }).scrollIntoViewIfNeeded()
  await expect(page.locator('[data-playground-preview-dock]')).toHaveCSS('position', 'sticky')
  const pinnedPreview = await preview.boundingBox()
  expect(pinnedPreview).not.toBeNull()
  const viewportHeight = page.viewportSize()!.height
  const visiblePreviewHeight = Math.min(viewportHeight, pinnedPreview!.y + pinnedPreview!.height)
    - Math.max(0, pinnedPreview!.y)
  expect(visiblePreviewHeight).toBeGreaterThan(500)

  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), DRAFT_KEY)).toContain(
    'product-feature',
  )
})

test('saves, reloads, deletes, and exports experimental candidates', async ({ page }) => {
  await page.goto('/brand/expression/playground')

  await page.getByLabel('Candidate name').fill('Soft coral test')
  await page.getByRole('button', { name: 'Faded rose, #e49bb0' }).click()
  await page.getByRole('button', { name: 'Grainy gradient' }).click()
  await page.getByRole('button', { name: 'Save snapshot' }).click()

  const savedSection = page.locator('#saved-candidates')
  await expect(savedSection.getByRole('heading', { name: 'Soft coral test' })).toBeVisible()
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), SAVED_KEY)).toContain(
    'Soft coral test',
  )

  await page.reload()
  await expect(savedSection.getByRole('heading', { name: 'Soft coral test' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Faded rose, #e49bb0' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Grainy gradient' })).toHaveAttribute('aria-pressed', 'true')

  await savedSection.getByRole('button', { name: 'Load' }).click()
  await expect(page.getByLabel('Candidate name')).toHaveValue('Soft coral test')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON' }).click()
  const download = await downloadPromise
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
  const exported = JSON.parse(await readFile(downloadPath!, 'utf8'))
  expect(exported).toMatchObject({
    kind: 'scudamores-brand-playground-candidate',
    status: 'experimental',
    name: 'Soft coral test',
    lockedAnchors: { navy: '#14284b', white: '#fefefd' },
    sourceAccent: { id: 'rose', hex: '#e49bb0' },
    settings: { accentTreatment: 'grainy-gradient', glassTone: 'navy' },
  })

  await savedSection.getByRole('button', { name: 'Delete Soft coral test' }).click()
  await expect(savedSection.getByRole('heading', { name: 'Soft coral test' })).toHaveCount(0)
})

test('applies the experimental accent across Brand routes without changing the Design System', async ({ page }) => {
  await page.goto('/brand/expression/playground')

  await page.getByRole('button', { name: 'Riverside sage, #a3dca3' }).click()
  await page.getByRole('button', { name: 'Grainy gradient' }).click()
  await page.getByRole('button', { name: 'Apply draft to Brand' }).click()

  const workspaceContent = page.locator('[data-brand-expression-preview]')
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-preview', 'active')
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-accent-treatment', 'grainy-gradient')
  const appliedAccent = await workspaceContent.evaluate((element) => (
    getComputedStyle(element).getPropertyValue('--brand-expression-accent').trim()
  ))
  expect(appliedAccent).toMatch(/^#[0-9a-f]{6}$/i)

  await page.goto('/brand/expression/photography')
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-preview', 'active')
  const cueColour = await page.locator('#composition .text-brand-expression-accent').first()
    .evaluate((element) => getComputedStyle(element).color)
  const normalizedAccent = await page.evaluate((accent) => {
    const sample = document.createElement('span')
    sample.style.color = accent
    document.body.append(sample)
    const colour = getComputedStyle(sample).color
    sample.remove()
    return colour
  }, appliedAccent)
  expect(cueColour).toBe(normalizedAccent)

  await page.goto('/brand/expression/graphics')
  const gradientCue = page.locator('.brand-expression-accent-surface').first()
  await expect(gradientCue).toHaveCSS('background-image', /linear-gradient/)

  await page.goto('/brand/quick-reference')
  await expect(page.getByRole('heading', { level: 1, name: 'Quick Reference' })).toBeVisible()
  await expect(page.getByText('Workspace preview on', { exact: true })).toBeVisible()
  await expect(page.getByText('Riverside sage', { exact: true })).toBeVisible()
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-preview', 'active')

  await page.goto('/design-system/foundations/themes')
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-preview', 'inactive')
  expect(await workspaceContent.evaluate((element) => element.style.getPropertyValue('--primary'))).toBe('')
  expect(await workspaceContent.evaluate((element) => element.style.getPropertyValue('--brand-expression-accent-gradient'))).toBe('')

  await page.goto('/brand/expression/playground')
  await page.getByRole('button', { name: 'Stop workspace preview' }).click()
  await expect(workspaceContent).toHaveAttribute('data-brand-expression-preview', 'inactive')
})

test('uses the optimized shared hero pair for temporary product placeholders', async ({ page }) => {
  await page.goto('/brand/expression/photography')

  const productHeroes = page.locator('#product-heroes')
  await expect(productHeroes.getByRole('heading', { name: 'Current shared hero pair' })).toBeVisible()
  await expect(productHeroes.getByText('Placeholder', { exact: true })).toHaveCount(11)
  await expect(productHeroes.locator('img[src*="/images/brand/heroes/"]')).toHaveCount(12)
  await expect(productHeroes.locator('img[src*="docs/"]')).toHaveCount(0)

  const responsivePair = productHeroes.locator('picture').first()
  await expect(responsivePair.locator('source')).toHaveAttribute('srcset', /portrait-720\.jpg/)
  await expect(responsivePair.locator('img')).toHaveAttribute('src', /landscape-960\.jpg/)
})

test('remains bounded and free of unexpected WCAG A/AA findings at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/brand/expression/playground')

  await page.getByRole('button', { name: 'Portrait' }).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
    .toBeLessThanOrEqual(1)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
