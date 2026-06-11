import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDeleteMedia, useMediaLibrary, useUploadMedia } from '@/hooks/useMediaLibrary'

function getDisplayName(path: string): string {
  const fileName = path.split('/').pop()
  return fileName ?? path
}

export function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingDeletePath, setPendingDeletePath] = useState<string | null>(null)
  const { data: assets = [], isLoading } = useMediaLibrary()
  const uploadMedia = useUploadMedia()
  const deleteMedia = useDeleteMedia()

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    for (const file of Array.from(files)) {
      await uploadMedia.mutateAsync(file)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDeletePath) {
      return
    }

    await deleteMedia.mutateAsync(pendingDeletePath)
    setPendingDeletePath(null)
  }

  return (
    <section aria-label="Media library">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Media</h2>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMedia.isPending}>
          {uploadMedia.isPending ? 'Uploading...' : 'Upload images'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          void handleFiles(event.dataTransfer.files)
        }}
        style={{
          border: '2px dashed #d1d5db',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          color: '#6b7280',
          textAlign: 'center',
        }}
      >
        Drag and drop images here, or use Upload images.
      </div>

      {isLoading ? <p>Loading media...</p> : null}
      {!isLoading && assets.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No uploads yet.</p>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {assets.map((asset) => (
          <article
            key={asset.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
          >
            <img
              src={asset.url}
              alt={asset.alt}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ padding: '0.75rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {getDisplayName(asset.path)}
              </p>
              <Button
                variant="outline"
                onClick={() => setPendingDeletePath(asset.path)}
                disabled={deleteMedia.isPending}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      {pendingDeletePath ? (
        <div
          role="dialog"
          aria-label="Confirm delete"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.55)',
            display: 'grid',
            placeItems: 'center',
            padding: '1.5rem',
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <p style={{ marginTop: 0 }}>Delete this image from the media library?</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setPendingDeletePath(null)}>
                Cancel
              </Button>
              <Button onClick={() => void confirmDelete()} disabled={deleteMedia.isPending}>
                {deleteMedia.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
