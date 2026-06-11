import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { Game, GameInput } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type GameRow = Pick<
  Database['public']['Tables']['games']['Row'],
  | 'id'
  | 'slug'
  | 'name'
  | 'description'
  | 'icon'
  | 'age_group'
  | 'start_time'
  | 'status'
  | 'capacity'
  | 'registered_count'
  | 'pre_registration_allowed'
>

const gameColumns =
  'id, slug, name, description, icon, age_group, start_time, status, capacity, registered_count, pre_registration_allowed'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapGame(row: GameRow): Game {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon ?? undefined,
    ageGroup: row.age_group,
    startTime: row.start_time,
    status: row.status === 'closed' ? 'closed' : 'active',
    capacity: row.capacity ?? undefined,
    registeredCount: row.registered_count,
    preRegistrationAllowed: row.pre_registration_allowed,
  }
}

function mapGameInputToRow(
  input: GameInput,
  id: string,
): Database['public']['Tables']['games']['Insert'] {
  return {
    id,
    slug: input.slug?.trim() || slugify(input.name),
    name: input.name.trim(),
    description: input.description.trim(),
    icon: input.icon?.trim() || null,
    age_group: input.ageGroup.trim(),
    start_time: input.startTime.trim(),
    status: input.status ?? 'active',
    capacity: input.capacity ?? null,
    pre_registration_allowed: input.preRegistrationAllowed ?? true,
  }
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(gameColumns)
    .eq('status', 'active')
    .order('name')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapGame)
}

export async function getAllGames(): Promise<Game[]> {
  const { data, error } = await supabase.from('games').select(gameColumns).order('name')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapGame)
}

export async function getGameWithCapacity(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select(gameColumns)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new SettingsError(error.message)
  }

  return data ? mapGame(data) : null
}

export async function upsertGame(input: GameInput): Promise<Game> {
  const id = input.id?.trim() || slugify(input.name)
  const row = mapGameInputToRow(input, id)

  const { data, error } = await supabase.from('games').upsert(row).select(gameColumns).single()

  if (error || !data) {
    throw new SettingsError(error?.message ?? 'Unable to save game')
  }

  return mapGame(data)
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id)

  if (error) {
    throw new SettingsError(error.message)
  }
}

export async function openGame(id: string): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update({ status: 'active' })
    .eq('id', id)
    .select(gameColumns)
    .single()

  if (error || !data) {
    throw new SettingsError(error?.message ?? 'Unable to open game')
  }

  return mapGame(data)
}

export async function closeGame(id: string): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update({ status: 'closed' })
    .eq('id', id)
    .select(gameColumns)
    .single()

  if (error || !data) {
    throw new SettingsError(error?.message ?? 'Unable to close game')
  }

  return mapGame(data)
}
