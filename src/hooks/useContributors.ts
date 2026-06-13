import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as contributorsService from '@/services/contributors.service'

export const contributorKeys = {
  all: ['contributors'] as const,
}

export function useContributors() {
  const query = useQuery({
    queryKey: contributorKeys.all,
    queryFn: contributorsService.getContributors,
  })

  return {
    ...query,
    contributors: query.data ?? [],
  }
}

function useInvalidateContributors() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: contributorKeys.all })
}

export function useAddContributor() {
  const invalidate = useInvalidateContributors()

  return useMutation({
    mutationFn: contributorsService.addContributor,
    onSuccess: () => {
      toast.success('Contributor added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add contributor.'),
  })
}

export function useAdminContributors() {
  return useQuery({
    queryKey: [...contributorKeys.all, 'admin'] as const,
    queryFn: contributorsService.getContributors,
  })
}

export function useUpdateContributor() {
  const invalidate = useInvalidateContributors()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof contributorsService.updateContributor>[1]) =>
      contributorsService.updateContributor(id, input),
    onSuccess: () => {
      toast.success('Contributor updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update contributor.'),
  })
}

export function useDeleteContributor() {
  const invalidate = useInvalidateContributors()

  return useMutation({
    mutationFn: contributorsService.deleteContributor,
    onSuccess: () => {
      toast.success('Contributor removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove contributor.'),
  })
}

export function useReorderContributors() {
  const invalidate = useInvalidateContributors()

  return useMutation({
    mutationFn: contributorsService.reorderContributors,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder contributors.'),
  })
}
