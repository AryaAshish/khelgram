import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 18 implementation:
 *   RUN_PHASE18_E2E=1 npm run verify:phase -- 18
 */
test.describe('Phase 18: NGO impact stats @phase18', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE18_E2E !== '1', 'Phase 18 E2E disabled until enabled')
  })

  test('homepage shows NGO impact stat labels', async ({ page }) => {
    await visitPublicHomepage(page)

    await expect(page.locator('#impact')).toBeVisible()
    await expect(page.getByText('Villages Reached')).toBeVisible()
    await expect(page.getByText('Athletes in Programs')).toBeVisible()
  })
})
