import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 16 implementation:
 *   RUN_PHASE16_E2E=1 npm run verify:phase -- 16
 */
test.describe('Phase 16: Programs section @phase16', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE16_E2E !== '1', 'Phase 16 E2E disabled until enabled')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('published program appears on public homepage', async ({ page }) => {
    const programTitle = `E2E Program ${Date.now()}`

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Programs' }).click()
    await page.getByLabel('Title').fill(programTitle)
    await page.getByLabel('Description').fill('E2E program description')
    await page.getByLabel('Published').check()
    await page.getByRole('button', { name: 'Add program' }).click()

    await visitPublicHomepage(page)
    await expect(page.locator('#programs')).toBeVisible()
    await expect(page.getByText(programTitle)).toBeVisible()
  })

  test('programs anchor is reachable from header nav', async ({ page }) => {
    await visitPublicHomepage(page)
    await page.getByRole('link', { name: 'Programs' }).click()
    await expect(page.locator('#programs')).toBeInViewport()
  })
})
