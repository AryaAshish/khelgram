import { useQuery } from '@tanstack/react-query'
import { impactStats as fallbackImpactStats } from '@/fixtures/homePageFixtures'
import * as impactStatsService from '@/services/impactStats.service'

export const impactStatsKeys = {
  all: ['impact-stats'] as const,
}

export function useImpactStats() {
  const query = useQuery({
    queryKey: impactStatsKeys.all,
    queryFn: impactStatsService.getImpactStats,
  })

  return {
    ...query,
    impactStats: query.data?.length ? query.data : fallbackImpactStats,
  }
}
