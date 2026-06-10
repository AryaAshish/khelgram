import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'

test.describe('Phase 6 @phase6', () => {
  test('admin registrations page supports search and export action', async ({ page }) => {
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')

    await loginAsAdmin(page)
    await page.getByRole('link', { name: /Registrations/ }).click()
    await expect(page.getByRole('heading', { name: 'Registrations' })).toBeVisible()

    await page.getByLabel('Search').fill('e2e')
    await page.getByRole('button', { name: 'Export .xlsx' }).click()

    // Export may toast success or "no rows" depending on data; both prove the action is wired.
    await expect(
      page.getByText(/Exported \d+ registrations|No registrations match the current filters/),
    ).toBeVisible({ timeout: 10_000 })
  })
})
