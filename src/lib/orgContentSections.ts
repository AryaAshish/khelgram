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
    id: 'org_impact',
    label: 'Impact',
    saveLabel: 'Save org impact copy',
    successMessage: 'Organization impact copy saved',
    fields: [
      {
        key: 'org_impact_subtitle',
        label: 'Section subtitle',
        section: 'org_impact',
        multiline: true,
      },
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
    id: 'org_get_involved',
    label: 'Get Involved',
    saveLabel: 'Save get involved content',
    successMessage: 'Get involved content saved',
    fields: [
      { key: 'org_get_involved_title', label: 'Section heading', section: 'org_get_involved' },
      {
        key: 'org_get_involved_parents_title',
        label: 'Parents card title',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_parents_description',
        label: 'Parents card description',
        section: 'org_get_involved',
        multiline: true,
      },
      {
        key: 'org_get_involved_parents_cta_label',
        label: 'Parents button label',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_parents_cta_url',
        label: 'Parents button URL',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_schools_title',
        label: 'Schools card title',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_schools_description',
        label: 'Schools card description',
        section: 'org_get_involved',
        multiline: true,
      },
      {
        key: 'org_get_involved_schools_cta_label',
        label: 'Schools button label',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_schools_cta_url',
        label: 'Schools button URL',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_partners_title',
        label: 'Partners card title',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_partners_description',
        label: 'Partners card description',
        section: 'org_get_involved',
        multiline: true,
      },
      {
        key: 'org_get_involved_partners_cta_label',
        label: 'Partners button label',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_partners_cta_url',
        label: 'Partners button URL',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_volunteers_title',
        label: 'Volunteers card title',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_volunteers_description',
        label: 'Volunteers card description',
        section: 'org_get_involved',
        multiline: true,
      },
      {
        key: 'org_get_involved_volunteers_cta_label',
        label: 'Volunteers button label',
        section: 'org_get_involved',
      },
      {
        key: 'org_get_involved_volunteers_cta_url',
        label: 'Volunteers button URL',
        section: 'org_get_involved',
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
