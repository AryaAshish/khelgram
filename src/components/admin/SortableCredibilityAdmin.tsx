import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { moveListItem } from '@/lib/sortableList.logic'

export type CredibilityField = {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'checkbox' | 'select'
  options?: Array<{ value: string; label: string }>
}

export type SortableCredibilityAdminProps<TItem extends { id: string }> = {
  title: string
  items: TItem[]
  fields: CredibilityField[]
  addLabel: string
  isLoading: boolean
  isPending: boolean
  getItemSummary: (item: TItem) => string
  onAdd: (values: Record<string, string | boolean>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReorder: (ids: string[]) => Promise<void>
}

function createInitialForm(fields: CredibilityField[]): Record<string, string | boolean> {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.key] = field.type === 'checkbox' ? false : ''
    return acc
  }, {})
}

export function SortableCredibilityAdmin<TItem extends { id: string }>({
  title,
  items,
  fields,
  addLabel,
  isLoading,
  isPending,
  getItemSummary,
  onAdd,
  onDelete,
  onReorder,
}: SortableCredibilityAdminProps<TItem>) {
  const [formValues, setFormValues] = useState(() => createInitialForm(fields))

  const handleAdd = async () => {
    await onAdd(formValues)
    setFormValues(createInitialForm(fields))
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const reordered = moveListItem(items, index, direction)
    await onReorder(reordered.map((item) => item.id))
  }

  return (
    <section aria-label={title}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{title}</h2>

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          maxWidth: '720px',
        }}
      >
        {fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={`${title}-${field.key}`}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <textarea
                id={`${title}-${field.key}`}
                value={String(formValues[field.key] ?? '')}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, [field.key]: event.target.value }))
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  marginTop: '0.25rem',
                }}
              />
            ) : field.type === 'checkbox' ? (
              <input
                id={`${title}-${field.key}`}
                type="checkbox"
                checked={Boolean(formValues[field.key])}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    [field.key]: event.target.checked,
                  }))
                }
                style={{ marginTop: '0.5rem' }}
              />
            ) : field.type === 'select' ? (
              <select
                id={`${title}-${field.key}`}
                value={String(formValues[field.key] ?? '')}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, [field.key]: event.target.value }))
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
            ) : (
              <Input
                id={`${title}-${field.key}`}
                value={String(formValues[field.key] ?? '')}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, [field.key]: event.target.value }))
                }
              />
            )}
          </div>
        ))}
        <Button onClick={() => void handleAdd()} disabled={isPending}>
          {isPending ? 'Saving...' : addLabel}
        </Button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && items.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No entries yet.</p>
      ) : null}

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '720px' }}>
        {items.map((item, index) => (
          <article
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              alignItems: 'center',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}
          >
            <p style={{ margin: 0 }}>{getItemSummary(item)}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                onClick={() => void handleMove(index, -1)}
                disabled={index === 0 || isPending}
              >
                Up
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleMove(index, 1)}
                disabled={index === items.length - 1 || isPending}
              >
                Down
              </Button>
              <Button variant="outline" onClick={() => void onDelete(item.id)} disabled={isPending}>
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
