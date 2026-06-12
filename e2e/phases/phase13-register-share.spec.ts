import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after shareable registration route:
 *   RUN_PHASE13_E2E=1 npm run verify:phase -- 13
 */
test.describe('Phase 13: Shareable registration @phase13', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE13_E2E !== '1', 'Phase 13 E2E disabled until enabled')
  })

  test('dedicated /register route shows form and share actions', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Register Your Child' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy registration link' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Share registration form' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to Khel 2026/i })).toBeVisible()
  })

  test('Khel 2026 register CTA opens shareable registration page', async ({ page }) => {
    await visitPublicHomepage(page)
    await page.getByRole('link', { name: 'Khel2026' }).click()
    await page.getByRole('link', { name: 'Register Now' }).first().click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.getByLabel('Child Name')).toBeVisible()
  })
})
