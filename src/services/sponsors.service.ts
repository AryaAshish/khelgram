import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { Sponsor, SponsorTier } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type SponsorRow = Database['public']['Tables']['sponsors']['Row']

const tierOrder: Record<SponsorTier, number> = {
  platinum: 0,
  gold: 1,
  silver: 2,
  community: 3,
}

function mapSponsor(row: SponsorRow): Sponsor {
  return {
    id: row.id,
    name: row.name,
    tier: row.tier as SponsorTier,
    logoUrl: row.logo_url ?? undefined,
    website: row.website ?? undefined,
    sortOrder: row.sort_order,
  }
}

export function sortSponsors(sponsors: Sponsor[]): Sponsor[] {
  return [...sponsors].sort((left, right) => {
    const tierDiff = tierOrder[left.tier] - tierOrder[right.tier]
    if (tierDiff !== 0) {
      return tierDiff
    }
    return left.sortOrder - right.sortOrder
  })
}

export async function getSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase.from('sponsors').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return sortSponsors((data ?? []).map(mapSponsor))
}

export async function addSponsor(input: {
  name: string
  tier: SponsorTier
  logoUrl?: string
  website?: string
}): Promise<Sponsor> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('sponsors')

  const { data, error } = await supabase
    .from('sponsors')
    .insert({
      id,
      name: input.name,
      tier: input.tier,
      logo_url: input.logoUrl ?? null,
      website: input.website ?? null,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapSponsor(data)
}

export async function deleteSponsor(id: string): Promise<void> {
  await deleteRow('sponsors', id)
}

export async function reorderSponsors(ids: string[]): Promise<void> {
  await reorderRows('sponsors', ids)
}
