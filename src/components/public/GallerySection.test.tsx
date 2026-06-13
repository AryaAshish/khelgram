import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(document.getElementById('gallery')).toHaveAttribute('data-variant', 'default')
  })

  it('renders caption overlay when provided', () => {
    render(
      <GallerySection
        title="Gallery"
        images={[
          {
            id: 'image-1',
            url: 'https://example.com/test.jpg',
            alt: 'Sample',
            caption: 'Festival day',
          },
        ]}
      />,
    )

    expect(screen.getByText('Festival day')).toBeInTheDocument()
  })

  it('opens and closes lightbox on image click', async () => {
    const user = userEvent.setup()

    render(
      <GallerySection
        title="Gallery"
        images={[
          {
            id: 'image-1',
            url: 'https://example.com/test.jpg',
            alt: 'Sample',
            caption: 'Festival day',
          },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open image: Sample' }))
    expect(screen.getByRole('dialog', { name: 'Sample' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes lightbox on Escape key', async () => {
    const user = userEvent.setup()

    render(
      <GallerySection
        title="Gallery"
        images={[{ id: 'image-1', url: 'https://example.com/test.jpg', alt: 'Sample' }]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open image: Sample' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
