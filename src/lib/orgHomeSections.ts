export type OrgHomeSectionId =
  | 'hero'
  | 'about'
  | 'programs'
  | 'impact'
  | 'team'
  | 'contributors'
  | 'sponsors'
  | 'testimonials'
  | 'get_involved'
  | 'success_stories'
  | 'support'
  | 'reach'
  | 'contact'
  | 'footer'

export type OrgHomeSectionConfig = {
  id: OrgHomeSectionId
  label: string
  visibleKey: string
  titleKey?: string
  defaultTitle?: string
  /** When set, the section heading is edited on another Content tab. */
  titleContentTabId?: string
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
    titleKey: 'org_about_title',
    defaultTitle: 'About Khelgram Foundation',
  },
  {
    id: 'programs',
    label: 'Programs',
    visibleKey: 'programs_visible',
    titleKey: 'programs_title',
    defaultTitle: 'Our Programs',
  },
  {
    id: 'get_involved',
    label: 'Get Involved',
    visibleKey: 'get_involved_visible',
    titleKey: 'org_get_involved_title',
    defaultTitle: 'Get Involved',
    titleContentTabId: 'org_get_involved',
  },
  {
    id: 'impact',
    label: 'Impact',
    visibleKey: 'impact_visible',
    titleKey: 'org_impact_title',
    defaultTitle: 'Impact',
  },
  {
    id: 'success_stories',
    label: 'Success Stories',
    visibleKey: 'success_stories_visible',
    titleKey: 'success_stories_title',
    defaultTitle: 'Success Stories',
  },
  {
    id: 'support',
    label: 'Support',
    visibleKey: 'support_visible',
    titleKey: 'support_title',
    defaultTitle: 'Support Our Mission',
    titleContentTabId: 'org_support',
  },
  {
    id: 'reach',
    label: 'Reach',
    visibleKey: 'reach_visible',
    titleKey: 'reach_title',
    defaultTitle: 'Where We Work',
    titleContentTabId: 'org_reach',
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
