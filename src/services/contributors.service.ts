import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { Contributor } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type ContributorRow = Database['public']['Tables']['contributors']['Row']

function mapContributor(row: ContributorRow): Contributor {
  return {
    id: row.id,
    name: row.name,
    contribution: row.contribution,
    photoUrl: row.photo_url ?? undefined,
    sortOrder: row.sort_order,
  }
}

export async function getContributors(): Promise<Contributor[]> {
  const { data, error } = await supabase.from('contributors').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapContributor)
}

export async function addContributor(input: {
  name: string
  contribution: string
  photoUrl?: string
}): Promise<Contributor> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('contributors')

  const { data, error } = await supabase
    .from('contributors')
    .insert({
      id,
      name: input.name,
      contribution: input.contribution,
      photo_url: input.photoUrl ?? null,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapContributor(data)
}

export async function deleteContributor(id: string): Promise<void> {
  await deleteRow('contributors', id)
}

export async function reorderContributors(ids: string[]): Promise<void> {
  await reorderRows('contributors', ids)
}
