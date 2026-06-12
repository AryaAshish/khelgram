import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 12 implementation:
 *   RUN_PHASE12_E2E=1 npm run verify:phase -- 12
 */
test.describe('Phase 12: Section visibility CMS @phase12', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE12_E2E !== '1', 'Phase 12 E2E disabled until implemented')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('admin can hide FAQ section on public homepage', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Content' }).click()
    await page.getByRole('tab', { name: 'Sections' }).click()
    await page.getByLabel('Show FAQ section').uncheck()
    await page.getByRole('button', { name: 'Save section settings' }).click()
    await expect(page.getByText('Section visibility saved')).toBeVisible()

    await visitPublicHomepage(page)
    await expect(page.getByRole('heading', { name: 'FAQ' })).toHaveCount(0)

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Content' }).click()
    await page.getByRole('tab', { name: 'Sections' }).click()
    await page.getByLabel('Show FAQ section').check()
    await page.getByRole('button', { name: 'Save section settings' }).click()
    await expect(page.getByText('Section visibility saved')).toBeVisible()

    await visitPublicHomepage(page)
    await expect(page.getByRole('heading', { name: 'FAQ' })).toBeVisible()
  })

  test('public header shows admin sign-in link', async ({ page }) => {
    await visitPublicHomepage(page)
    await expect(page.getByRole('link', { name: 'Admin sign in' })).toBeVisible()
  })
})
