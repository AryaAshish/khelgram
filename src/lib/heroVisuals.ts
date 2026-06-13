import { visualAssets, type VisualAsset } from '@/fixtures/visualAssets'

export type HeroVisualKey = 'org_hero_image' | 'khel2026_hero_image' | 'org_about_image'

const fixtureByKey: Record<HeroVisualKey, VisualAsset> = {
  org_hero_image: visualAssets.orgHero,
  khel2026_hero_image: visualAssets.festivalAction,
  org_about_image: visualAssets.aboutCommunity,
}

export function resolveHeroVisual(
  settingsMap: Record<string, string>,
  key: HeroVisualKey,
): VisualAsset {
  const cmsUrl = settingsMap[key]?.trim()
  const fixture = fixtureByKey[key]

  if (cmsUrl) {
    return {
      url: cmsUrl,
      alt: fixture.alt,
      tag: fixture.tag,
    }
  }

  return fixture
}
