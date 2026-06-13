import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 30 implementation:
 *   RUN_PHASE30_E2E=1 npm run verify:phase -- 30
 */
test.describe('Phase 30: CMS hero images @phase30', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE30_E2E !== '1', 'Phase 30 E2E disabled until enabled')
  })

  test('homepage hero shows curated photography by default', async ({ page }) => {
    await visitPublicHomepage(page)

    const heroImage = page.locator('#hero img')
    await expect(heroImage).toBeVisible()
    await expect(heroImage).toHaveAttribute('src', /unsplash|pexels/)
  })
})
