import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sponsors as fallbackSponsors } from '@/fixtures/credibilityFixtures'
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
    sponsors: query.data?.length ? query.data : fallbackSponsors,
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
