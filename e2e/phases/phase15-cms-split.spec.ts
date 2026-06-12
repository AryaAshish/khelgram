import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitKhel2026Page, visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after CMS key split:
 *   RUN_PHASE15_E2E=1 npm run verify:phase -- 15
 */
test.describe('Phase 15: Organization vs Khel 2026 CMS @phase15', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE15_E2E !== '1', 'Phase 15 E2E disabled until enabled')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('org hero edit does not change Khel 2026 hero', async ({ page }) => {
    const orgTitle = `Org Hero ${Date.now()}`
    const eventTitle = `Event Hero ${Date.now()}`

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Content' }).click()
    await page.getByRole('tab', { name: 'Organization' }).click()
    await page.getByLabel('Hero title').fill(orgTitle)
    await page.getByRole('button', { name: 'Save org hero' }).click()
    await expect(page.getByText('Organization hero saved')).toBeVisible()

    await page.getByRole('tab', { name: 'Khel 2026' }).click()
    await page.getByLabel('Hero title').fill(eventTitle)
    await page.getByRole('button', { name: 'Save event hero' }).click()
    await expect(page.getByText('Khel 2026 hero saved')).toBeVisible()

    await visitPublicHomepage(page)
    await expect(page.getByRole('heading', { name: orgTitle })).toBeVisible()
    await expect(page.getByRole('heading', { name: eventTitle })).toHaveCount(0)

    await visitKhel2026Page(page)
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible()
    await expect(page.getByRole('heading', { name: orgTitle })).toHaveCount(0)
  })
})
