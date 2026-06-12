import { khel2026ContentSections } from './khel2026ContentSections'
import { orgContentSections } from './orgContentSections'
import type { ContentGroup, ContentSection } from './contentSections.shared'

export type {
  ContentField,
  ContentFieldOption,
  ContentGroup,
  ContentSection,
} from './contentSections.shared'
export { parseAboutValues } from './contentSections.shared'

const sharedContentSections: ContentSection[] = [
  {
    id: 'site',
    label: 'Site',
    saveLabel: 'Save site settings',
    successMessage: 'Site settings saved',
    fields: [
      { key: 'site_name', label: 'Site name (header)', section: 'header' },
      {
        key: 'event_status',
        label: 'Event status',
        section: 'site',
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'pre_registration', label: 'Pre-registration' },
          { value: 'registration_open', label: 'Registration open' },
          { value: 'registration_closed', label: 'Registration closed' },
          { value: 'completed', label: 'Completed' },
        ],
      },
      { key: 'event_date', label: 'Event date (ISO)', section: 'site' },
      { key: 'admin_email', label: 'Admin alert email', section: 'site' },
    ],
  },
]

export const contentGroups: ContentGroup[] = [
  {
    id: 'organization',
    label: 'Organization',
    sections: orgContentSections,
  },
  {
    id: 'khel2026',
    label: 'Khel 2026',
    sections: khel2026ContentSections,
  },
  {
    id: 'shared',
    label: 'Shared',
    sections: sharedContentSections,
  },
]

/** Flat list of all CMS sections (used in tests and legacy lookups). */
export const contentSections: ContentSection[] = contentGroups.flatMap((group) => group.sections)
