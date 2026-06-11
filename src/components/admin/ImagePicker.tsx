import type { MediaAsset } from '@/types/app.types'
import { Button } from '@/components/ui/button'

export type ImagePickerProps = {
  assets: MediaAsset[]
  isLoading?: boolean
  onSelect: (asset: MediaAsset) => void
  onClose: () => void
}

function getDisplayName(asset: MediaAsset): string {
  const fileName = asset.path.split('/').pop()
  return fileName || asset.alt || asset.path
}

export function ImagePicker({ assets, isLoading, onSelect, onClose }: ImagePickerProps) {
  return (
    <div
      role="dialog"
      aria-label="Media library"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17, 24, 39, 0.55)',
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(960px, 100%)',
          maxHeight: '80vh',
          overflow: 'auto',
          background: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Media library</h3>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {isLoading ? <p>Loading media...</p> : null}
        {!isLoading && assets.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Upload images on the Media page first.</p>
        ) : null}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelect(asset)}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <img
                src={asset.url}
                alt={asset.alt}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                }}
              />
              <span style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {getDisplayName(asset)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
