import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { TeamMember } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photoUrl: row.photo_url ?? undefined,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export async function getPublishedTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('published', true)
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapTeamMember)
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from('team_members').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapTeamMember)
}

export async function addTeamMember(input: {
  name: string
  role: string
  bio?: string
  photoUrl?: string
  published?: boolean
}): Promise<TeamMember> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('team_members')

  const { data, error } = await supabase
    .from('team_members')
    .insert({
      id,
      name: input.name,
      role: input.role,
      bio: input.bio ?? '',
      photo_url: input.photoUrl ?? null,
      published: input.published ?? false,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapTeamMember(data)
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteRow('team_members', id)
}

export async function reorderTeamMembers(ids: string[]): Promise<void> {
  await reorderRows('team_members', ids)
}
