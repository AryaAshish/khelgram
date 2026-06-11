import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registrationInputSchema } from '@/lib/registration.schema'
import { RegistrationError } from '@/lib/errors'
import { gamesKeys } from '@/hooks/useGames'
import { registrationKeys } from '@/hooks/useRegistration'
import * as gamesService from '@/services/games.service'
import * as registrationsService from '@/services/registrations.service'
import type { RegistrationFilters, RegistrationInput, RegistrationStatus } from '@/types/app.types'

export const adminRegistrationKeys = {
  all: ['admin-registrations'] as const,
  list: (filters: RegistrationFilters) => [...adminRegistrationKeys.all, 'list', filters] as const,
  detail: (id: string) => [...adminRegistrationKeys.all, 'detail', id] as const,
}

export function useAdminRegistrations(filters: RegistrationFilters) {
  const query = useQuery({
    queryKey: adminRegistrationKeys.list(filters),
    queryFn: registrationsService.getRegistrations,
    select: (registrations) => registrationsService.filterRegistrations(registrations, filters),
  })

  return {
    ...query,
    registrations: query.data ?? [],
  }
}

export function useRegistrationDetail(id: string) {
  return useQuery({
    queryKey: adminRegistrationKeys.detail(id),
    queryFn: () => registrationsService.getRegistrationDetail(id),
    enabled: Boolean(id),
  })
}

export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RegistrationStatus }) =>
      registrationsService.updateRegistrationStatus(id, status),
    onSuccess: (registration) => {
      toast.success(`Registration ${registration.code} updated to ${registration.status}.`)
      void queryClient.invalidateQueries({ queryKey: adminRegistrationKeys.all })
      void queryClient.invalidateQueries({ queryKey: registrationKeys.count() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.all })
    },
    onError: () => {
      toast.error('Unable to update registration status.')
    },
  })
}

function resolveAdminGameIds(
  games: Awaited<ReturnType<typeof gamesService.getAllGames>>,
  selectedEvents: string[],
) {
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

export function useAdminCreateRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RegistrationInput) => {
      const parsed = registrationInputSchema.safeParse(input)
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid registration details'
        throw new RegistrationError(firstIssue)
      }

      const games = await gamesService.getAllGames()
      const activeGames = games.filter((game) => game.status === 'active')
      const gameIds = resolveAdminGameIds(activeGames, parsed.data.selectedEvents)
      const gameStatuses = registrationsService.resolveGameRegistrationStatuses(
        activeGames,
        gameIds,
      )

      return registrationsService.createRegistration({
        ...parsed.data,
        gameIds,
        gameStatuses,
      })
    },
    onSuccess: (result) => {
      toast.success(`Registration ${result.code} created (${result.status}).`)
      void queryClient.invalidateQueries({ queryKey: adminRegistrationKeys.all })
      void queryClient.invalidateQueries({ queryKey: registrationKeys.count() })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.all })
    },
    onError: (error: Error) => {
      const message =
        error instanceof RegistrationError ? error.message : 'Unable to create registration.'
      toast.error(message)
    },
  })
}

export function usePromoteFromWaitlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ registrationId, gameId }: { registrationId: string; gameId: string }) =>
      registrationsService.promoteFromWaitlist(registrationId, gameId),
    onSuccess: (registration) => {
      toast.success(`Promoted ${registration.code} to confirmed.`)
      void queryClient.invalidateQueries({ queryKey: adminRegistrationKeys.all })
      void queryClient.invalidateQueries({ queryKey: gamesKeys.all })
    },
    onError: (error: Error) => {
      const message =
        error instanceof RegistrationError ? error.message : 'Unable to promote registration.'
      toast.error(message)
    },
  })
}
