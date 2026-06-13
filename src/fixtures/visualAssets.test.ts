import { describe, expect, it } from 'vitest'
import { championAthletes, orgHeroEyebrow, visualAssets } from './visualAssets'

describe('visualAssets', () => {
  it('exposes curated NGO and event imagery', () => {
    expect(visualAssets.orgHero.tag).toBe('rural')
    expect(visualAssets.festivalAction.tag).toBe('event')
    expect(orgHeroEyebrow).toContain('villages')
    expect(visualAssets.orgHero.aiPrompt).toContain('Indian children')
  })

  it('lists publicly licensed Indian champion athletes', () => {
    expect(championAthletes).toHaveLength(3)
    expect(championAthletes[0]?.url).toContain('wikimedia.org')
    expect(championAthletes.every((athlete) => athlete.credit.length > 0)).toBe(true)
  })
})
