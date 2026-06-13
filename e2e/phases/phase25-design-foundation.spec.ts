import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 25 implementation:
 *   RUN_PHASE25_E2E=1 npm run verify:phase -- 25
 */
test.describe('Phase 25: Design foundation @phase25', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE25_E2E !== '1', 'Phase 25 E2E disabled until enabled')
  })

  test('homepage hero loads without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await visitPublicHomepage(page)

    await expect(page.locator('#hero')).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
