import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { GalleryImage } from '@/types/app.types'

export type GallerySectionProps = {
  title: string
  images: GalleryImage[]
}

export function GallerySection({ title, images }: GallerySectionProps) {
  return (
    <SectionShell id="gallery" variant="default" className="gallery-section">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div className="gallery-masonry">
          {images.map((image, index) => (
            <figure
              key={image.id}
              className={`gallery-masonry__item ${index % 3 === 0 ? 'gallery-masonry__item--tall' : ''}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                className="gallery-masonry__image"
              />
              {image.caption ? (
                <figcaption className="gallery-masonry__caption">{image.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
