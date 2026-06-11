import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isRegistrationAllowed } from '@/lib/eventStatus'
import { registrationInputSchema } from '@/lib/registration.schema'
import { RegistrationError } from '@/lib/errors'
import { gamesKeys } from '@/hooks/useGames'
import * as gamesService from '@/services/games.service'
import * as registrationsService from '@/services/registrations.service'
import type { Game, RegistrationInput } from '@/types/app.types'

export const registrationKeys = {
  all: ['registrations'] as const,
  count: () => [...registrationKeys.all, 'count'] as const,
}

const COUNT_REFETCH_MS = 30_000

function resolveGameIds(games: Game[], selectedEvents: string[]): string[] {
  const ids: string[] = []

  for (const eventName of selectedEvents) {
    const game = games.find((entry) => entry.name === eventName)
    if (!game) {
      throw new RegistrationError(`Event "${eventName}" is not available.`)
    }
    ids.push(game.id)
  }

  return ids
}

function filterGamesForEventStatus(games: Game[], eventStatus: string): Game[] {
  if (eventStatus === 'pre_registration') {
    return games.filter((game) => game.preRegistrationAllowed !== false)
  }

  return games
}

export function useRegistrationCount() {
  return useQuery({
    queryKey: registrationKeys.count(),
    queryFn: registrationsService.getRegistrationCount,
    refetchInterval: COUNT_REFETCH_MS,
  })
}

export function useCreateRegistration(eventStatus = 'registration_open') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RegistrationInput) => {
      if (!isRegistrationAllowed(eventStatus)) {
        throw new RegistrationError('Registration is currently closed.')
      }

      const parsed = registrationInputSchema.safeParse(input)
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid registration details'
        throw new RegistrationError(firstIssue)
      }

      const allGames = await gamesService.getGames()
      const games = filterGamesForEventStatus(allGames, eventStatus)
      const gameIds = resolveGameIds(games, parsed.data.selectedEvents)

      for (const gameId of gameIds) {
        const isDuplicate = await registrationsService.checkDuplicate(parsed.data.email, gameId)
        if (isDuplicate) {
          const gameName = games.find((game) => game.id === gameId)?.name ?? 'this event'
          throw new RegistrationError(`You are already registered for ${gameName}.`)
        }
      }

      const gameStatuses = registrationsService.resolveGameRegistrationStatuses(games, gameIds)

      return registrationsService.createRegistration({
        ...parsed.data,
        gameIds,
        gameStatuses,
      })
    },
    onSuccess: (result) => {
      if (result.status === 'waitlisted') {
        toast.success(
          `You're on the waitlist. We'll contact you if a spot opens. Your code is ${result.code}.`,
        )
      } else {
        toast.success(`Registration confirmed! Your code is ${result.code}.`)
      }
      void queryClient.invalidateQueries({ queryKey: registrationKeys.count() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.all })
    },
    onError: (error: Error) => {
      const message =
        error instanceof RegistrationError
          ? error.message
          : 'Registration failed. Please try again.'
      toast.error(message)
    },
  })
}
