export type OrgHomeSectionId =
  | 'hero'
  | 'about'
  | 'impact'
  | 'team'
  | 'contributors'
  | 'sponsors'
  | 'testimonials'
  | 'contact'
  | 'footer'

export type OrgHomeSectionConfig = {
  id: OrgHomeSectionId
  label: string
  visibleKey: string
  titleKey?: string
  defaultTitle?: string
}

export const orgHomeSections: OrgHomeSectionConfig[] = [
  {
    id: 'hero',
    label: 'Hero',
    visibleKey: 'org_hero_visible',
    titleKey: 'org_hero_title',
    defaultTitle: 'Building sporting futures in rural India',
  },
  {
    id: 'about',
    label: 'About',
    visibleKey: 'about_visible',
    titleKey: 'about_title',
    defaultTitle: 'About Khelgram Foundation',
  },
  {
    id: 'impact',
    label: 'Impact',
    visibleKey: 'impact_visible',
    titleKey: 'impact_title',
    defaultTitle: 'Impact',
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
    id: 'testimonials',
    label: 'Testimonials',
    visibleKey: 'testimonials_visible',
    titleKey: 'testimonials_title',
    defaultTitle: 'Testimonials',
  },
  {
    id: 'contact',
    label: 'Contact',
    visibleKey: 'contact_visible',
    titleKey: 'contact_title',
    defaultTitle: 'Contact',
  },
  {
    id: 'footer',
    label: 'Footer',
    visibleKey: 'footer_visible',
  },
]

export { isSectionVisible, sectionTitle } from './homepageSections'
