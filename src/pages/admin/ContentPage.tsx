import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ImagePicker } from '@/components/admin/ImagePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { useAllSettings, useUpdateSectionSettings } from '@/hooks/useSiteSettings'
import { contentGroups, type ContentGroup, type ContentSection } from '@/lib/contentSections'

function defaultFieldValue(
  field: ContentSection['fields'][number],
  settingsMap: Record<string, string>,
) {
  if (field.type === 'checkbox') {
    const stored = settingsMap[field.key]
    if (stored === undefined || stored === '') {
      return 'true'
    }
    return stored
  }

  return settingsMap[field.key] ?? ''
}

function buildSectionValues(
  section: ContentSection,
  settingsMap: Record<string, string>,
): Record<string, string> {
  return section.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = defaultFieldValue(field, settingsMap)
    return acc
  }, {})
}

function isCheckboxChecked(value: string | undefined) {
  return value === undefined || value === '' || value === 'true'
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
  const [imagePickerKey, setImagePickerKey] = useState<string | null>(null)
  const { data: assets = [], isLoading: assetsLoading } = useMediaLibrary()

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
          {field.type === 'checkbox' ? (
            <label
              htmlFor={field.key}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <input
                id={field.key}
                type="checkbox"
                checked={isCheckboxChecked(draftValues[field.key])}
                onChange={(event) =>
                  setDraftValues((previous) => ({
                    ...previous,
                    [field.key]: event.target.checked ? 'true' : 'false',
                  }))
                }
              />
              <span>{field.label}</span>
            </label>
          ) : field.type === 'image' ? (
            <>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={draftValues[field.key] ?? ''}
                onChange={(event) =>
                  setDraftValues((previous) => ({
                    ...previous,
                    [field.key]: event.target.value,
                  }))
                }
                placeholder="Image URL (or choose from media library)"
              />
              <div
                style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImagePickerKey(field.key)}
                >
                  Choose from library
                </Button>
                {draftValues[field.key] ? (
                  <img
                    src={draftValues[field.key]}
                    alt=""
                    style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: '0.375rem' }}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === 'select' ? (
                <select
                  id={field.key}
                  value={draftValues[field.key] ?? ''}
                  onChange={(event) =>
                    setDraftValues((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    marginTop: '0.25rem',
                  }}
                >
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.multiline ? (
                <textarea
                  id={field.key}
                  value={draftValues[field.key] ?? ''}
                  onChange={(event) =>
                    setDraftValues((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }))
                  }
                  rows={field.key.includes('values') ? 5 : 3}
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
            </>
          )}
        </div>
      ))}

      <Button onClick={() => void handleSave()} disabled={isPending}>
        {isPending ? 'Saving...' : section.saveLabel}
      </Button>

      {imagePickerKey ? (
        <ImagePicker
          assets={assets}
          isLoading={assetsLoading}
          onClose={() => setImagePickerKey(null)}
          onSelect={(asset) => {
            setDraftValues((previous) => ({
              ...previous,
              [imagePickerKey]: asset.url,
            }))
            setImagePickerKey(null)
          }}
        />
      ) : null}
    </div>
  )
}

export function ContentPage() {
  const { settingsMap, isSuccess } = useAllSettings()
  const updateSection = useUpdateSectionSettings()
  const [activeGroupId, setActiveGroupId] = useState<ContentGroup['id']>('organization')
  const activeGroup = contentGroups.find((group) => group.id === activeGroupId) ?? contentGroups[0]
  const [activeTab, setActiveTab] = useState(activeGroup?.sections[0]?.id ?? 'org_hero')

  const activeSection = useMemo(() => {
    const group = contentGroups.find((entry) => entry.id === activeGroupId) ?? contentGroups[0]
    return group?.sections.find((section) => section.id === activeTab) ?? group?.sections[0]
  }, [activeGroupId, activeTab])

  if (!activeSection || !activeGroup) {
    return null
  }

  const handleSave = async (payload: Array<{ key: string; value: string; section: string }>) => {
    await updateSection.mutateAsync(payload)
  }

  const handleGroupChange = (groupId: ContentGroup['id']) => {
    const group = contentGroups.find((entry) => entry.id === groupId)
    setActiveGroupId(groupId)
    setActiveTab(group?.sections[0]?.id ?? 'org_hero')
  }

  return (
    <section aria-label="Content management">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Content</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Edit organization copy and Khel 2026 event copy independently.
      </p>

      <div
        role="tablist"
        aria-label="Content groups"
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}
      >
        {contentGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={group.id === activeGroupId}
            onClick={() => handleGroupChange(group.id)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              background: group.id === activeGroupId ? '#dcfce7' : '#fff',
              fontWeight: group.id === activeGroupId ? 700 : 500,
              cursor: 'pointer',
            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div
        role="tablist"
        aria-label={`${activeGroup.label} content sections`}
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}
      >
        {activeGroup.sections.map((section) => (
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
        key={`${activeGroupId}-${activeTab}-${isSuccess ? 'ready' : 'loading'}`}
        section={activeSection}
        settingsMap={isSuccess ? settingsMap : {}}
        isPending={updateSection.isPending}
        onSave={handleSave}
      />
    </section>
  )
}
