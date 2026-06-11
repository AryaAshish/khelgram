import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddImpactStat,
  useDeleteImpactStat,
  useReorderImpactStats,
} from '@/hooks/useAdminImpactStats'
import { useImpactStats } from '@/hooks/useImpactStats'
import type { ImpactStat } from '@/types/app.types'

const fields = [
  { key: 'value', label: 'Value' },
  { key: 'label', label: 'Label' },
  { key: 'statKey', label: 'Stat key' },
]

export function ImpactStatsPage() {
  const { impactStats, isLoading } = useImpactStats()
  const addStat = useAddImpactStat()
  const deleteStat = useDeleteImpactStat()
  const reorderStats = useReorderImpactStats()
  const isPending = addStat.isPending || deleteStat.isPending || reorderStats.isPending

  return (
    <SortableCredibilityAdmin<ImpactStat>
      title="Impact stats"
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
        })
      }}
      onDelete={async (id) => deleteStat.mutateAsync(id)}
      onReorder={async (ids) => reorderStats.mutateAsync(ids)}
    />
  )
}
