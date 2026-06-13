import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 29 implementation:
 *   RUN_PHASE29_E2E=1 npm run verify:phase -- 29
 */
test.describe('Phase 29: motion and interactions @phase29', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE29_E2E !== '1', 'Phase 29 E2E disabled until enabled')
  })

  test('homepage testimonials carousel exposes navigation controls', async ({ page }) => {
    await visitPublicHomepage(page)
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  })
})
