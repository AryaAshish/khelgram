import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddSponsor,
  useAdminSponsors,
  useDeleteSponsor,
  useReorderSponsors,
  useSponsors,
  useUpdateSponsor,
} from './useSponsors'
import * as sponsorsService from '@/services/sponsors.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/sponsors.service', () => ({
  getSponsors: vi.fn(),
  addSponsor: vi.fn(),
  updateSponsor: vi.fn(),
  deleteSponsor: vi.fn(),
  reorderSponsors: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSponsors hooks', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
  })

  it('loads sponsors', async () => {
    vi.mocked(sponsorsService.getSponsors).mockResolvedValue([
      { id: 's-1', name: 'Acme', tier: 'platinum', sortOrder: 0 },
    ])
    const { result } = renderHook(() => useSponsors(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.sponsors[0]?.tier).toBe('platinum')
  })

  it('loads admin sponsors', async () => {
    vi.mocked(sponsorsService.getSponsors).mockResolvedValue([
      { id: 's-1', name: 'Acme', tier: 'platinum', sortOrder: 0 },
    ])
    const { result } = renderHook(() => useAdminSponsors(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0]?.name).toBe('Acme')
  })

  it('updates sponsor', async () => {
    vi.mocked(sponsorsService.updateSponsor).mockResolvedValue({
      id: 's-1',
      name: 'Updated',
      tier: 'gold',
      sortOrder: 0,
    })
    const { result } = renderHook(() => useUpdateSponsor(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ id: 's-1', name: 'Updated' })
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast when update fails', async () => {
    vi.mocked(sponsorsService.updateSponsor).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useUpdateSponsor(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync({ id: 's-1', name: 'Fail' })).rejects.toThrow('failed')
    expect(toast.error).toHaveBeenCalled()
  })

  it('shows error toast when add fails', async () => {
    vi.mocked(sponsorsService.addSponsor).mockRejectedValue(new Error('failed'))
    const { result } = renderHook(() => useAddSponsor(), { wrapper: createWrapper() })
    await expect(result.current.mutateAsync({ name: 'New', tier: 'gold' })).rejects.toThrow(
      'failed',
    )
    expect(toast.error).toHaveBeenCalled()
  })

  it('mutates sponsors', async () => {
    vi.mocked(sponsorsService.addSponsor).mockResolvedValue({
      id: 's-2',
      name: 'New',
      tier: 'gold',
      sortOrder: 1,
    })
    vi.mocked(sponsorsService.deleteSponsor).mockResolvedValue()
    vi.mocked(sponsorsService.reorderSponsors).mockResolvedValue()

    const wrapper = createWrapper()
    await renderHook(() => useAddSponsor(), { wrapper }).result.current.mutateAsync({
      name: 'New',
      tier: 'gold',
    })
    await renderHook(() => useDeleteSponsor(), { wrapper }).result.current.mutateAsync('s-1')
    await renderHook(() => useReorderSponsors(), { wrapper }).result.current.mutateAsync(['s-1'])
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when delete or reorder fails', async () => {
    vi.mocked(sponsorsService.deleteSponsor).mockRejectedValue(new Error('delete failed'))
    vi.mocked(sponsorsService.reorderSponsors).mockRejectedValue(new Error('reorder failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useDeleteSponsor(), { wrapper }).result.current.mutateAsync('s-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderSponsors(), { wrapper }).result.current.mutateAsync(['s-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(2)
  })
})
