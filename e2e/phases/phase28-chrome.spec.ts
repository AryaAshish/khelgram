import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 28 implementation:
 *   RUN_PHASE28_E2E=1 npm run verify:phase -- 28
 */
test.describe('Phase 28: global chrome @phase28', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE28_E2E !== '1', 'Phase 28 E2E disabled until enabled')
  })

  test('mobile header menu opens and Khel 2026 pill is visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await visitPublicHomepage(page)

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#primary-navigation.site-nav--open')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Khel2026' })).toBeVisible()
  })

  test('get involved page exposes stakeholder tabs', async ({ page }) => {
    await page.goto('/get-involved')
    await expect(page.getByRole('tab', { name: 'Partners' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Volunteers' })).toBeVisible()
  })
})
