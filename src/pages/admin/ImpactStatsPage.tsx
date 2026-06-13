import { useState } from 'react'
import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import { Button } from '@/components/ui/button'
import {
  useAddImpactStat,
  useDeleteImpactStat,
  useReorderImpactStats,
} from '@/hooks/useAdminImpactStats'
import { useImpactStats } from '@/hooks/useImpactStats'
import type { ImpactStat, ImpactStatScope } from '@/types/app.types'

const fields = [
  { key: 'value', label: 'Value' },
  { key: 'label', label: 'Label' },
  { key: 'statKey', label: 'Stat key' },
]

const scopeLabels: Record<ImpactStatScope, string> = {
  org: 'Organization',
  event: 'Khel 2026 event',
}

export function ImpactStatsPage() {
  const [scope, setScope] = useState<ImpactStatScope>('org')
  const { impactStats, isLoading } = useImpactStats(scope)
  const addStat = useAddImpactStat()
  const deleteStat = useDeleteImpactStat()
  const reorderStats = useReorderImpactStats()
  const isPending = addStat.isPending || deleteStat.isPending || reorderStats.isPending

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(scopeLabels) as ImpactStatScope[]).map((option) => (
          <Button
            key={option}
            type="button"
            variant={scope === option ? 'default' : 'outline'}
            onClick={() => setScope(option)}
          >
            {scopeLabels[option]}
          </Button>
        ))}
      </div>
      <SortableCredibilityAdmin<ImpactStat>
        title={`${scopeLabels[scope]} impact stats`}
        items={impactStats}
        fields={fields}
        addLabel="Add stat"
        isLoading={isLoading}
        isPending={isPending}
        getItemSummary={(stat) => `${stat.value} — ${stat.label}`}
        onAdd={async (values) => {
          await addStat.mutateAsync({
            value: String(values.value ?? ''),
            label: String(values.label ?? ''),
            statKey: String(values.statKey ?? '') || undefined,
            scope,
          })
        }}
        onDelete={async (id) => deleteStat.mutateAsync(id)}
        onReorder={async (ids) => reorderStats.mutateAsync(ids)}
      />
    </div>
  )
}
