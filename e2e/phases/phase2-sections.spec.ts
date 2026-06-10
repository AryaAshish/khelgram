import { test } from '../fixtures'
import { assertNoHorizontalOverflow, visitPublicHomepage } from '../helpers/pageHealth'

test.describe('Phase 2 @phase2', () => {
  test('public sections render on desktop', async ({ page }) => {
    await visitPublicHomepage(page)
    await assertNoHorizontalOverflow(page)
  })
})
