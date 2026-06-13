import { describe, expect, it } from 'vitest'
import { localizedSetting } from './localizedSetting'

describe('localizedSetting', () => {
  const settings = {
    org_hero_title: 'English title',
    org_hero_title_hi: 'हिंदी शीर्षक',
  }

  it('returns English value for en language', () => {
    expect(localizedSetting(settings, 'org_hero_title', 'Fallback', 'en')).toBe('English title')
  })

  it('returns Hindi CMS value when language is hi', () => {
    expect(localizedSetting(settings, 'org_hero_title', 'Fallback', 'hi')).toBe('हिंदी शीर्षक')
  })

  it('falls back to English CMS then default when Hindi key is missing', () => {
    expect(
      localizedSetting({ org_hero_title: 'English only' }, 'org_hero_title', 'Fallback', 'hi'),
    ).toBe('English only')
    expect(localizedSetting({}, 'org_hero_title', 'Fallback', 'hi')).toBe('Fallback')
  })
})
