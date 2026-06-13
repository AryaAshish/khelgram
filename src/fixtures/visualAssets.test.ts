import { describe, expect, it } from 'vitest'
import { orgHeroEyebrow, visualAssets } from './visualAssets'

describe('visualAssets', () => {
  it('exposes curated NGO and event imagery', () => {
    expect(visualAssets.orgHero.tag).toBe('rural')
    expect(visualAssets.festivalAction.tag).toBe('event')
    expect(orgHeroEyebrow).toContain('villages')
  })
})
