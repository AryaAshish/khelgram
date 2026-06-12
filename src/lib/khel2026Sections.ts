export type Khel2026SectionId = 'hero' | 'countdown' | 'events' | 'gallery' | 'registerCta' | 'faq'

export type Khel2026SectionConfig = {
  id: Khel2026SectionId
  label: string
  visibleKey: string
  titleKey?: string
  defaultTitle?: string
}

export const khel2026Sections: Khel2026SectionConfig[] = [
  {
    id: 'hero',
    label: 'Hero',
    visibleKey: 'khel2026_hero_visible',
    titleKey: 'hero_title',
    defaultTitle: "Khelgram Foundation Children's Sports Festival 2026",
  },
  {
    id: 'countdown',
    label: 'Countdown',
    visibleKey: 'khel2026_countdown_visible',
    titleKey: 'countdown_title',
    defaultTitle: 'Countdown to Festival Day',
  },
  {
    id: 'events',
    label: 'Events',
    visibleKey: 'khel2026_events_visible',
    titleKey: 'events_title',
    defaultTitle: 'Festival Events',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    visibleKey: 'khel2026_gallery_visible',
    titleKey: 'gallery_title',
    defaultTitle: 'Gallery',
  },
  {
    id: 'registerCta',
    label: 'Register CTA',
    visibleKey: 'khel2026_register_cta_visible',
    titleKey: 'register_title',
    defaultTitle: 'Register Your Child',
  },
  {
    id: 'faq',
    label: 'FAQ',
    visibleKey: 'khel2026_faq_visible',
    titleKey: 'faq_title',
    defaultTitle: 'FAQ',
  },
]

export { isSectionVisible, sectionTitle } from './homepageSections'
