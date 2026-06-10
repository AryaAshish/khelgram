import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useGallery } from './useGallery'
import * as galleryService from '@/services/gallery.service'

vi.mock('@/services/gallery.service', () => ({
  getGalleryImages: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useGallery', () => {
  it('returns DB gallery images when available', async () => {
    vi.mocked(galleryService.getGalleryImages).mockResolvedValue([
      {
        id: 'gallery-1',
        url: 'https://example.com/1.jpg',
        alt: 'Image',
      },
    ])

    const { result } = renderHook(() => useGallery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.images[0]?.id).toBe('gallery-1')
  })

  it('returns fixture fallback when DB returns empty', async () => {
    vi.mocked(galleryService.getGalleryImages).mockResolvedValue([])

    const { result } = renderHook(() => useGallery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.images.length).toBeGreaterThan(0)
  })
})
