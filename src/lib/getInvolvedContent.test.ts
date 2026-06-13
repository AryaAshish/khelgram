import { describe, expect, it } from 'vitest'
import { getInvolvedContent } from './getInvolvedContent'

describe('getInvolvedContent', () => {
  it('returns default stakeholder cards when settings are empty', () => {
    const content = getInvolvedContent({})

    expect(content.title).toBe('Get Involved')
    expect(content.cards).toHaveLength(4)
    expect(content.cards[0]).toMatchObject({
      id: 'parents',
      title: 'Parents',
      buttonUrl: '/register',
    })
    expect(content.cards[1]).toMatchObject({
      id: 'schools',
      buttonUrl: '#contact',
    })
    expect(content.cards[2]).toMatchObject({
      id: 'partners',
      buttonUrl: '/get-involved#partner-inquiry',
    })
    expect(content.cards[3]).toMatchObject({
      id: 'volunteers',
      buttonUrl: '/get-involved#volunteer-signup',
    })
  })

  it('merges CMS overrides for title and card fields', () => {
    const content = getInvolvedContent({
      org_get_involved_title: 'Join Us',
      org_get_involved_parents_title: 'Families',
      org_get_involved_parents_cta_url: '/register',
      org_get_involved_partners_cta_label: 'Partner with us',
      org_get_involved_partners_cta_url: 'mailto:hello@khelgram.org',
    })

    expect(content.title).toBe('Join Us')
    expect(content.cards[0]?.title).toBe('Families')
    expect(content.cards[2]?.buttonLabel).toBe('Partner with us')
    expect(content.cards[2]?.buttonUrl).toBe('mailto:hello@khelgram.org')
  })
})
