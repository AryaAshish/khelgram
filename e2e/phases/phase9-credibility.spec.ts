import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin } from '../helpers/auth'
import { visitPublicHomepage } from '../helpers/pageHealth'

/**
 * Enable after Phase 9 implementation:
 *   RUN_PHASE9_E2E=1 npm run verify:phase -- 9
 */
test.describe('Phase 9: Credibility Sections @phase9', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PHASE9_E2E !== '1', 'Phase 9 E2E disabled until implemented')
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')
  })

  test('published team member appears on public site', async ({ page }) => {
    const memberName = `E2E Coach ${Date.now()}`

    await loginAsAdmin(page)
    await page.getByRole('link', { name: 'Team' }).click()
    await page.getByLabel('Name').fill(memberName)
    await page.getByLabel('Role').fill('Volunteer Coach')
    await page.getByLabel('Published').check()
    await page.getByRole('button', { name: 'Add member' }).click()

    await visitPublicHomepage(page)
    await expect(page.getByText(memberName)).toBeVisible()
  })

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await visitPublicHomepage(page)
    const firstQuestion = page.getByRole('button', { name: /What should my child bring/i }).first()
    await firstQuestion.click()
    await expect(page.getByText(/comfortable clothes/i)).toBeVisible()
    await firstQuestion.click()
    await expect(page.getByText(/comfortable clothes/i)).not.toBeVisible()
  })
})
