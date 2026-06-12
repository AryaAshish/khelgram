import { expect, type Page } from '@playwright/test'

const ORG_HOME_SECTION_HEADINGS = [
  'Building sporting futures in rural India',
  'About Khelgram Foundation',
  'Impact',
] as const

const KHEL2026_SECTION_HEADINGS = [
  'Countdown to Festival Day',
  'Festival Events',
  'Register Your Child',
] as const

export async function assertOrgHomepageHealthy(page: Page) {
  await expect(page.getByText('Khelgram Foundation').first()).toBeVisible()

  for (const heading of ORG_HOME_SECTION_HEADINGS) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }
}

export async function assertKhel2026PageHealthy(page: Page) {
  await expect(page.getByText('Khelgram Foundation').first()).toBeVisible()

  for (const heading of KHEL2026_SECTION_HEADINGS) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }
}

/** @deprecated use assertOrgHomepageHealthy */
export async function assertPublicHomepageHealthy(page: Page) {
  await assertOrgHomepageHealthy(page)
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
  await assertOrgHomepageHealthy(page)
}

export async function visitKhel2026Page(page: Page) {
  await page.goto('/khel2026')
  await assertKhel2026PageHealthy(page)
}
