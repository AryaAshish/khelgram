import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { impactStatsKeys } from '@/hooks/useImpactStats'
import * as impactStatsService from '@/services/impactStats.service'

export function useAddImpactStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: impactStatsService.addImpactStat,
    onSuccess: () => {
      toast.success('Impact stat added.')
      void queryClient.invalidateQueries({ queryKey: impactStatsKeys.all })
    },
    onError: () => toast.error('Unable to add impact stat.'),
  })
}

export function useDeleteImpactStat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: impactStatsService.deleteImpactStat,
    onSuccess: () => {
      toast.success('Impact stat removed.')
      void queryClient.invalidateQueries({ queryKey: impactStatsKeys.all })
    },
    onError: () => toast.error('Unable to remove impact stat.'),
  })
}

export function useReorderImpactStats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: impactStatsService.reorderImpactStats,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: impactStatsKeys.all })
    },
    onError: () => toast.error('Unable to reorder impact stats.'),
  })
}
