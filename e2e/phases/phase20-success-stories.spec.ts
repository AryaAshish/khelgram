import { test, expect } from '../fixtures'

/**
 * Enable after Phase 20 implementation:
 *   RUN_PHASE20_E2E=1 npm run verify:phase -- 20
 */
test.describe('Phase 20: Success stories @phase20', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE20_E2E !== '1', 'Phase 20 E2E disabled until enabled')
  })

  test('homepage renders success stories section', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#success-stories')).toBeVisible()
    await expect(page.getByText('From village field to district finals')).toBeVisible()
  })
})
