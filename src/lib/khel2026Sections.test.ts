import { describe, expect, it } from 'vitest'
import { khel2026Sections } from './khel2026Sections'

describe('khel2026Sections', () => {
  it('defines khel2026 visibility keys for each event block', () => {
    expect(khel2026Sections.map((section) => section.visibleKey)).toEqual([
      'khel2026_hero_visible',
      'khel2026_countdown_visible',
      'khel2026_events_visible',
      'khel2026_gallery_visible',
      'khel2026_register_cta_visible',
      'khel2026_faq_visible',
    ])
  })

  it('uses khel2026 namespaced title keys', () => {
    expect(khel2026Sections.map((section) => section.titleKey)).toEqual([
      'khel2026_hero_title',
      'khel2026_countdown_title',
      'khel2026_events_title',
      'khel2026_gallery_title',
      'khel2026_register_title',
      'khel2026_faq_title',
    ])
  })
})
