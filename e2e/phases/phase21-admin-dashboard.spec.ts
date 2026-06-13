import { test, expect } from '../fixtures'
import { loginAsAdmin, getAdminCredentials } from '../helpers/auth'

/**
 * Enable after Phase 21 implementation:
 *   RUN_PHASE21_E2E=1 npm run verify:phase -- 21
 */
test.describe('Phase 21: Admin dashboard groups @phase21', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE21_E2E !== '1', 'Phase 21 E2E disabled until enabled')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('dashboard shows organization and event summaries', async ({ page }) => {
    await loginAsAdmin(page)

    await expect(page.getByText('Published programs')).toBeVisible()
    await expect(page.getByText('Open leads')).toBeVisible()
    await expect(page.getByText('Game capacity')).toBeVisible()
    await expect(page.getByText('Khel 2026 Registrations')).toBeVisible()
  })
})
