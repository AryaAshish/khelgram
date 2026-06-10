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
    ])
    expect(contentSections[0]?.fields.some((field) => field.key === 'hero_title')).toBe(true)
  })
})

describe('parseAboutValues', () => {
  it('splits multiline values and removes blanks', () => {
    expect(parseAboutValues('One\n\nTwo\n  Three  ')).toEqual(['One', 'Two', 'Three'])
  })
})
