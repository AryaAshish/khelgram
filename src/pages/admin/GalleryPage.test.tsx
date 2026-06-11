import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GalleryPage } from './GalleryPage'

const mockSave = vi.fn()
const mockUseGallery = vi.fn()
const mockUseMediaLibrary = vi.fn()

vi.mock('@/hooks/useGallery', () => ({
  useGallery: () => mockUseGallery(),
}))

vi.mock('@/hooks/useMediaLibrary', () => ({
  useMediaLibrary: () => mockUseMediaLibrary(),
}))

vi.mock('@/hooks/useAdminGallery', () => ({
  useSaveGallery: () => ({
    mutateAsync: mockSave,
    isPending: false,
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('GalleryPage', () => {
  beforeEach(() => {
    mockUseGallery.mockReturnValue({
      images: [],
      isLoading: false,
      isSuccess: true,
    })
    mockUseMediaLibrary.mockReturnValue({
      data: [
        {
          id: 'media-1',
          path: 'sample-upload.png',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          size: 1024,
          createdAt: '2026-04-01T10:00:00.000Z',
        },
      ],
      isLoading: false,
    })
    mockSave.mockResolvedValue([])
    vi.stubGlobal('crypto', {
      randomUUID: () => 'gallery-new-1',
    })
  })

  it('shows loading state before gallery editor mounts', () => {
    mockUseGallery.mockReturnValue({
      images: [],
      isLoading: true,
      isSuccess: false,
    })

    render(<GalleryPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Loading gallery...')).toBeInTheDocument()
  })

  it('renders existing gallery images and supports reordering', async () => {
    const user = userEvent.setup()
    mockUseGallery.mockReturnValue({
      images: [
        {
          id: 'gallery-1',
          url: 'https://example.com/1.jpg',
          alt: 'First',
        },
        {
          id: 'gallery-2',
          url: 'https://example.com/2.jpg',
          alt: 'Second',
        },
      ],
      isLoading: false,
      isSuccess: true,
    })

    render(<GalleryPage />, { wrapper: createWrapper() })

    expect(screen.getAllByRole('button', { name: 'Move up' })[0]).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Move down' })[1]).toBeDisabled()
    await user.click(screen.getAllByRole('button', { name: 'Move up' })[1]!)
    await user.click(screen.getAllByRole('button', { name: 'Move down' })[0]!)
    const altInputs = screen.getAllByLabelText('Alt text')
    await user.clear(altInputs[0]!)
    await user.type(altInputs[0]!, 'Updated alt')
    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]!)

    expect(screen.getAllByLabelText('Alt text')).toHaveLength(1)
  })

  it('edits caption and closes media picker', async () => {
    const user = userEvent.setup()
    mockUseGallery.mockReturnValue({
      images: [
        {
          id: 'gallery-1',
          url: 'https://example.com/1.jpg',
          alt: 'First',
          caption: 'Old caption',
        },
      ],
      isLoading: false,
      isSuccess: true,
    })

    render(<GalleryPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: 'Add from media library' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    const captionInput = screen.getByLabelText('Caption')
    await user.clear(captionInput)
    await user.type(captionInput, 'New caption')
    await user.clear(captionInput)

    expect(captionInput).toHaveValue('')
  })

  it('uses filename when selected media asset has no alt text', async () => {
    const user = userEvent.setup()
    mockUseMediaLibrary.mockReturnValue({
      data: [
        {
          id: 'media-2',
          path: 'sample-upload.png',
          url: 'https://example.com/media/sample-upload.png',
          alt: '',
          size: 1024,
          createdAt: '2026-04-01T10:00:00.000Z',
        },
      ],
      isLoading: false,
    })

    render(<GalleryPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: 'Add from media library' }))
    await user.click(screen.getByText('sample-upload.png'))

    expect(screen.getByDisplayValue('sample-upload.png')).toBeInTheDocument()
  })

  it('adds media asset and saves gallery', async () => {
    const user = userEvent.setup()

    render(<GalleryPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: 'Add from media library' }))
    await user.click(screen.getByText('sample-upload.png'))
    await user.click(screen.getByRole('button', { name: 'Save gallery' }))

    expect(mockSave).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'gallery-new-1',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
      }),
    ])
  })
})
