import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useImpactStats } from './useImpactStats'
import * as impactStatsService from '@/services/impactStats.service'

vi.mock('@/services/impactStats.service', () => ({
  getImpactStats: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useImpactStats', () => {
  it('returns DB impact stats when available', async () => {
    vi.mocked(impactStatsService.getImpactStats).mockResolvedValue([
      {
        id: 'org-villages',
        value: '120+',
        label: 'Villages Reached',
        scope: 'org',
      },
    ])

    const { result } = renderHook(() => useImpactStats('org'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.impactStats[0]?.id).toBe('org-villages')
    expect(impactStatsService.getImpactStats).toHaveBeenCalledWith('org')
  })

  it('returns event fixture fallback when DB returns empty', async () => {
    vi.mocked(impactStatsService.getImpactStats).mockResolvedValue([])

    const { result } = renderHook(() => useImpactStats('event'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.impactStats[0]?.label).toBe('Children Participating')
  })

  it('returns org fixture fallback when DB returns empty', async () => {
    vi.mocked(impactStatsService.getImpactStats).mockResolvedValue([])

    const { result } = renderHook(() => useImpactStats('org'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.impactStats[0]?.label).toBe('Villages Reached')
  })
})
