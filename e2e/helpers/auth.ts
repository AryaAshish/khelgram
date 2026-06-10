import { expect, type Page } from '@playwright/test'

export function getAdminCredentials() {
  const email = process.env.E2E_ADMIN_EMAIL
  const password = process.env.E2E_ADMIN_PASSWORD

  if (!email || !password) {
    return null
  }

  return { email, password }
}

export function requireAdminCredentials() {
  const credentials = getAdminCredentials()
  if (!credentials) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env for admin E2E tests.')
  }
  return credentials
}

export async function loginAsAdmin(page: Page) {
  const { email, password } = requireAdminCredentials()

  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
}

export async function logoutFromAdmin(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
}
