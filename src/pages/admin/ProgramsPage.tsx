import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { moveListItem } from '@/lib/sortableList.logic'
import { programPillarOptions } from '@/lib/programPillars'
import {
  useAddProgram,
  useAdminPrograms,
  useDeleteProgram,
  useReorderPrograms,
  useUpdateProgram,
} from '@/hooks/usePrograms'
import type { Program, ProgramPillar } from '@/types/app.types'

const emptyForm = {
  title: '',
  description: '',
  pillar: 'grassroots_discovery' as ProgramPillar,
  icon: '',
  published: false,
  ctaLabel: '',
  ctaUrl: '',
}

export function ProgramsPage() {
  const { data: programs = [], isLoading } = useAdminPrograms()
  const addProgram = useAddProgram()
  const updateProgram = useUpdateProgram()
  const deleteProgram = useDeleteProgram()
  const reorderPrograms = useReorderPrograms()
  const [form, setForm] = useState(emptyForm)

  const isPending =
    addProgram.isPending ||
    updateProgram.isPending ||
    deleteProgram.isPending ||
    reorderPrograms.isPending

  const handleAdd = async () => {
    await addProgram.mutateAsync({
      title: form.title,
      description: form.description,
      pillar: form.pillar,
      icon: form.icon || undefined,
      published: form.published,
      ctaLabel: form.ctaLabel || undefined,
      ctaUrl: form.ctaUrl || undefined,
    })
    setForm(emptyForm)
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const reordered = moveListItem(programs, index, direction)
    await reorderPrograms.mutateAsync(reordered.map((program) => program.id))
  }

  const handlePublishToggle = async (program: Program) => {
    await updateProgram.mutateAsync({
      id: program.id,
      published: !program.published,
    })
  }

  return (
    <section aria-label="Programs">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Programs</h2>

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          maxWidth: '720px',
        }}
      >
        <div>
          <Label htmlFor="programs-title">Title</Label>
          <Input
            id="programs-title"
            value={form.title}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, title: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="programs-description">Description</Label>
          <textarea
            id="programs-description"
            value={form.description}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, description: event.target.value }))
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
        </div>
        <div>
          <Label htmlFor="programs-pillar">Pillar</Label>
          <select
            id="programs-pillar"
            value={form.pillar}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                pillar: event.target.value as ProgramPillar,
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
            {programPillarOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="programs-icon">Icon</Label>
          <Input
            id="programs-icon"
            value={form.icon}
            onChange={(event) => setForm((previous) => ({ ...previous, icon: event.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="programs-cta-label">CTA label</Label>
          <Input
            id="programs-cta-label"
            value={form.ctaLabel}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, ctaLabel: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="programs-cta-url">CTA URL</Label>
          <Input
            id="programs-cta-url"
            value={form.ctaUrl}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, ctaUrl: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="programs-published">Published</Label>
          <input
            id="programs-published"
            type="checkbox"
            checked={form.published}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, published: event.target.checked }))
            }
            style={{ marginTop: '0.5rem' }}
          />
        </div>
        <Button onClick={() => void handleAdd()} disabled={isPending}>
          {isPending ? 'Saving...' : 'Add program'}
        </Button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && programs.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No programs yet.</p>
      ) : null}

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '720px' }}>
        {programs.map((program, index) => (
          <article
            key={program.id}
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
            <div>
              <p style={{ margin: 0 }}>
                {program.title}
                {program.published ? '' : ' (draft)'}
              </p>
              <label
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={program.published}
                  aria-label={`Published ${program.title}`}
                  onChange={() => void handlePublishToggle(program)}
                  disabled={isPending}
                />
                Published
              </label>
            </div>
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
                disabled={index === programs.length - 1 || isPending}
              >
                Down
              </Button>
              <Button
                variant="outline"
                onClick={() => void deleteProgram.mutateAsync(program.id)}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
