import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Khelgram Foundation')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Festival Events' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'About Khelgram Foundation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Register Your Child' })).toBeVisible()
})
