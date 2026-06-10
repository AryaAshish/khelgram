import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAllSettings, useUpdateSectionSettings } from '@/hooks/useSiteSettings'
import { contentSections, type ContentSection } from '@/lib/contentSections'

function buildSectionValues(
  section: ContentSection,
  settingsMap: Record<string, string>,
): Record<string, string> {
  return section.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = settingsMap[field.key] ?? ''
    return acc
  }, {})
}

type ContentSectionEditorProps = {
  section: ContentSection
  settingsMap: Record<string, string>
  isPending: boolean
  onSave: (payload: Array<{ key: string; value: string; section: string }>) => Promise<void>
}

function ContentSectionEditor({
  section,
  settingsMap,
  isPending,
  onSave,
}: ContentSectionEditorProps) {
  const [draftValues, setDraftValues] = useState(() => buildSectionValues(section, settingsMap))

  const handleSave = async () => {
    const payload = section.fields.map((field) => ({
      key: field.key,
      value: draftValues[field.key] ?? '',
      section: field.section,
    }))

    await onSave(payload)
    toast.success(section.successMessage)
  }

  return (
    <div
      role="tabpanel"
      aria-label={`${section.label} content`}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: '720px' }}
    >
      {section.fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.multiline ? (
            <textarea
              id={field.key}
              value={draftValues[field.key] ?? ''}
              onChange={(event) =>
                setDraftValues((previous) => ({
                  ...previous,
                  [field.key]: event.target.value,
                }))
              }
              rows={field.key === 'about_values' ? 5 : 3}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                marginTop: '0.25rem',
              }}
            />
          ) : (
            <Input
              id={field.key}
              value={draftValues[field.key] ?? ''}
              onChange={(event) =>
                setDraftValues((previous) => ({
                  ...previous,
                  [field.key]: event.target.value,
                }))
              }
            />
          )}
        </div>
      ))}

      <Button onClick={() => void handleSave()} disabled={isPending}>
        {isPending ? 'Saving...' : section.saveLabel}
      </Button>
    </div>
  )
}

export function ContentPage() {
  const { settingsMap, isSuccess } = useAllSettings()
  const updateSection = useUpdateSectionSettings()
  const [activeTab, setActiveTab] = useState(contentSections[0]?.id ?? 'hero')

  const activeSection = useMemo(
    () => contentSections.find((section) => section.id === activeTab) ?? contentSections[0],
    [activeTab],
  )

  if (!activeSection) {
    return null
  }

  const handleSave = async (payload: Array<{ key: string; value: string; section: string }>) => {
    await updateSection.mutateAsync(payload)
  }

  return (
    <section aria-label="Content management">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Content</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Edit public site copy by section. Changes appear on the homepage after save.
      </p>

      <div
        role="tablist"
        aria-label="Content sections"
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}
      >
        {contentSections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={section.id === activeTab}
            onClick={() => setActiveTab(section.id)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: section.id === activeTab ? '#e5e7eb' : '#fff',
              fontWeight: section.id === activeTab ? 700 : 500,
              cursor: 'pointer',
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      <ContentSectionEditor
        key={`${activeTab}-${isSuccess ? 'ready' : 'loading'}`}
        section={activeSection}
        settingsMap={isSuccess ? settingsMap : {}}
        isPending={updateSection.isPending}
        onSave={handleSave}
      />
    </section>
  )
}
