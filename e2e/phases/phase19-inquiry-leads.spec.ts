import { test, expect } from '../fixtures'

/**
 * Enable after Phase 19 implementation:
 *   RUN_PHASE19_E2E=1 npm run verify:phase -- 19
 */
test.describe('Phase 19: Inquiry leads @phase19', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE19_E2E !== '1', 'Phase 19 E2E disabled until enabled')
  })

  test('partner and volunteer CTAs link to inquiry anchors', async ({ page }) => {
    await page.goto('/get-involved')

    const getInvolved = page.locator('#get-involved')
    await expect(getInvolved).toBeVisible()
    await expect(getInvolved.getByRole('link', { name: 'Partner with us' })).toHaveAttribute(
      'href',
      '/get-involved#partner-inquiry',
    )
    await expect(getInvolved.getByRole('link', { name: 'Sign up to volunteer' })).toHaveAttribute(
      'href',
      '/get-involved#volunteer-signup',
    )
  })

  test('get involved page renders partner and volunteer forms', async ({ page }) => {
    await page.goto('/get-involved')

    await expect(page.locator('#partner-inquiry')).toBeVisible()
    await expect(page.locator('#volunteer-signup')).toBeVisible()
    await expect(page.getByLabel('Organization')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit inquiry' }).first()).toBeVisible()
  })
})
