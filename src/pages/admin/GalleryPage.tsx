import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePicker } from '@/components/admin/ImagePicker'
import { useSaveGallery } from '@/hooks/useAdminGallery'
import { useGallery } from '@/hooks/useGallery'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { moveGalleryImage } from '@/lib/galleryEditor.logic'
import type { GalleryImageDraft, MediaAsset } from '@/types/app.types'

function createDraftFromGallery(
  images: Array<{ id: string; url: string; alt: string; caption?: string }>,
): GalleryImageDraft[] {
  return images.map((image, index) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    caption: image.caption,
    sortOrder: index,
  }))
}

function createDraftFromAsset(asset: MediaAsset, sortOrder: number): GalleryImageDraft {
  const fileName = asset.path.split('/').pop() ?? 'Gallery image'
  return {
    id: crypto.randomUUID(),
    url: asset.url,
    alt: asset.alt || fileName,
    sortOrder,
  }
}

type GalleryEditorProps = {
  initialImages: GalleryImageDraft[]
  assets: MediaAsset[]
  assetsLoading: boolean
  isSaving: boolean
  onSave: (images: GalleryImageDraft[]) => Promise<void>
}

function GalleryEditor({
  initialImages,
  assets,
  assetsLoading,
  isSaving,
  onSave,
}: GalleryEditorProps) {
  const [draftImages, setDraftImages] = useState(initialImages)
  const [pickerOpen, setPickerOpen] = useState(false)

  const moveImage = (index: number, direction: -1 | 1) => {
    setDraftImages((previous) => moveGalleryImage(previous, index, direction))
  }

  const removeImage = (id: string) => {
    setDraftImages((previous) =>
      previous
        .filter((image) => image.id !== id)
        .map((image, sortOrder) => ({ ...image, sortOrder })),
    )
  }

  const addAsset = (asset: MediaAsset) => {
    setDraftImages((previous) => [...previous, createDraftFromAsset(asset, previous.length)])
    setPickerOpen(false)
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <Button variant="outline" onClick={() => setPickerOpen(true)}>
          Add from media library
        </Button>
        <Button onClick={() => void onSave(draftImages)} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save gallery'}
        </Button>
      </div>

      {draftImages.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No gallery images yet. Add one from the media library.</p>
      ) : null}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {draftImages.map((image, index) => (
          <article
            key={image.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              gap: '1rem',
              alignItems: 'start',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}
          >
            <img
              src={image.url}
              alt={image.alt}
              style={{
                width: '160px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
              }}
            />
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <Label htmlFor={`gallery-alt-${image.id}`}>Alt text</Label>
                <Input
                  id={`gallery-alt-${image.id}`}
                  value={image.alt}
                  onChange={(event) =>
                    setDraftImages((previous) =>
                      previous.map((entry) =>
                        entry.id === image.id ? { ...entry, alt: event.target.value } : entry,
                      ),
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor={`gallery-caption-${image.id}`}>Caption</Label>
                <Input
                  id={`gallery-caption-${image.id}`}
                  value={image.caption ?? ''}
                  onChange={(event) =>
                    setDraftImages((previous) =>
                      previous.map((entry) =>
                        entry.id === image.id
                          ? { ...entry, caption: event.target.value || undefined }
                          : entry,
                      ),
                    )
                  }
                />
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <Button variant="outline" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                Move up
              </Button>
              <Button
                variant="outline"
                onClick={() => moveImage(index, 1)}
                disabled={index === draftImages.length - 1}
              >
                Move down
              </Button>
              <Button variant="outline" onClick={() => removeImage(image.id)}>
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>

      {pickerOpen ? (
        <ImagePicker
          assets={assets}
          isLoading={assetsLoading}
          onSelect={addAsset}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </>
  )
}

export function GalleryPage() {
  const { images, isLoading, isSuccess } = useGallery()
  const { data: assets = [], isLoading: assetsLoading } = useMediaLibrary()
  const saveGallery = useSaveGallery()
  const editorKey = isSuccess ? images.map((image) => image.id).join('|') : 'loading'

  const handleSave = async (draftImages: GalleryImageDraft[]) => {
    await saveGallery.mutateAsync(draftImages)
  }

  return (
    <section aria-label="Gallery management">
      <h2 style={{ fontSize: '1.75rem', margin: '0 0 1.5rem' }}>Gallery</h2>

      {isLoading ? <p>Loading gallery...</p> : null}
      {!isLoading ? (
        <GalleryEditor
          key={editorKey}
          initialImages={createDraftFromGallery(images)}
          assets={assets}
          assetsLoading={assetsLoading}
          isSaving={saveGallery.isPending}
          onSave={handleSave}
        />
      ) : null}
    </section>
  )
}
