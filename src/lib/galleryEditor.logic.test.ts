import { describe, expect, it } from 'vitest'
import { moveGalleryImage } from './galleryEditor.logic'

const images = [
  { id: '1', url: 'a', alt: 'A', sortOrder: 0 },
  { id: '2', url: 'b', alt: 'B', sortOrder: 1 },
]

describe('moveGalleryImage', () => {
  it('returns original list when move is out of bounds', () => {
    expect(moveGalleryImage(images, 0, -1)).toEqual(images)
    expect(moveGalleryImage(images, 1, 1)).toEqual(images)
  })

  it('reorders images and updates sort order', () => {
    expect(moveGalleryImage(images, 1, -1)).toEqual([
      { id: '2', url: 'b', alt: 'B', sortOrder: 0 },
      { id: '1', url: 'a', alt: 'A', sortOrder: 1 },
    ])
  })
})
