import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MediaPage } from './MediaPage'

const mockUpload = vi.fn()
const mockDelete = vi.fn()
const mockUseMediaLibrary = vi.fn()
const mockUploadState = { isPending: false }
const mockDeleteState = { isPending: false }

vi.mock('@/hooks/useMediaLibrary', () => ({
  useMediaLibrary: () => mockUseMediaLibrary(),
  useUploadMedia: () => ({
    mutateAsync: mockUpload,
    isPending: mockUploadState.isPending,
  }),
  useDeleteMedia: () => ({
    mutateAsync: mockDelete,
    isPending: mockDeleteState.isPending,
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('MediaPage', () => {
  beforeEach(() => {
    mockUploadState.isPending = false
    mockDeleteState.isPending = false
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
  })

  it('renders uploaded assets in grid', () => {
    render(<MediaPage />, { wrapper: createWrapper() })
    expect(screen.getByText('sample-upload.png')).toBeInTheDocument()
  })

  it('shows uploading label while upload is pending', () => {
    mockUploadState.isPending = true
    render(<MediaPage />, { wrapper: createWrapper() })
    expect(screen.getByRole('button', { name: 'Uploading...' })).toBeDisabled()
  })

  it('opens file picker from upload button', async () => {
    const user = userEvent.setup()
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    render(<MediaPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: 'Upload images' }))
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  it('shows loading state while assets fetch', () => {
    mockUseMediaLibrary.mockReturnValue({ data: [], isLoading: true })
    render(<MediaPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Loading media...')).toBeInTheDocument()
  })

  it('ignores drag-over and empty file selection', () => {
    const { container } = render(<MediaPage />, { wrapper: createWrapper() })
    const dropZone = screen.getByText(/Drag and drop images here/)
    const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })
    dropZone.dispatchEvent(dragOverEvent)
    expect(dragOverEvent.defaultPrevented).toBe(true)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    input.dispatchEvent(new Event('change', { bubbles: true }))
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('uploads files from hidden input and drag-drop', async () => {
    const user = userEvent.setup()
    mockUpload.mockResolvedValue({})
    const { container } = render(<MediaPage />, { wrapper: createWrapper() })

    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, file)

    const dropZone = screen.getByText(/Drag and drop images here/)
    const dataTransfer = {
      files: [file],
    }
    const dropEvent = new Event('drop', { bubbles: true })
    Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer })
    dropZone.dispatchEvent(dropEvent)

    expect(mockUpload).toHaveBeenCalled()
  })

  it('cancels delete confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<MediaPage />, { wrapper: createWrapper() })

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog', { name: 'Confirm delete' })).not.toBeInTheDocument()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it('shows empty state when no assets exist', () => {
    mockUseMediaLibrary.mockReturnValue({ data: [], isLoading: false })
    render(<MediaPage />, { wrapper: createWrapper() })
    expect(screen.getByText('No uploads yet.')).toBeInTheDocument()
  })

  it('confirms delete before removing asset', async () => {
    const user = userEvent.setup()
    mockDelete.mockResolvedValue(undefined)

    render(<MediaPage />, { wrapper: createWrapper() })

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0]!)
    await user.click(
      screen.getByRole('dialog', { name: 'Confirm delete' }).querySelector('button:last-child')!,
    )

    expect(mockDelete).toHaveBeenCalledWith('sample-upload.png')
  })
})
