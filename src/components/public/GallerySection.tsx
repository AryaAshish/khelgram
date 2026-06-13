import { useEffect, useRef, useState } from 'react'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { GalleryImage } from '@/types/app.types'

export type GallerySectionProps = {
  title: string
  images: GalleryImage[]
}

export function GallerySection({ title, images }: GallerySectionProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!activeImage) {
      return
    }

    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeImage])

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
              <button
                type="button"
                className="gallery-masonry__button"
                onClick={() => setActiveImage(image)}
                aria-label={`Open image: ${image.alt}`}
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
              </button>
            </figure>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="gallery-lightbox__close"
            onClick={() => setActiveImage(null)}
          >
            Close
          </button>
          <img src={activeImage.url} alt={activeImage.alt} className="gallery-lightbox__image" />
          {activeImage.caption ? (
            <p className="gallery-lightbox__caption">{activeImage.caption}</p>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  )
}
