import { describe, expect, it } from 'vitest'
import { contentSections, parseAboutValues } from './contentSections'

describe('contentSections', () => {
  it('defines editable fields for each public section', () => {
    expect(contentSections.map((section) => section.id)).toEqual([
      'hero',
      'countdown',
      'about',
      'events',
      'gallery',
      'register',
      'contact',
      'footer',
      'sections',
      'site',
    ])
    expect(contentSections[0]?.fields.some((field) => field.key === 'hero_title')).toBe(true)
  })

  it('includes section visibility controls and credibility headings', () => {
    const sectionsTab = contentSections.find((section) => section.id === 'sections')
    expect(sectionsTab?.fields.some((field) => field.key === 'team_visible')).toBe(true)
    expect(sectionsTab?.fields.some((field) => field.key === 'team_title')).toBe(true)
    expect(sectionsTab?.fields.some((field) => field.key === 'hero_title')).toBe(false)
  })

  it('exposes site name on the site tab', () => {
    const siteTab = contentSections.find((section) => section.id === 'site')
    expect(siteTab?.fields.some((field) => field.key === 'site_name')).toBe(true)
  })
})

describe('parseAboutValues', () => {
  it('splits multiline values and removes blanks', () => {
    expect(parseAboutValues('One\n\nTwo\n  Three  ')).toEqual(['One', 'Two', 'Three'])
  })
})
