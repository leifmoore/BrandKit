import { expect, test } from '@playwright/test'

test('keeps licensed Brand display type separate from software interface type', async ({ page }) => {
  // CI remains deterministic and does not download Adobe-hosted font files.
  // The published kit contents and weights are verified separately before the
  // embed URL is changed.
  await page.route('https://use.typekit.net/iia4izu.css', async (route) => {
    await route.fulfill({ contentType: 'text/css', body: '' })
  })

  await page.goto('/brand/identity/typography')

  await expect(page.locator('link[rel="stylesheet"][href="https://use.typekit.net/iia4izu.css"]'))
    .toHaveCount(1)

  const displaySample = page.getByRole('heading', { name: 'Gill Sans Nova' })
  await expect(displaySample).toBeVisible()
  expect(await displaySample.evaluate((element) => getComputedStyle(element).fontFamily))
    .toContain('gill-sans-nova')

  const softwareHeading = page.getByRole('heading', { level: 1, name: 'Typography' })
  expect(await softwareHeading.evaluate((element) => getComputedStyle(element).fontFamily))
    .toContain('Instrument Sans')

  await expect(page.getByText('Caps (brand name, eyebrows, dividers): +15%. Prevents letters running together.'))
    .toBeVisible()
  await expect(page.getByText('Brand apostrophe: always “Scudamore’s” (curly), never straight.'))
    .toBeVisible()
})
