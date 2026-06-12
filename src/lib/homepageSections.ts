export type HomepageSectionId =
  | 'hero'
  | 'countdown'
  | 'about'
  | 'impact'
  | 'events'
  | 'team'
  | 'contributors'
  | 'sponsors'
  | 'gallery'
  | 'testimonials'
  | 'register'
  | 'faq'
  | 'contact'
  | 'footer'

export type HomepageSectionConfig = {
  id: HomepageSectionId
  label: string
  visibleKey: string
  titleKey?: string
  defaultTitle?: string
  /** When set, the section heading is edited on another Content tab. */
  titleContentTabId?: string
}

export const homepageSections: HomepageSectionConfig[] = [
  {
    id: 'hero',
    label: 'Hero',
    visibleKey: 'hero_visible',
    titleKey: 'hero_title',
    defaultTitle: "Khelgram Foundation Children's Sports Festival 2026",
    titleContentTabId: 'hero',
  },
  {
    id: 'countdown',
    label: 'Countdown',
    visibleKey: 'countdown_visible',
    titleKey: 'countdown_title',
    defaultTitle: 'Countdown to Festival Day',
    titleContentTabId: 'countdown',
  },
  {
    id: 'about',
    label: 'About',
    visibleKey: 'about_visible',
    titleKey: 'about_title',
    defaultTitle: 'About Khelgram Foundation',
    titleContentTabId: 'about',
  },
  {
    id: 'impact',
    label: 'Impact',
    visibleKey: 'impact_visible',
    titleKey: 'impact_title',
    defaultTitle: 'Impact',
  },
  {
    id: 'events',
    label: 'Events',
    visibleKey: 'events_visible',
    titleKey: 'events_title',
    defaultTitle: 'Festival Events',
    titleContentTabId: 'events',
  },
  {
    id: 'team',
    label: 'Team',
    visibleKey: 'team_visible',
    titleKey: 'team_title',
    defaultTitle: 'Our Team',
  },
  {
    id: 'contributors',
    label: 'Contributors',
    visibleKey: 'contributors_visible',
    titleKey: 'contributors_title',
    defaultTitle: 'Contributors',
  },
  {
    id: 'sponsors',
    label: 'Sponsors',
    visibleKey: 'sponsors_visible',
    titleKey: 'sponsors_title',
    defaultTitle: 'Sponsors',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    visibleKey: 'gallery_visible',
    titleKey: 'gallery_title',
    defaultTitle: 'Gallery',
    titleContentTabId: 'gallery',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    visibleKey: 'testimonials_visible',
    titleKey: 'testimonials_title',
    defaultTitle: 'Testimonials',
  },
  {
    id: 'register',
    label: 'Register',
    visibleKey: 'register_visible',
    titleKey: 'register_title',
    defaultTitle: 'Register Your Child',
    titleContentTabId: 'register',
  },
  {
    id: 'faq',
    label: 'FAQ',
    visibleKey: 'faq_visible',
    titleKey: 'faq_title',
    defaultTitle: 'FAQ',
  },
  {
    id: 'contact',
    label: 'Contact',
    visibleKey: 'contact_visible',
    titleKey: 'contact_title',
    defaultTitle: 'Contact',
    titleContentTabId: 'contact',
  },
  {
    id: 'footer',
    label: 'Footer',
    visibleKey: 'footer_visible',
  },
]

export function isSectionVisible(settingsMap: Record<string, string>, visibleKey: string): boolean {
  const value = settingsMap[visibleKey]
  if (value === undefined || value === '') {
    return true
  }

  return value === 'true'
}

export function sectionTitle(
  settingsMap: Record<string, string>,
  titleKey: string,
  defaultTitle: string,
): string {
  return settingsMap[titleKey] ?? defaultTitle
}
