import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ImagePicker } from './ImagePicker'

const assets = [
  {
    id: 'media-1',
    path: 'sample-upload.png',
    url: 'https://example.com/media/sample-upload.png',
    alt: 'sample-upload.png',
    size: 1024,
    createdAt: '2026-04-01T10:00:00.000Z',
  },
]

describe('ImagePicker', () => {
  it('renders assets and handles selection', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClose = vi.fn()

    render(<ImagePicker assets={assets} onSelect={onSelect} onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: 'Media library' })).toBeInTheDocument()
    await user.click(screen.getByText('sample-upload.png'))

    expect(onSelect).toHaveBeenCalledWith(assets[0])
  })

  it('falls back to alt text when filename segment is empty', () => {
    render(
      <ImagePicker
        assets={[
          {
            ...assets[0]!,
            path: 'uploads/',
            alt: 'Named asset',
          },
        ]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Named asset')).toBeInTheDocument()
  })

  it('falls back to alt text when path has no filename segment', () => {
    render(
      <ImagePicker
        assets={[
          {
            ...assets[0]!,
            path: 'flat-name',
            alt: 'Flat asset',
          },
        ]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('flat-name')).toBeInTheDocument()
  })

  it('shows loading and empty states', () => {
    const { rerender } = render(
      <ImagePicker assets={[]} isLoading onSelect={vi.fn()} onClose={vi.fn()} />,
    )
    expect(screen.getByText('Loading media...')).toBeInTheDocument()

    rerender(<ImagePicker assets={[]} onSelect={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Upload images on the Media page first.')).toBeInTheDocument()
  })

  it('closes from close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<ImagePicker assets={assets} onSelect={vi.fn()} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<ImagePicker assets={assets} onSelect={vi.fn()} onClose={onClose} />)

    await user.click(screen.getByRole('dialog', { name: 'Media library' }))
    expect(onClose).toHaveBeenCalled()
  })
})
