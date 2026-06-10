import type { GalleryImage } from '@/types/app.types'

export type GallerySectionProps = {
  images: GalleryImage[]
}

export function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className="gallery-section" id="gallery" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Gallery</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {images.map((image) => (
            <figure key={image.id} style={{ margin: 0 }}>
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
