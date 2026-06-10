import { test, expect } from '../fixtures'
import path from 'node:path'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 8 implementation:
 *   RUN_PHASE8_E2E=1 npm run verify:phase -- 8
 */
test.describe('Phase 8: Media Library @phase8', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE8_E2E !== '1', 'Phase 8 E2E disabled until implemented')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('uploaded media appears in library and on public gallery', async ({ page }) => {
    const fixturePath = path.join(process.cwd(), 'e2e/fixtures/sample-upload.png')

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Media' }).click()
    await page.setInputFiles('input[type="file"]', fixturePath)
    await expect(page.getByText('sample-upload.png')).toBeVisible()

    await page.getByRole('link', { name: 'Gallery' }).click()
    await page.getByRole('button', { name: 'Add from media library' }).click()
    await page.getByText('sample-upload.png').click()
    await page.getByRole('button', { name: 'Save gallery' }).click()

    await visitPublicHomepage(page)
    await expect(page.locator('#gallery img[src*="sample-upload"]')).toBeVisible()
  })
})
