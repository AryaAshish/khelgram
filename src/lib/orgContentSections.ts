import { orgHomeSections } from './orgHomeSections'
import type { ContentField, ContentSection } from './contentSections.shared'

const orgSectionsTabFields: ContentField[] = orgHomeSections.flatMap((section) => {
  const fields: ContentField[] = [
    {
      key: section.visibleKey,
      label: `Show ${section.label} section`,
      section: 'org_sections',
      type: 'checkbox',
    },
  ]

  if (section.titleKey && section.id !== 'hero') {
    fields.push({
      key: section.titleKey,
      label: `${section.label} heading`,
      section: 'org_sections',
    })
  }

  return fields
})

export const orgContentSections: ContentSection[] = [
  {
    id: 'org_hero',
    label: 'Hero',
    saveLabel: 'Save org hero',
    successMessage: 'Organization hero saved',
    fields: [
      { key: 'org_hero_title', label: 'Hero title', section: 'org' },
      { key: 'org_hero_subtitle', label: 'Hero subtitle', section: 'org', multiline: true },
      { key: 'org_hero_primary_cta', label: 'Primary CTA', section: 'org' },
      { key: 'org_hero_secondary_cta', label: 'Secondary CTA', section: 'org' },
    ],
  },
  {
    id: 'org_about',
    label: 'About',
    saveLabel: 'Save org about',
    successMessage: 'Organization about saved',
    fields: [
      { key: 'org_about_title', label: 'Section heading', section: 'org_about' },
      { key: 'org_about_mission', label: 'Mission', section: 'org_about', multiline: true },
      { key: 'org_about_vision', label: 'Vision', section: 'org_about', multiline: true },
      {
        key: 'org_about_values',
        label: 'Values (one per line)',
        section: 'org_about',
        multiline: true,
      },
    ],
  },
  {
    id: 'org_contact',
    label: 'Contact',
    saveLabel: 'Save contact',
    successMessage: 'Contact section saved',
    fields: [
      { key: 'contact_title', label: 'Section heading', section: 'contact' },
      { key: 'contact_address', label: 'Address', section: 'contact', multiline: true },
      { key: 'contact_phone', label: 'Phone', section: 'contact' },
      { key: 'contact_email', label: 'Email', section: 'contact' },
    ],
  },
  {
    id: 'org_footer',
    label: 'Footer',
    saveLabel: 'Save footer',
    successMessage: 'Footer saved',
    fields: [
      { key: 'footer_description', label: 'Description', section: 'footer', multiline: true },
      { key: 'footer_copyright', label: 'Copyright', section: 'footer' },
    ],
  },
  {
    id: 'org_sections',
    label: 'Sections',
    saveLabel: 'Save org section settings',
    successMessage: 'Organization section settings saved',
    fields: orgSectionsTabFields,
  },
]
