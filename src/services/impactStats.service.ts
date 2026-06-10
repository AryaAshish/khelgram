import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { ImpactStat } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type ImpactStatRow = Pick<
  Database['public']['Tables']['impact_stats']['Row'],
  'id' | 'stat_key' | 'value' | 'label'
>

function mapImpactStat(row: ImpactStatRow): ImpactStat {
  return {
    id: row.id,
    statKey: row.stat_key ?? undefined,
    value: row.value,
    label: row.label,
  }
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  const { data, error } = await supabase
    .from('impact_stats')
    .select('id, stat_key, value, label')
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapImpactStat)
}
