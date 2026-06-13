import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { ImpactStat, ImpactStatScope } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type ImpactStatRow = Pick<
  Database['public']['Tables']['impact_stats']['Row'],
  'id' | 'stat_key' | 'value' | 'label' | 'sort_order' | 'scope'
>

function mapImpactStat(row: ImpactStatRow): ImpactStat {
  return {
    id: row.id,
    statKey: row.stat_key ?? undefined,
    value: row.value,
    label: row.label,
    sortOrder: row.sort_order,
    scope: row.scope as ImpactStatScope,
  }
}

export async function getImpactStats(scope: ImpactStatScope = 'org'): Promise<ImpactStat[]> {
  const { data, error } = await supabase
    .from('impact_stats')
    .select('id, stat_key, value, label, sort_order, scope')
    .eq('scope', scope)
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapImpactStat)
}

export async function addImpactStat(input: {
  value: string
  label: string
  statKey?: string
  scope?: ImpactStatScope
}): Promise<ImpactStat> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('impact_stats')

  const { data, error } = await supabase
    .from('impact_stats')
    .insert({
      id,
      value: input.value,
      label: input.label,
      stat_key: input.statKey ?? null,
      sort_order: sortOrder,
      scope: input.scope ?? 'org',
    })
    .select('id, stat_key, value, label, sort_order, scope')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapImpactStat(data)
}

export async function deleteImpactStat(id: string): Promise<void> {
  await deleteRow('impact_stats', id)
}

export async function reorderImpactStats(ids: string[]): Promise<void> {
  await reorderRows('impact_stats', ids)
}
