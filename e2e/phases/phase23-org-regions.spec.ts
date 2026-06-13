import { test, expect } from '../fixtures'

/**
 * Enable after Phase 23 implementation:
 *   RUN_PHASE23_E2E=1 npm run verify:phase -- 23
 */
test.describe('Phase 23: Org regions reach @phase23', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE23_E2E !== '1', 'Phase 23 E2E disabled until enabled')
  })

  test('homepage renders reach section with seeded regions', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#reach')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Where We Work' })).toBeVisible()
    await expect(page.getByText('Uttar Pradesh')).toBeVisible()
    await expect(page.getByText('Bihar')).toBeVisible()
  })
})
