import { test, expect } from '../fixtures'
import { visitKhel2026Page } from '../helpers/pageHealth'

/**
 * Enable after Phase 27 implementation:
 *   RUN_PHASE27_E2E=1 npm run verify:phase -- 27
 */
test.describe('Phase 27: festival skin @phase27', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE27_E2E !== '1', 'Phase 27 E2E disabled until enabled')
  })

  test('khel2026 hero uses festival shell and photography', async ({ page }) => {
    await visitKhel2026Page(page)

    await expect(page.locator('#hero')).toHaveAttribute('data-variant', 'festival')
    await expect(page.locator('#hero img')).toBeVisible()
    await expect(page.getByText('Khel 2026 Festival')).toBeVisible()
  })

  test('register page shows festival form layout and back strip', async ({ page }) => {
    await page.goto('/register')

    await expect(page.getByRole('link', { name: /Back to Khel 2026/i })).toBeVisible()
    await expect(page.getByText('Why join Khel 2026')).toBeVisible()
    await expect(page.locator('.register-event-chips')).toBeVisible()
  })
})
