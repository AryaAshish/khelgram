import { test, expect } from '../fixtures'
import { visitPublicHomepage } from '../helpers/pageHealth'

test.describe('Phase 3 @phase3', () => {
  test('homepage loads games and gallery from Supabase', async ({ page }) => {
    await visitPublicHomepage(page)

    await expect(page.getByRole('heading', { name: 'Festival Events' })).toBeVisible()
    await expect(page.getByText('Sack Race')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible()
  })
})
