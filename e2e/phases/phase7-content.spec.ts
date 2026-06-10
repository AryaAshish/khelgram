import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 7 implementation:
 *   RUN_PHASE7_E2E=1 npm run verify:phase -- 7
 */
test.describe('Phase 7: Content CMS @phase7', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE7_E2E !== '1', 'Phase 7 E2E disabled until implemented')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('admin hero title change appears on public homepage', async ({ page }) => {
    const uniqueTitle = `E2E Hero ${Date.now()}`

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Content' }).click()
    await page.getByRole('tab', { name: 'Hero' }).click()
    await page.getByLabel('Hero title').fill(uniqueTitle)
    await page.getByRole('button', { name: 'Save Hero' }).click()
    await expect(page.getByText('Hero section saved')).toBeVisible()

    await visitPublicHomepage(page)
    await expect(page.getByText(uniqueTitle)).toBeVisible()
  })
})
