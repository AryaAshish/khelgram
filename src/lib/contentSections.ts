export type ContentFieldOption = {
  value: string
  label: string
}

export type ContentField = {
  key: string
  label: string
  section: string
  multiline?: boolean
  type?: 'text' | 'select'
  options?: ContentFieldOption[]
}

export type ContentSection = {
  id: string
  label: string
  saveLabel: string
  successMessage: string
  fields: ContentField[]
}

export const contentSections: ContentSection[] = [
  {
    id: 'hero',
    label: 'Hero',
    saveLabel: 'Save Hero',
    successMessage: 'Hero section saved',
    fields: [
      { key: 'hero_title', label: 'Hero title', section: 'hero' },
      { key: 'hero_subtitle', label: 'Hero subtitle', section: 'hero', multiline: true },
      { key: 'hero_primary_cta', label: 'Primary CTA', section: 'hero' },
      { key: 'hero_secondary_cta', label: 'Secondary CTA', section: 'hero' },
      { key: 'hero_event_date_label', label: 'Event date label', section: 'hero' },
      { key: 'hero_event_date', label: 'Event date text', section: 'hero' },
    ],
  },
  {
    id: 'countdown',
    label: 'Countdown',
    saveLabel: 'Save Countdown',
    successMessage: 'Countdown section saved',
    fields: [
      { key: 'countdown_title', label: 'Countdown heading', section: 'countdown' },
      { key: 'countdown_tba_text', label: 'To-be-announced text', section: 'countdown' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    saveLabel: 'Save About',
    successMessage: 'About section saved',
    fields: [
      { key: 'about_title', label: 'Section heading', section: 'about' },
      { key: 'about_mission', label: 'Mission', section: 'about', multiline: true },
      { key: 'about_vision', label: 'Vision', section: 'about', multiline: true },
      {
        key: 'about_values',
        label: 'Values (one per line)',
        section: 'about',
        multiline: true,
      },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    saveLabel: 'Save Events',
    successMessage: 'Events section saved',
    fields: [{ key: 'events_title', label: 'Section heading', section: 'events' }],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    saveLabel: 'Save Gallery',
    successMessage: 'Gallery section saved',
    fields: [{ key: 'gallery_title', label: 'Section heading', section: 'gallery' }],
  },
  {
    id: 'register',
    label: 'Register',
    saveLabel: 'Save Register',
    successMessage: 'Register section saved',
    fields: [
      { key: 'register_title', label: 'Section heading', section: 'register' },
      {
        key: 'register_pre_message',
        label: 'Pre-registration message',
        section: 'register',
        multiline: true,
      },
      { key: 'register_submit_label', label: 'Submit button label', section: 'register' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    saveLabel: 'Save Contact',
    successMessage: 'Contact section saved',
    fields: [
      { key: 'contact_title', label: 'Section heading', section: 'contact' },
      { key: 'contact_address', label: 'Address', section: 'contact', multiline: true },
      { key: 'contact_phone', label: 'Phone', section: 'contact' },
      { key: 'contact_email', label: 'Email', section: 'contact' },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    saveLabel: 'Save Footer',
    successMessage: 'Footer section saved',
    fields: [
      { key: 'footer_description', label: 'Description', section: 'footer', multiline: true },
      { key: 'footer_copyright', label: 'Copyright', section: 'footer' },
    ],
  },
  {
    id: 'site',
    label: 'Site',
    saveLabel: 'Save site settings',
    successMessage: 'Site settings saved',
    fields: [
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

export function parseAboutValues(raw: string): string[] {
  return raw
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
}
