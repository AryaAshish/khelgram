import type { GalleryImageDraft } from '@/types/app.types'

export function moveGalleryImage(
  images: GalleryImageDraft[],
  index: number,
  direction: -1 | 1,
): GalleryImageDraft[] {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= images.length) {
    return images
  }

  const next = [...images]
  const [moved] = next.splice(index, 1)
  if (!moved) {
    return images
  }

  next.splice(targetIndex, 0, moved)
  return next.map((image, sortOrder) => ({ ...image, sortOrder }))
}
