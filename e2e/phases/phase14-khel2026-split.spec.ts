import { test, expect } from '../fixtures'
import { visitKhel2026Page, visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after NGO homepage / Khel 2026 split:
 *   RUN_PHASE14_E2E=1 npm run verify:phase -- 14
 */
test.describe('Phase 14: NGO homepage and Khel 2026 split @phase14', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE14_E2E !== '1', 'Phase 14 E2E disabled until enabled')
  })

  test('NGO homepage has no festival countdown or register form', async ({ page }) => {
    await visitPublicHomepage(page)
    await expect(page.getByRole('heading', { name: 'Countdown to Festival Day' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Register Your Child' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Khel2026' })).toBeVisible()
  })

  test('Khel2026 nav tab loads full event landing page', async ({ page }) => {
    await visitPublicHomepage(page)
    await page.getByRole('link', { name: 'Khel2026' }).click()
    await expect(page).toHaveURL(/\/khel2026$/)
    await visitKhel2026Page(page)
  })

  test('/register links back to Khel 2026', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('link', { name: /Back to Khel 2026/i })).toBeVisible()
    await page.getByRole('link', { name: /Back to Khel 2026/i }).click()
    await expect(page).toHaveURL(/\/khel2026$/)
  })
})
