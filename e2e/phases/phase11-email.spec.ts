import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'

/**
 * Enable after Phase 11 implementation:
 *   RUN_PHASE11_E2E=1 npm run verify:phase -- 11
 *
 * Optional: set RESEND_E2E_INBOX_ID to assert delivery via Resend test API.
 */
test.describe('Phase 11: Email Notifications @phase11', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE11_E2E !== '1', 'Phase 11 E2E disabled until implemented')
  })

  test('registration triggers confirmation email', async ({ page }) => {
    test.skip(!process.env.VITE_SUPABASE_URL, 'Requires live Supabase configuration in .env')

    const stamp = Date.now()
    const email = `email-e2e-${stamp}@khelgram.test`

    await visitPublicHomepage(page)
    await page.locator('#register').scrollIntoViewIfNeeded()
    await page.getByLabel('Child Name').fill(`Email Child ${stamp}`)
    await page.getByLabel('Age').fill('9')
    await page.getByLabel('Parent Name').fill('Email Parent')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Phone').fill('9999999999')
    await page.getByLabel('Sack Race').check()
    await page.getByRole('button', { name: 'Submit Registration' }).click()
    await expect(page.getByText(/Registration confirmed!/)).toBeVisible({ timeout: 15_000 })

    test.skip(!process.env.RESEND_E2E_INBOX_ID, 'Set RESEND_E2E_INBOX_ID to verify delivery')
    await page.waitForTimeout(10_000)
    // Implement Resend inbox polling helper in e2e/helpers/resend.ts during Phase 11.
  })

  test('admin can resend confirmation email', async ({ page }) => {
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')

    await loginAsAdmin(page)
    await page.getByRole('link', { name: /Registrations/ }).click()
    await page
      .getByRole('link', { name: /KG-2026-/ })
      .first()
      .click()
    await page.getByRole('button', { name: 'Resend Confirmation' }).click()
    await expect(page.getByText(/Confirmation email sent/i)).toBeVisible({ timeout: 15_000 })
  })
})
