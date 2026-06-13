import { useQuery } from '@tanstack/react-query'
import * as impactStatsService from '@/services/impactStats.service'
import type { ImpactStatScope } from '@/types/app.types'

export const impactStatsKeys = {
  all: ['impact-stats'] as const,
  byScope: (scope: ImpactStatScope) => [...impactStatsKeys.all, scope] as const,
}

export function useImpactStats(scope: ImpactStatScope = 'org') {
  const query = useQuery({
    queryKey: impactStatsKeys.byScope(scope),
    queryFn: () => impactStatsService.getImpactStats(scope),
  })

  return {
    ...query,
    impactStats: query.data ?? [],
  }
}
