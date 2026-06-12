import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { Database } from '@/types/database.types'

type CredibilityTable = keyof Pick<
  Database['public']['Tables'],
  | 'team_members'
  | 'contributors'
  | 'sponsors'
  | 'testimonials'
  | 'faq_items'
  | 'impact_stats'
  | 'programs'
>

export async function getNextSortOrder(table: CredibilityTable): Promise<number> {
  const { data, error } = await supabase.from(table).select('sort_order').order('sort_order', {
    ascending: false,
  })

  if (error) {
    throw new SettingsError(error.message)
  }

  const highest = data?.[0]?.sort_order
  return typeof highest === 'number' ? highest + 1 : 0
}

export async function reorderRows(table: CredibilityTable, ids: string[]): Promise<void> {
  const updates = ids.map((id, sortOrder) =>
    supabase.from(table).update({ sort_order: sortOrder }).eq('id', id),
  )

  const results = await Promise.all(updates)
  const failed = results.find((result) => result.error)

  if (failed?.error) {
    throw new SettingsError(failed.error.message)
  }
}

export async function deleteRow(table: CredibilityTable, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) {
    throw new SettingsError(error.message)
  }
}
