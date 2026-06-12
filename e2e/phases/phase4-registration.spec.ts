import { test, expect } from '../fixtures'

function uniqueRegistrationInput() {
  const stamp = Date.now()
  return {
    childName: `E2E Child ${stamp}`,
    age: '9',
    parentName: 'E2E Parent',
    email: `e2e-${stamp}@khelgram.test`,
    phone: '9999999999',
    eventName: 'Sack Race',
  }
}

test.describe('Phase 4 @phase4', () => {
  test('registration form submits and shows success toast', async ({ page }) => {
    test.skip(!process.env.VITE_SUPABASE_URL, 'Requires live Supabase configuration in .env')

    const input = uniqueRegistrationInput()
    await page.goto('/register')

    await page.getByLabel('Child Name').fill(input.childName)
    await page.getByLabel('Age').fill(input.age)
    await page.getByLabel('Parent Name').fill(input.parentName)
    await page.getByLabel('Email').fill(input.email)
    await page.getByLabel('Phone').fill(input.phone)
    await page.getByLabel(input.eventName).check()
    await page.getByRole('button', { name: 'Submit Registration' }).click()

    await expect(page.getByText(/Registration confirmed!/)).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText(/KG-2026-/)).toBeVisible()
  })
})
