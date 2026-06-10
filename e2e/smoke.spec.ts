import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Khelgram Foundation')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Festival Events' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'About Khelgram Foundation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Register Your Child' })).toBeVisible()
})

test('admin route redirects to login without session', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
})
