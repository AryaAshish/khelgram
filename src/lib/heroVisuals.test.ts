import { describe, expect, it } from 'vitest'
import { visualAssets } from '@/fixtures/visualAssets'
import { resolveHeroVisual } from './heroVisuals'

describe('resolveHeroVisual', () => {
  it('returns fixture URL when CMS value is empty', () => {
    expect(resolveHeroVisual({}, 'org_hero_image').url).toBe(visualAssets.orgHero.url)
  })

  it('prefers CMS URL when provided', () => {
    const cmsUrl = 'https://cdn.example.org/custom-hero.jpg'
    expect(resolveHeroVisual({ org_hero_image: cmsUrl }, 'org_hero_image').url).toBe(cmsUrl)
  })

  it('resolves festival and about fixtures', () => {
    expect(resolveHeroVisual({}, 'khel2026_hero_image').url).toBe(visualAssets.festivalAction.url)
    expect(resolveHeroVisual({}, 'org_about_image').url).toBe(visualAssets.aboutCommunity.url)
  })

  it('ignores whitespace-only CMS values', () => {
    expect(resolveHeroVisual({ org_hero_image: '   ' }, 'org_hero_image').url).toBe(
      visualAssets.orgHero.url,
    )
  })
})
