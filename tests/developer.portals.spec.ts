import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { openDeveloperRoute } from './developer.helpers'

interface PortalCase {
  id: string
  route: string
  title: string
  open: (page: Page, preview: Locator) => Promise<Locator>
}

const cases: PortalCase[] = [
  {
    id: 'alert-dialog',
    route: '/developer/components/alert-dialog',
    title: 'Alert Dialog',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'Delete record' }).click()
      return page.getByRole('alertdialog', { name: 'Delete this record?' })
    },
  },
  {
    id: 'dialog',
    route: '/developer/components/dialog',
    title: 'Dialog',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'Open dialog' }).click()
      return page.getByRole('dialog', { name: 'Edit booking' })
    },
  },
  {
    id: 'dropdown-menu',
    route: '/developer/components/dropdown-menu',
    title: 'Dropdown Menu',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'View options' }).click()
      return page.getByRole('menu')
    },
  },
  {
    id: 'popover',
    route: '/developer/components/popover',
    title: 'Popover',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'Open popover' }).click()
      return page.locator('[data-slot="popover-content"]')
    },
  },
  {
    id: 'select',
    route: '/developer/components/select',
    title: 'Select',
    open: async (page, preview) => {
      await preview.getByRole('combobox', { name: 'Status' }).click()
      return page.getByRole('listbox')
    },
  },
  {
    id: 'sheet',
    route: '/developer/components/sheet',
    title: 'Sheet',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'Open panel' }).click()
      return page.getByRole('dialog', { name: 'Filters' })
    },
  },
  {
    id: 'tooltip',
    route: '/developer/components/tooltip',
    title: 'Tooltip',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'More information' }).hover()
      return page.getByRole('tooltip')
    },
  },
  {
    id: 'booking-details-dialog',
    route: '/developer/patterns/booking-details-dialog',
    title: 'Booking Details Dialog',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'Open booking details' }).click()
      return page.getByRole('dialog', { name: 'Booking details' })
    },
  },
  {
    id: 'people-popover-content',
    route: '/developer/patterns/people-popover-content',
    title: 'People Popover Content',
    open: async (page, preview) => {
      await preview.getByRole('button', { name: 'About accessibility access' }).hover()
      return page.getByRole('tooltip')
    },
  },
]

test.describe('Preview portal integration', () => {
  for (const portalCase of cases) {
    test(`${portalCase.id} portal inherits scope, passes axe, and cleans up`, async ({ page }) => {
      await openDeveloperRoute(page, portalCase.route, portalCase.title)
      const livePreview = page.locator(`section[data-preview-entry="${portalCase.id}"]`)
      const previewRoot = livePreview.locator('[data-ui-preview="true"]')
      await livePreview.getByLabel('Mode').selectOption('dark')
      await livePreview.getByLabel('Brand').selectOption('violet')
      await livePreview.getByRole('button', { name: 'RTL', exact: true }).click()

      const target = await portalCase.open(page, previewRoot)
      await expect(target).toBeVisible()
      const owned = page.locator('[data-ds-preview-portal]')
      await expect(owned.first()).toHaveAttribute('data-ui-theme', 'dark')
      await expect(owned.first()).toHaveAttribute('data-ui-brand', 'violet')
      await expect(owned.first()).toHaveAttribute('dir', 'rtl')
      expect(
        await owned.first().evaluate((element) => getComputedStyle(element).getPropertyValue('--primary')),
      ).toBe(
        await previewRoot.evaluate((element) => getComputedStyle(element).getPropertyValue('--primary')),
      )

      const results = await new AxeBuilder({ page })
        .include('[data-ds-preview-portal]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, `Unexpected open-portal axe findings for ${portalCase.id}`).toEqual([])

      await page.keyboard.press('Escape')
      await expect(target).toHaveCount(0)
      await expect(owned).toHaveCount(0)
    })
  }
})
