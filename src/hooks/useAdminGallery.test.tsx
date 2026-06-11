import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useSaveGallery } from './useAdminGallery'
import * as galleryService from '@/services/gallery.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/gallery.service', () => ({
  saveGalleryImages: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSaveGallery', () => {
  it('shows error toast when save fails', async () => {
    vi.mocked(galleryService.saveGalleryImages).mockRejectedValue(new Error('save failed'))

    const { result } = renderHook(() => useSaveGallery(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync([
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          sortOrder: 0,
        },
      ]),
    ).rejects.toThrow('save failed')

    expect(toast.error).toHaveBeenCalledWith('Unable to save gallery.')
  })

  it('saves gallery images and invalidates gallery query', async () => {
    vi.mocked(galleryService.saveGalleryImages).mockResolvedValue([
      {
        id: 'gallery-1',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
      },
    ])

    const { result } = renderHook(() => useSaveGallery(), { wrapper: createWrapper() })

    await result.current.mutateAsync([
      {
        id: 'gallery-1',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
        sortOrder: 0,
      },
    ])

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(toast.success).toHaveBeenCalledWith('Gallery saved.')
  })
})
