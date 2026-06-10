import { expect, type Page } from '@playwright/test'

const PUBLIC_SECTION_HEADINGS = [
  'Countdown to Festival Day',
  'About Khelgram Foundation',
  'Festival Events',
  'Register Your Child',
] as const

export async function assertPublicHomepageHealthy(page: Page) {
  await expect(page.getByText('Khelgram Foundation').first()).toBeVisible()

  for (const heading of PUBLIC_SECTION_HEADINGS) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }
}

export async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth + 1
  })

  expect(hasOverflow, 'Page should not overflow horizontally on this viewport').toBe(false)
}

export async function visitPublicHomepage(page: Page) {
  await page.goto('/')
  await assertPublicHomepageHealthy(page)
}
