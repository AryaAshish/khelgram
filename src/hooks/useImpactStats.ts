import { useQuery } from '@tanstack/react-query'
import { eventImpactStats, orgImpactStats } from '@/fixtures/homePageFixtures'
import * as impactStatsService from '@/services/impactStats.service'
import type { ImpactStatScope } from '@/types/app.types'

export const impactStatsKeys = {
  all: ['impact-stats'] as const,
  byScope: (scope: ImpactStatScope) => [...impactStatsKeys.all, scope] as const,
}

const fallbackByScope: Record<ImpactStatScope, typeof orgImpactStats> = {
  org: orgImpactStats,
  event: eventImpactStats,
}

export function useImpactStats(scope: ImpactStatScope = 'org') {
  const query = useQuery({
    queryKey: impactStatsKeys.byScope(scope),
    queryFn: () => impactStatsService.getImpactStats(scope),
  })

  return {
    ...query,
    impactStats: query.data?.length ? query.data : fallbackByScope[scope],
  }
}
