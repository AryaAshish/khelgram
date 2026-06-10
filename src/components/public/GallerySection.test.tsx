import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GallerySection } from './GallerySection'

describe('GallerySection', () => {
  it('renders image items', () => {
    render(
      <GallerySection
        title="Gallery"
        images={[{ id: 'image-1', url: 'https://example.com/test.jpg', alt: 'Sample' }]}
      />,
    )

    expect(screen.getByAltText('Sample')).toBeInTheDocument()
  })
})
