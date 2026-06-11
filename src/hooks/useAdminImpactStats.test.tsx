import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useAddImpactStat, useDeleteImpactStat, useReorderImpactStats } from './useAdminImpactStats'
import * as impactStatsService from '@/services/impactStats.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/impactStats.service', () => ({
  addImpactStat: vi.fn(),
  deleteImpactStat: vi.fn(),
  reorderImpactStats: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useAdminImpactStats', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
  })

  it('mutates impact stats', async () => {
    vi.mocked(impactStatsService.addImpactStat).mockResolvedValue({
      id: 'stat-1',
      value: '100+',
      label: 'Kids',
      sortOrder: 0,
    })
    vi.mocked(impactStatsService.deleteImpactStat).mockResolvedValue()
    vi.mocked(impactStatsService.reorderImpactStats).mockResolvedValue()

    const wrapper = createWrapper()
    await renderHook(() => useAddImpactStat(), { wrapper }).result.current.mutateAsync({
      value: '100+',
      label: 'Kids',
    })
    await renderHook(() => useDeleteImpactStat(), { wrapper }).result.current.mutateAsync('stat-1')
    await renderHook(() => useReorderImpactStats(), { wrapper }).result.current.mutateAsync([
      'stat-1',
    ])
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when mutations fail', async () => {
    vi.mocked(impactStatsService.addImpactStat).mockRejectedValue(new Error('add failed'))
    vi.mocked(impactStatsService.deleteImpactStat).mockRejectedValue(new Error('delete failed'))
    vi.mocked(impactStatsService.reorderImpactStats).mockRejectedValue(new Error('reorder failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useAddImpactStat(), { wrapper }).result.current.mutateAsync({
        value: '1',
        label: 'Label',
      }),
    ).rejects.toThrow('add failed')

    await expect(
      renderHook(() => useDeleteImpactStat(), { wrapper }).result.current.mutateAsync('stat-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderImpactStats(), { wrapper }).result.current.mutateAsync(['stat-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(3)
  })
})
