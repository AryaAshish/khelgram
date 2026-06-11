import type { Game } from '@/types/app.types'

export type GameRegistrationStatus = 'confirmed' | 'waitlisted'

export function resolveGameRegistrationStatuses(
  games: Game[],
  gameIds: string[],
): Record<string, GameRegistrationStatus> {
  const statuses: Record<string, GameRegistrationStatus> = {}

  for (const gameId of gameIds) {
    const game = games.find((entry) => entry.id === gameId)
    if (!game) {
      throw new Error('One or more selected events are no longer available.')
    }

    if (game.status === 'closed') {
      throw new Error(`${game.name} is not open for registration.`)
    }

    const isFull = game.capacity !== undefined && (game.registeredCount ?? 0) >= game.capacity

    statuses[gameId] = isFull ? 'waitlisted' : 'confirmed'
  }

  return statuses
}

export function getOverallRegistrationStatus(
  gameStatuses: Record<string, GameRegistrationStatus>,
): GameRegistrationStatus {
  return Object.values(gameStatuses).some((status) => status === 'waitlisted')
    ? 'waitlisted'
    : 'confirmed'
}

export function getCapacityPercent(game: Game): number | null {
  if (game.capacity === undefined || game.capacity <= 0) {
    return null
  }

  const registered = game.registeredCount ?? 0
  return Math.min(100, Math.round((registered / game.capacity) * 100))
}

export function isGameFull(game: Game): boolean {
  return game.capacity !== undefined && (game.registeredCount ?? 0) >= game.capacity
}
