import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { moveListItem } from '@/lib/sortableList.logic'
import {
  useAddSuccessStory,
  useAdminSuccessStories,
  useDeleteSuccessStory,
  useReorderSuccessStories,
  useUpdateSuccessStory,
} from '@/hooks/useSuccessStories'
import type { SuccessStory } from '@/types/app.types'

const emptyForm = {
  title: '',
  summary: '',
  story: '',
  imageUrl: '',
  published: false,
}

export function StoriesPage() {
  const { data: stories = [], isLoading } = useAdminSuccessStories()
  const addStory = useAddSuccessStory()
  const updateStory = useUpdateSuccessStory()
  const deleteStory = useDeleteSuccessStory()
  const reorderStories = useReorderSuccessStories()
  const [form, setForm] = useState(emptyForm)

  const isPending =
    addStory.isPending || updateStory.isPending || deleteStory.isPending || reorderStories.isPending

  const handleAdd = async () => {
    await addStory.mutateAsync({
      title: form.title,
      summary: form.summary,
      story: form.story,
      imageUrl: form.imageUrl || undefined,
      published: form.published,
    })
    setForm(emptyForm)
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const reordered = moveListItem(stories, index, direction)
    await reorderStories.mutateAsync(reordered.map((story) => story.id))
  }

  const handlePublishToggle = async (story: SuccessStory) => {
    await updateStory.mutateAsync({
      id: story.id,
      published: !story.published,
    })
  }

  return (
    <section aria-label="Success stories">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Success Stories</h2>

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          maxWidth: '720px',
        }}
      >
        <div>
          <Label htmlFor="story-title">Title</Label>
          <Input
            id="story-title"
            value={form.title}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, title: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="story-summary">Summary</Label>
          <Input
            id="story-summary"
            value={form.summary}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, summary: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="story-body">Story</Label>
          <textarea
            id="story-body"
            value={form.story}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, story: event.target.value }))
            }
            rows={4}
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
          <Label htmlFor="story-image-url">Image URL</Label>
          <Input
            id="story-image-url"
            value={form.imageUrl}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, imageUrl: event.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="story-published">Published</Label>
          <input
            id="story-published"
            type="checkbox"
            checked={form.published}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, published: event.target.checked }))
            }
            style={{ marginTop: '0.5rem' }}
          />
        </div>
        <Button onClick={() => void handleAdd()} disabled={isPending}>
          {isPending ? 'Saving...' : 'Add story'}
        </Button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && stories.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No stories yet.</p>
      ) : null}

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '720px' }}>
        {stories.map((story, index) => (
          <article
            key={story.id}
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
                {story.title}
                {story.published ? '' : ' (draft)'}
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
                  checked={story.published}
                  aria-label={`Published ${story.title}`}
                  onChange={() => void handlePublishToggle(story)}
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
                disabled={index === stories.length - 1 || isPending}
              >
                Down
              </Button>
              <Button
                variant="outline"
                onClick={() => void deleteStory.mutateAsync(story.id)}
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
