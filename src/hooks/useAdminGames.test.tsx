import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAdminGames,
  useCloseGame,
  useDeleteGame,
  useOpenGame,
  useSaveGame,
  useUpsertGame,
} from './useAdminGames'
import * as gamesService from '@/services/games.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/games.service', () => ({
  getAllGames: vi.fn(),
  upsertGame: vi.fn(),
  deleteGame: vi.fn(),
  openGame: vi.fn(),
  closeGame: vi.fn(),
}))

const sampleGame = {
  id: 'game-1',
  name: 'Sack Race',
  description: 'Hop',
  ageGroup: 'Ages 6-10',
  startTime: '10:00 AM',
  status: 'active' as const,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useAdminGames', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(gamesService.getAllGames).mockResolvedValue([sampleGame])
    vi.mocked(gamesService.upsertGame).mockResolvedValue(sampleGame)
    vi.mocked(gamesService.deleteGame).mockResolvedValue()
    vi.mocked(gamesService.openGame).mockResolvedValue(sampleGame)
    vi.mocked(gamesService.closeGame).mockResolvedValue({ ...sampleGame, status: 'closed' })
  })

  it('loads all games', async () => {
    const { result } = renderHook(() => useAdminGames(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([sampleGame])
  })

  it('upserts game and shows success toast', async () => {
    const { result } = renderHook(() => useUpsertGame(), { wrapper: createWrapper() })
    await result.current.mutateAsync(sampleGame)
    expect(gamesService.upsertGame).toHaveBeenCalledWith(sampleGame, expect.anything())
    expect(toast.success).toHaveBeenCalledWith('Game saved.')
  })

  it('deletes game and shows success toast', async () => {
    const { result } = renderHook(() => useDeleteGame(), { wrapper: createWrapper() })
    await result.current.mutateAsync('game-1')
    expect(gamesService.deleteGame).toHaveBeenCalledWith('game-1', expect.anything())
    expect(toast.success).toHaveBeenCalledWith('Game deleted.')
  })

  it('opens and closes game with state toasts', async () => {
    const open = renderHook(() => useOpenGame(), { wrapper: createWrapper() })
    await open.result.current.mutateAsync('game-1')
    expect(toast.success).toHaveBeenCalledWith('Sack Race is now open.')

    const close = renderHook(() => useCloseGame(), { wrapper: createWrapper() })
    await close.result.current.mutateAsync('game-1')
    expect(toast.success).toHaveBeenCalledWith('Sack Race is now closed.')
  })

  it('shows error toasts when mutations fail', async () => {
    vi.mocked(gamesService.upsertGame).mockRejectedValueOnce(new Error('upsert failed'))
    vi.mocked(gamesService.deleteGame).mockRejectedValueOnce(new Error('delete failed'))
    vi.mocked(gamesService.openGame).mockRejectedValueOnce(new Error('open failed'))
    vi.mocked(gamesService.closeGame).mockRejectedValueOnce(new Error('close failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useUpsertGame(), { wrapper }).result.current.mutateAsync(sampleGame),
    ).rejects.toThrow('upsert failed')
    await expect(
      renderHook(() => useDeleteGame(), { wrapper }).result.current.mutateAsync('game-1'),
    ).rejects.toThrow('delete failed')
    await expect(
      renderHook(() => useOpenGame(), { wrapper }).result.current.mutateAsync('game-1'),
    ).rejects.toThrow('open failed')
    await expect(
      renderHook(() => useCloseGame(), { wrapper }).result.current.mutateAsync('game-1'),
    ).rejects.toThrow('close failed')

    expect(toast.error).toHaveBeenCalledTimes(4)
  })

  it('useSaveGame proxies to upsert mutation', async () => {
    const { result } = renderHook(() => useSaveGame(), { wrapper: createWrapper() })
    await result.current.mutateAsync(sampleGame)
    expect(gamesService.upsertGame).toHaveBeenCalled()
  })
})
