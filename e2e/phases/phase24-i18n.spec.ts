import { test, expect } from '../fixtures'

/**
 * Enable after Phase 24 implementation:
 *   RUN_PHASE24_E2E=1 npm run verify:phase -- 24
 */
test.describe('Phase 24: i18n language toggle @phase24', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE24_E2E !== '1', 'Phase 24 E2E disabled until enabled')
  })

  test('header nav switches to Hindi', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'हिंदी' }).click()
    await expect(page.getByRole('link', { name: 'हमारे बारे में' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'कार्यक्रम' })).toBeVisible()
  })

  test('register form labels switch to Hindi', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: 'हिंदी' }).click()

    await expect(page.getByText('बच्चे का नाम')).toBeVisible()
    await expect(page.getByText('पंजीकरण जमा करें')).toBeVisible()
  })
})
