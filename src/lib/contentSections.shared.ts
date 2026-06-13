export type ContentFieldOption = {
  value: string
  label: string
}

export type ContentField = {
  key: string
  label: string
  section: string
  multiline?: boolean
  type?: 'text' | 'select' | 'checkbox' | 'image'
  options?: ContentFieldOption[]
}

export type ContentSection = {
  id: string
  label: string
  saveLabel: string
  successMessage: string
  fields: ContentField[]
}

export type ContentGroup = {
  id: 'organization' | 'khel2026' | 'shared'
  label: string
  sections: ContentSection[]
}

export function parseAboutValues(raw: string): string[] {
  return raw
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
}
