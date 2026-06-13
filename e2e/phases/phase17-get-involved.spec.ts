import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 17 implementation:
 *   RUN_PHASE17_E2E=1 npm run verify:phase -- 17
 */
test.describe('Phase 17: Get Involved stakeholder CTAs @phase17', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE17_E2E !== '1', 'Phase 17 E2E disabled until enabled')
  })

  test('homepage renders stakeholder cards with correct hrefs', async ({ page }) => {
    await visitPublicHomepage(page)

    await expect(page.locator('#get-involved')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Parents', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Register your child' })).toHaveAttribute(
      'href',
      '/register',
    )
    await expect(page.getByRole('link', { name: 'Contact us' }).first()).toHaveAttribute(
      'href',
      '#contact',
    )
  })

  test('expanded get involved page loads from homepage link', async ({ page }) => {
    await visitPublicHomepage(page)
    await page.getByRole('link', { name: 'View all ways to help' }).click()

    await expect(page).toHaveURL(/\/get-involved$/)
    await expect(page.locator('#get-involved')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Volunteers', exact: true })).toBeVisible()
  })
})
