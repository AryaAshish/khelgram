import { describe, expect, it } from 'vitest'
import { homepageSections, isSectionVisible, sectionTitle } from './homepageSections'

describe('homepageSections', () => {
  it('defines visibility keys for each homepage block', () => {
    expect(homepageSections.map((section) => section.visibleKey)).toEqual([
      'hero_visible',
      'countdown_visible',
      'about_visible',
      'impact_visible',
      'events_visible',
      'team_visible',
      'contributors_visible',
      'sponsors_visible',
      'gallery_visible',
      'testimonials_visible',
      'register_visible',
      'faq_visible',
      'contact_visible',
      'footer_visible',
    ])
  })
})

describe('isSectionVisible', () => {
  it('defaults to visible when setting is missing or empty', () => {
    expect(isSectionVisible({}, 'team_visible')).toBe(true)
    expect(isSectionVisible({ team_visible: '' }, 'team_visible')).toBe(true)
  })

  it('respects explicit false values', () => {
    expect(isSectionVisible({ team_visible: 'false' }, 'team_visible')).toBe(false)
    expect(isSectionVisible({ team_visible: 'true' }, 'team_visible')).toBe(true)
  })

  it('treats unknown visibility values as hidden', () => {
    expect(isSectionVisible({ team_visible: 'no' }, 'team_visible')).toBe(false)
  })
})

describe('sectionTitle', () => {
  it('falls back to default title when setting is missing', () => {
    expect(sectionTitle({}, 'team_title', 'Our Team')).toBe('Our Team')
    expect(sectionTitle({ team_title: 'Leadership' }, 'team_title', 'Our Team')).toBe('Leadership')
  })

  it('returns blank title when setting is explicitly empty', () => {
    expect(sectionTitle({ team_title: '' }, 'team_title', 'Our Team')).toBe('')
  })
})
