import { khel2026Sections } from './khel2026Sections'
import type { ContentField, ContentSection } from './contentSections.shared'

const khel2026SectionsTabFields: ContentField[] = khel2026Sections.flatMap((section) => {
  const fields: ContentField[] = [
    {
      key: section.visibleKey,
      label: `Show ${section.label} section`,
      section: 'khel2026_sections',
      type: 'checkbox',
    },
  ]

  if (section.titleKey && section.id !== 'hero') {
    fields.push({
      key: section.titleKey,
      label: `${section.label} heading`,
      section: 'khel2026_sections',
    })
  }

  return fields
})

export const khel2026ContentSections: ContentSection[] = [
  {
    id: 'khel2026_hero',
    label: 'Hero',
    saveLabel: 'Save event hero',
    successMessage: 'Khel 2026 hero saved',
    fields: [
      { key: 'khel2026_hero_title', label: 'Hero title', section: 'khel2026' },
      {
        key: 'khel2026_hero_subtitle',
        label: 'Hero subtitle',
        section: 'khel2026',
        multiline: true,
      },
      { key: 'khel2026_hero_primary_cta', label: 'Primary CTA', section: 'khel2026' },
      { key: 'khel2026_hero_secondary_cta', label: 'Secondary CTA', section: 'khel2026' },
      { key: 'khel2026_hero_event_date_label', label: 'Event date label', section: 'khel2026' },
      { key: 'khel2026_hero_event_date', label: 'Event date text', section: 'khel2026' },
      {
        key: 'khel2026_hero_image',
        label: 'Hero image',
        section: 'khel2026',
        type: 'image',
      },
    ],
  },
  {
    id: 'khel2026_countdown',
    label: 'Countdown',
    saveLabel: 'Save countdown',
    successMessage: 'Khel 2026 countdown saved',
    fields: [
      {
        key: 'khel2026_countdown_title',
        label: 'Countdown heading',
        section: 'khel2026_countdown',
      },
      {
        key: 'khel2026_countdown_tba_text',
        label: 'To-be-announced text',
        section: 'khel2026_countdown',
      },
    ],
  },
  {
    id: 'khel2026_events',
    label: 'Events',
    saveLabel: 'Save events',
    successMessage: 'Khel 2026 events saved',
    fields: [
      { key: 'khel2026_events_title', label: 'Section heading', section: 'khel2026_events' },
    ],
  },
  {
    id: 'khel2026_gallery',
    label: 'Gallery',
    saveLabel: 'Save gallery',
    successMessage: 'Khel 2026 gallery saved',
    fields: [
      { key: 'khel2026_gallery_title', label: 'Section heading', section: 'khel2026_gallery' },
    ],
  },
  {
    id: 'khel2026_register',
    label: 'Register',
    saveLabel: 'Save register CTA',
    successMessage: 'Khel 2026 register CTA saved',
    fields: [
      { key: 'khel2026_register_title', label: 'Section heading', section: 'khel2026_register' },
      {
        key: 'khel2026_register_pre_message',
        label: 'Pre-registration message',
        section: 'khel2026_register',
        multiline: true,
      },
      {
        key: 'khel2026_register_submit_label',
        label: 'Submit button label',
        section: 'khel2026_register',
      },
    ],
  },
  {
    id: 'khel2026_faq',
    label: 'FAQ',
    saveLabel: 'Save FAQ',
    successMessage: 'Khel 2026 FAQ saved',
    fields: [{ key: 'khel2026_faq_title', label: 'Section heading', section: 'khel2026_faq' }],
  },
  {
    id: 'khel2026_sections',
    label: 'Sections',
    saveLabel: 'Save Khel 2026 section settings',
    successMessage: 'Khel 2026 section settings saved',
    fields: khel2026SectionsTabFields,
  },
]
