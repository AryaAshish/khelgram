import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddContributor,
  useContributors,
  useDeleteContributor,
  useReorderContributors,
} from './useContributors'
import * as contributorsService from '@/services/contributors.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/contributors.service', () => ({
  getContributors: vi.fn(),
  addContributor: vi.fn(),
  deleteContributor: vi.fn(),
  reorderContributors: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useContributors hooks', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(contributorsService.getContributors).mockResolvedValue([
      { id: 'c-1', name: 'School', contribution: 'Venue', sortOrder: 0 },
    ])
  })

  it('loads contributors', async () => {
    const { result } = renderHook(() => useContributors(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.contributors[0]?.name).toBe('School')
  })

  it('adds contributor', async () => {
    vi.mocked(contributorsService.addContributor).mockResolvedValue({
      id: 'c-2',
      name: 'New',
      contribution: 'Support',
      sortOrder: 1,
    })
    const { result } = renderHook(() => useAddContributor(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ name: 'New', contribution: 'Support' })
    expect(toast.success).toHaveBeenCalled()
  })

  it('deletes contributor', async () => {
    vi.mocked(contributorsService.deleteContributor).mockResolvedValue()
    const { result } = renderHook(() => useDeleteContributor(), { wrapper: createWrapper() })
    await result.current.mutateAsync('c-1')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast when add fails', async () => {
    vi.mocked(contributorsService.addContributor).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useAddContributor(), { wrapper: createWrapper() })
    await expect(
      result.current.mutateAsync({ name: 'New', contribution: 'Support' }),
    ).rejects.toThrow('failed')
    expect(toast.error).toHaveBeenCalled()
  })

  it('reorders contributors', async () => {
    vi.mocked(contributorsService.reorderContributors).mockResolvedValue()
    const { result } = renderHook(() => useReorderContributors(), { wrapper: createWrapper() })
    await result.current.mutateAsync(['c-1'])
  })

  it('shows error toasts when delete or reorder fails', async () => {
    vi.mocked(contributorsService.deleteContributor).mockRejectedValue(new Error('delete failed'))
    vi.mocked(contributorsService.reorderContributors).mockRejectedValue(
      new Error('reorder failed'),
    )

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useDeleteContributor(), { wrapper }).result.current.mutateAsync('c-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderContributors(), { wrapper }).result.current.mutateAsync(['c-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(2)
  })
})
