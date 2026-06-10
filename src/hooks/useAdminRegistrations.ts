import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { registrationKeys } from '@/hooks/useRegistration'
import * as registrationsService from '@/services/registrations.service'
import type { RegistrationFilters, RegistrationStatus } from '@/types/app.types'

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
    },
    onError: () => {
      toast.error('Unable to update registration status.')
    },
  })
}
