import { useQuery } from '@tanstack/react-query'
import * as gamesService from '@/services/games.service'

export const gamesKeys = {
  all: ['games'] as const,
}

export function useGames() {
  const query = useQuery({
    queryKey: gamesKeys.all,
    queryFn: gamesService.getGames,
  })

  return {
    ...query,
    games: query.data ?? [],
  }
}
