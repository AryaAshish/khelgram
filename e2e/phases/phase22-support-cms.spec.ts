import { test, expect } from '../fixtures'

/**
 * Enable after Phase 22 implementation:
 *   RUN_PHASE22_E2E=1 npm run verify:phase -- 22
 */
test.describe('Phase 22: Support CMS @phase22', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE22_E2E !== '1', 'Phase 22 E2E disabled until enabled')
  })

  test('homepage renders support section with donate CTA', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#support')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Support Our Mission' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Donate now' })).toBeVisible()
  })

  test('get involved page renders support section', async ({ page }) => {
    await page.goto('/get-involved')

    await expect(page.locator('#support')).toBeVisible()
  })
})
