import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'

/**
 * Enable after Phase 10 implementation:
 *   RUN_PHASE10_E2E=1 npm run verify:phase -- 10
 */
test.describe('Phase 10: Games Management @phase10', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE10_E2E !== '1', 'Phase 10 E2E disabled until implemented')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('capacity enforcement waitlists second registration', async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Games' }).click()
    await page
      .getByRole('row', { name: /Sack Race/ })
      .getByRole('button', { name: 'Edit' })
      .click()
    await page.getByLabel('Capacity').fill('1')
    await page.getByRole('button', { name: 'Save game' }).click()

    await page.goto('/register')
    const submitRegistration = async (suffix: string) => {
      const stamp = Date.now() + suffix
      await page.getByLabel('Child Name').fill(`Child ${stamp}`)
      await page.getByLabel('Age').fill('9')
      await page.getByLabel('Parent Name').fill('Parent')
      await page.getByLabel('Email').fill(`cap-${stamp}@khelgram.test`)
      await page.getByLabel('Phone').fill('9999999999')
      await page.getByLabel('Sack Race').check()
      await page.getByRole('button', { name: 'Submit Registration' }).click()
    }

    await submitRegistration('a')
    await expect(page.getByText(/Registration confirmed!/)).toBeVisible({ timeout: 15_000 })

    await submitRegistration('b')
    await expect(page.getByText(/waitlist/i)).toBeVisible({ timeout: 15_000 })
  })
})
