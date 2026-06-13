import { describe, expect, it } from 'vitest'
import { orgHomeSections } from './orgHomeSections'

describe('orgHomeSections', () => {
  it('defines org homepage visibility keys', () => {
    expect(orgHomeSections.map((section) => section.visibleKey)).toEqual([
      'org_hero_visible',
      'about_visible',
      'programs_visible',
      'get_involved_visible',
      'impact_visible',
      'success_stories_visible',
      'support_visible',
      'reach_visible',
      'team_visible',
      'contributors_visible',
      'sponsors_visible',
      'testimonials_visible',
      'contact_visible',
      'footer_visible',
    ])
  })
})
