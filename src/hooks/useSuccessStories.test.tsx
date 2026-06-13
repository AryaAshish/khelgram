import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddSuccessStory,
  useAdminSuccessStories,
  useDeleteSuccessStory,
  useReorderSuccessStories,
  useSuccessStories,
  useUpdateSuccessStory,
} from './useSuccessStories'
import * as successStoriesService from '@/services/successStories.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/successStories.service', () => ({
  getPublishedSuccessStories: vi.fn(),
  getAllSuccessStories: vi.fn(),
  addSuccessStory: vi.fn(),
  updateSuccessStory: vi.fn(),
  deleteSuccessStory: vi.fn(),
  reorderSuccessStories: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSuccessStories', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(successStoriesService.getPublishedSuccessStories).mockReset()
    vi.mocked(successStoriesService.getAllSuccessStories).mockReset()
  })

  it('returns DB stories when available', async () => {
    vi.mocked(successStoriesService.getPublishedSuccessStories).mockResolvedValue([
      {
        id: 'story-db',
        title: 'DB Story',
        summary: 'Summary',
        story: 'Body',
        published: true,
        sortOrder: 1,
      },
    ])

    const { result } = renderHook(() => useSuccessStories(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.stories[0]?.id).toBe('story-db')
  })

  it('returns fixture fallback when DB returns empty', async () => {
    vi.mocked(successStoriesService.getPublishedSuccessStories).mockResolvedValue([])
    const { result } = renderHook(() => useSuccessStories(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.stories[0]?.title).toBe('From village field to district finals')
  })

  it('runs admin mutations with toasts', async () => {
    vi.mocked(successStoriesService.getAllSuccessStories).mockResolvedValue([
      {
        id: 'story-1',
        title: 'Story',
        summary: '',
        story: '',
        published: true,
        sortOrder: 0,
      },
    ])
    vi.mocked(successStoriesService.addSuccessStory).mockResolvedValue({
      id: 'story-1',
      title: 'Story',
      summary: '',
      story: '',
      published: false,
      sortOrder: 0,
    })
    vi.mocked(successStoriesService.updateSuccessStory).mockResolvedValue({
      id: 'story-1',
      title: 'Story',
      summary: '',
      story: '',
      published: true,
      sortOrder: 0,
    })
    vi.mocked(successStoriesService.deleteSuccessStory).mockResolvedValue(undefined)
    vi.mocked(successStoriesService.reorderSuccessStories).mockResolvedValue(undefined)

    const { result: add } = renderHook(() => useAddSuccessStory(), { wrapper: createWrapper() })
    await add.current.mutateAsync({ title: 'Story' })
    expect(toast.success).toHaveBeenCalled()

    const { result: update } = renderHook(() => useUpdateSuccessStory(), {
      wrapper: createWrapper(),
    })
    await update.current.mutateAsync({ id: 'story-1', published: true })

    const { result: remove } = renderHook(() => useDeleteSuccessStory(), {
      wrapper: createWrapper(),
    })
    await remove.current.mutateAsync('story-1')

    const { result: reorder } = renderHook(() => useReorderSuccessStories(), {
      wrapper: createWrapper(),
    })
    await reorder.current.mutateAsync(['story-1'])

    const { result: admin } = renderHook(() => useAdminSuccessStories(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(admin.current.isSuccess).toBe(true))
  })

  it('shows error toasts when mutations fail', async () => {
    vi.mocked(successStoriesService.addSuccessStory).mockRejectedValue(new Error('fail'))
    vi.mocked(successStoriesService.updateSuccessStory).mockRejectedValue(new Error('fail'))
    vi.mocked(successStoriesService.deleteSuccessStory).mockRejectedValue(new Error('fail'))
    vi.mocked(successStoriesService.reorderSuccessStories).mockRejectedValue(new Error('fail'))

    const { result: add } = renderHook(() => useAddSuccessStory(), { wrapper: createWrapper() })
    await expect(add.current.mutateAsync({ title: 'Story' })).rejects.toThrow()
    expect(toast.error).toHaveBeenCalled()

    const { result: update } = renderHook(() => useUpdateSuccessStory(), {
      wrapper: createWrapper(),
    })
    await expect(update.current.mutateAsync({ id: 'story-1', published: true })).rejects.toThrow()

    const { result: remove } = renderHook(() => useDeleteSuccessStory(), {
      wrapper: createWrapper(),
    })
    await expect(remove.current.mutateAsync('story-1')).rejects.toThrow()

    const { result: reorder } = renderHook(() => useReorderSuccessStories(), {
      wrapper: createWrapper(),
    })
    await expect(reorder.current.mutateAsync(['story-1'])).rejects.toThrow()
  })
})
