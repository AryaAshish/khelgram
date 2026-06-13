import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as sponsorsService from '@/services/sponsors.service'

export const sponsorKeys = {
  all: ['sponsors'] as const,
}

export function useSponsors() {
  const query = useQuery({
    queryKey: sponsorKeys.all,
    queryFn: sponsorsService.getSponsors,
  })

  return {
    ...query,
    sponsors: query.data ?? [],
  }
}

function useInvalidateSponsors() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: sponsorKeys.all })
}

export function useAddSponsor() {
  const invalidate = useInvalidateSponsors()

  return useMutation({
    mutationFn: sponsorsService.addSponsor,
    onSuccess: () => {
      toast.success('Sponsor added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add sponsor.'),
  })
}

export function useAdminSponsors() {
  return useQuery({
    queryKey: [...sponsorKeys.all, 'admin'] as const,
    queryFn: sponsorsService.getSponsors,
  })
}

export function useUpdateSponsor() {
  const invalidate = useInvalidateSponsors()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof sponsorsService.updateSponsor>[1]) =>
      sponsorsService.updateSponsor(id, input),
    onSuccess: () => {
      toast.success('Sponsor updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update sponsor.'),
  })
}

export function useDeleteSponsor() {
  const invalidate = useInvalidateSponsors()

  return useMutation({
    mutationFn: sponsorsService.deleteSponsor,
    onSuccess: () => {
      toast.success('Sponsor removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove sponsor.'),
  })
}

export function useReorderSponsors() {
  const invalidate = useInvalidateSponsors()

  return useMutation({
    mutationFn: sponsorsService.reorderSponsors,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder sponsors.'),
  })
}
