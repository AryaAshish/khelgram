import { test } from '../fixtures'
import { assertNoHorizontalOverflow, visitPublicHomepage } from '../helpers/pageHealth'

test.describe('Mobile viewport @mobile', () => {
  test('homepage has no horizontal overflow at 375px', async ({ page }) => {
    await visitPublicHomepage(page)
    await assertNoHorizontalOverflow(page)
  })
})
