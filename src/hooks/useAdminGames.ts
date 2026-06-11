import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { gamesKeys } from '@/hooks/useGames'
import * as gamesService from '@/services/games.service'
import type { GameInput } from '@/types/app.types'

export const adminGamesKeys = {
  all: ['admin-games'] as const,
}

function useInvalidateGames() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: gamesKeys.all })
    void queryClient.invalidateQueries({ queryKey: adminGamesKeys.all })
  }
}

export function useAdminGames() {
  return useQuery({
    queryKey: adminGamesKeys.all,
    queryFn: gamesService.getAllGames,
  })
}

export function useUpsertGame() {
  const invalidate = useInvalidateGames()

  return useMutation({
    mutationFn: gamesService.upsertGame,
    onSuccess: () => {
      toast.success('Game saved.')
      invalidate()
    },
    onError: () => toast.error('Unable to save game.'),
  })
}

export function useDeleteGame() {
  const invalidate = useInvalidateGames()

  return useMutation({
    mutationFn: gamesService.deleteGame,
    onSuccess: () => {
      toast.success('Game deleted.')
      invalidate()
    },
    onError: () => toast.error('Unable to delete game.'),
  })
}

export function useOpenGame() {
  const invalidate = useInvalidateGames()

  return useMutation({
    mutationFn: gamesService.openGame,
    onSuccess: (game) => {
      toast.success(`${game.name} is now open.`)
      invalidate()
    },
    onError: () => toast.error('Unable to open game.'),
  })
}

export function useCloseGame() {
  const invalidate = useInvalidateGames()

  return useMutation({
    mutationFn: gamesService.closeGame,
    onSuccess: (game) => {
      toast.success(`${game.name} is now closed.`)
      invalidate()
    },
    onError: () => toast.error('Unable to close game.'),
  })
}

export function useSaveGame() {
  const upsert = useUpsertGame()
  return {
    ...upsert,
    mutateAsync: (input: GameInput) => upsert.mutateAsync(input),
  }
}
