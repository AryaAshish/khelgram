import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useDeleteMedia, useMediaLibrary, useUploadMedia } from './useMediaLibrary'
import * as mediaService from '@/services/media.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/media.service', () => ({
  listAssets: vi.fn(),
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useMediaLibrary', () => {
  beforeEach(() => {
    vi.mocked(mediaService.listAssets).mockResolvedValue([
      {
        id: 'media-1',
        path: 'sample-upload.png',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
        size: 1024,
        createdAt: '2026-04-01T10:00:00.000Z',
      },
    ])
  })

  it('loads media assets from service', async () => {
    const { result } = renderHook(() => useMediaLibrary(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useUploadMedia', () => {
  it('shows error toast when upload fails', async () => {
    vi.mocked(mediaService.uploadFile).mockRejectedValue(new Error('upload failed'))

    const { result } = renderHook(() => useUploadMedia(), { wrapper: createWrapper() })
    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })

    await expect(result.current.mutateAsync(file)).rejects.toThrow('upload failed')
    expect(toast.error).toHaveBeenCalledWith('Unable to upload image.')
  })

  it('uploads file and invalidates media list', async () => {
    vi.mocked(mediaService.uploadFile).mockResolvedValue({
      id: 'media-1',
      path: 'sample-upload.png',
      url: 'https://example.com/media/sample-upload.png',
      alt: 'sample-upload.png',
      size: 1024,
      createdAt: '2026-04-01T10:00:00.000Z',
    })

    const { result } = renderHook(() => useUploadMedia(), { wrapper: createWrapper() })
    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })

    await result.current.mutateAsync(file)

    expect(mediaService.uploadFile).toHaveBeenCalledWith(file)
    expect(toast.success).toHaveBeenCalledWith('Image uploaded.')
  })
})

describe('useDeleteMedia', () => {
  it('shows error toast when delete fails', async () => {
    vi.mocked(mediaService.deleteFile).mockRejectedValue(new Error('delete failed'))

    const { result } = renderHook(() => useDeleteMedia(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync('sample-upload.png')).rejects.toThrow('delete failed')
    expect(toast.error).toHaveBeenCalledWith('Unable to delete image.')
  })

  it('deletes file and shows success toast', async () => {
    vi.mocked(mediaService.deleteFile).mockResolvedValue()

    const { result } = renderHook(() => useDeleteMedia(), { wrapper: createWrapper() })

    await result.current.mutateAsync('sample-upload.png')

    expect(mediaService.deleteFile).toHaveBeenCalledWith('sample-upload.png')
    expect(toast.success).toHaveBeenCalledWith('Image deleted.')
  })
})
