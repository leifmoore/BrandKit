import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { expectPreviewReady } from './developer.helpers'

const reviewRoute = '/design-system/review/previews'
const reviewStoragePrefix = 'scudamores.design-system.preview-review.v1.'

test.describe('Preview review workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/brand')
    await page.evaluate(() => window.localStorage.clear())
  })

  test('mounts one of 45 previews, deep-links, saves Pass and Flagged notes, filters, persists, and resets', async ({ page }) => {
    await page.goto(`${reviewRoute}?entry=component%3Aaccordion`)
    await expect(page.getByRole('heading', { level: 1, name: 'Preview review' })).toBeVisible()
    await expect(page.getByRole('progressbar', { name: 'Preview review completion' })).toHaveAttribute('aria-valuemax', '45')
    await expect(page.locator('[aria-labelledby="review-progress-title"]')).toContainText('0 of 45 reviewed')
    await expect(page.locator('section[data-preview-entry]')).toHaveCount(1)
    await expect(page.locator('section[data-preview-entry="accordion"]')).toBeVisible()
    await expectPreviewReady(page)

    await page.getByRole('radio', { name: /^Pass\b/ }).check()
    await page.getByRole('button', { name: 'Save & next', exact: true }).click()
    await expect(page.locator('[aria-labelledby="review-progress-title"]')).toContainText('1 of 45 reviewed')
    await expect(page.locator('section[data-preview-entry]')).toHaveCount(1)
    await expect(page).not.toHaveURL(/entry=component%3Aaccordion/)

    await page.goto(`${reviewRoute}?entry=component%3Aalert-dialog`)
    await page.getByRole('radio', { name: /^Flagged\b/ }).check()
    await page.getByLabel('Flag note').fill('Dialog is clipped at the mobile boundary.')
    await page.getByRole('button', { name: 'Save & next', exact: true }).click()
    await expect(page.locator('[aria-labelledby="review-progress-title"]')).toContainText('2 of 45 reviewed')

    await page.goto(`${reviewRoute}?entry=component%3Aalert-dialog`)
    await expect(page.getByRole('radio', { name: /^Flagged\b/ })).toBeChecked()
    await expect(page.getByLabel('Flag note')).toHaveValue('Dialog is clipped at the mobile boundary.')
    await page.reload()
    await expect(page.locator('[aria-labelledby="review-progress-title"]')).toContainText('2 of 45 reviewed')
    await expect(page.getByRole('radio', { name: /^Flagged\b/ })).toBeChecked()
    await expect(page.getByLabel('Flag note')).toHaveValue('Dialog is clipped at the mobile boundary.')

    await page.getByRole('button', { name: /^Flagged\s+1$/ }).click()
    await expect(page.getByRole('button', { name: /^Flagged\s+1$/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('section[data-preview-entry]')).toHaveCount(1)
    await expect(page.locator('section[data-preview-entry="alert-dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    const resetDialog = page.getByRole('dialog', { name: 'Reset preview review?' })
    await expect(resetDialog).toBeVisible()
    await resetDialog.getByRole('button', { name: 'Reset review', exact: true }).click()
    await expect(page.locator('[aria-labelledby="review-progress-title"]')).toContainText('0 of 45 reviewed')
    await expect(page.getByRole('button', { name: /^All\s+45$/ })).toHaveAttribute('aria-pressed', 'true')
    expect(await page.evaluate((prefix) =>
      Object.keys(window.localStorage).filter((key) => key.startsWith(prefix)),
    reviewStoragePrefix)).toEqual([])
  })

  test('exports the complete review queue as Markdown and JSON', async ({ page }) => {
    await page.goto(reviewRoute)

    const markdownPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Markdown', exact: true }).click()
    const markdownDownload = await markdownPromise
    expect(markdownDownload.suggestedFilename()).toBe('scudamores-ui-preview-review-findings.md')
    const markdownPath = await markdownDownload.path()
    expect(markdownPath).not.toBeNull()
    const markdown = readFileSync(markdownPath!, 'utf8')
    expect(markdown).toContain('Progress: 0/45 reviewed')
    expect(markdown.match(/^\| \d+ \|/gm)).toHaveLength(45)

    const jsonPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'JSON', exact: true }).click()
    const jsonDownload = await jsonPromise
    expect(jsonDownload.suggestedFilename()).toBe('scudamores-ui-preview-review-data.json')
    const jsonPath = await jsonDownload.path()
    expect(jsonPath).not.toBeNull()
    const exported = JSON.parse(readFileSync(jsonPath!, 'utf8')) as {
      summary: { total: number; reviewed: number }
      entries: unknown[]
    }
    expect(exported.summary).toMatchObject({ total: 45, reviewed: 0 })
    expect(exported.entries).toHaveLength(45)
  })
})
