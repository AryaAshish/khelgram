import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useGames } from './useGames'
import * as gamesService from '@/services/games.service'

vi.mock('@/services/games.service', () => ({
  getGames: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useGames', () => {
  it('returns DB games when available', async () => {
    vi.mocked(gamesService.getGames).mockResolvedValue([
      {
        id: 'sack-race',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
      },
    ])

    const { result } = renderHook(() => useGames(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.games[0]?.name).toBe('Sack Race')
  })

  it('returns empty list when DB returns empty', async () => {
    vi.mocked(gamesService.getGames).mockResolvedValue([])

    const { result } = renderHook(() => useGames(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.games).toEqual([])
  })
})
