import { describe, expect, it } from 'vitest'
import { contentGroups, contentSections, parseAboutValues } from './contentSections'

describe('contentSections', () => {
  it('groups CMS tabs into organization, Khel 2026, and shared', () => {
    expect(contentGroups.map((group) => group.id)).toEqual(['organization', 'khel2026', 'shared'])
    expect(contentGroups[0]?.sections.some((section) => section.id === 'org_hero')).toBe(true)
    expect(contentGroups[1]?.sections.some((section) => section.id === 'khel2026_hero')).toBe(true)
    expect(contentGroups[2]?.sections.some((section) => section.id === 'site')).toBe(true)
  })

  it('uses org and khel2026 namespaced field keys', () => {
    const orgHero = contentGroups[0]?.sections.find((section) => section.id === 'org_hero')
    const eventHero = contentGroups[1]?.sections.find((section) => section.id === 'khel2026_hero')
    expect(orgHero?.fields.some((field) => field.key === 'org_hero_title')).toBe(true)
    expect(
      orgHero?.fields.some((field) => field.key === 'org_hero_image' && field.type === 'image'),
    ).toBe(true)
    expect(eventHero?.fields.some((field) => field.key === 'khel2026_hero_title')).toBe(true)
  })

  it('includes org and event section visibility controls', () => {
    const orgSections = contentGroups[0]?.sections.find((section) => section.id === 'org_sections')
    const eventSections = contentGroups[1]?.sections.find(
      (section) => section.id === 'khel2026_sections',
    )
    expect(orgSections?.fields.some((field) => field.key === 'org_hero_visible')).toBe(true)
    expect(orgSections?.fields.some((field) => field.key === 'org_impact_title')).toBe(true)
    expect(eventSections?.fields.some((field) => field.key === 'khel2026_hero_visible')).toBe(true)
    expect(eventSections?.fields.some((field) => field.key === 'khel2026_faq_title')).toBe(true)
  })

  it('flattens all sections for legacy lookups', () => {
    expect(contentSections.length).toBeGreaterThan(10)
  })
})

describe('parseAboutValues', () => {
  it('splits multiline values and removes blanks', () => {
    expect(parseAboutValues('One\n\nTwo\n  Three  ')).toEqual(['One', 'Two', 'Three'])
  })
})
