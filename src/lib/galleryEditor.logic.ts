import type { GalleryImageDraft } from '@/types/app.types'
import { moveListItem } from '@/lib/sortableList.logic'

export function moveGalleryImage(
  images: GalleryImageDraft[],
  index: number,
  direction: -1 | 1,
): GalleryImageDraft[] {
  return moveListItem(images, index, direction).map((image, sortOrder) => ({
    ...image,
    sortOrder,
  }))
}
