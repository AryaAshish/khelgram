import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 26 implementation:
 *   RUN_PHASE26_E2E=1 npm run verify:phase -- 26
 */
test.describe('Phase 26: NGO homepage visual uplift @phase26', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE26_E2E !== '1', 'Phase 26 E2E disabled until enabled')
  })

  test('homepage hero shows photography and impact band', async ({ page }) => {
    await visitPublicHomepage(page)

    await expect(page.locator('#hero img')).toBeVisible()
    await expect(page.getByText('120+ villages reached')).toBeVisible()
    await expect(page.locator('#impact')).toHaveAttribute('data-variant', 'impact-band')
    await expect(page.getByText('Villages Reached')).toBeVisible()
  })
})
