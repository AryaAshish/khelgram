import { test, expect } from '../fixtures'
import { getAdminCredentials, loginAsAdmin, logoutFromAdmin } from '../helpers/auth'

test.describe('Phase 5 @phase5', () => {
  test('unauthenticated /admin redirects to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
  })

  test('wrong password shows readable error', async ({ page }) => {
    test.skip(!process.env.VITE_SUPABASE_URL, 'Requires live Supabase configuration in .env')

    await page.goto('/admin/login')
    await page.getByLabel('Email').fill('wrong-admin@example.com')
    await page.getByLabel('Password').fill('not-the-password')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('alert')).toHaveText('Invalid email or password')
  })

  test('admin can login, reach dashboard, and logout', async ({ page }) => {
    test.skip(!getAdminCredentials(), 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env')

    await loginAsAdmin(page)
    await expect(page.getByRole('link', { name: /Registrations/ })).toBeVisible()
    await logoutFromAdmin(page)

    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
  })
})
