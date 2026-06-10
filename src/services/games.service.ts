import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { Game } from '@/types/app.types'
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
>

function mapGame(row: GameRow): Game {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon ?? undefined,
    ageGroup: row.age_group,
    startTime: row.start_time,
    status: row.status,
    capacity: row.capacity ?? undefined,
    registeredCount: row.registered_count,
  }
}

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(
      'id, slug, name, description, icon, age_group, start_time, status, capacity, registered_count',
    )
    .order('name')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapGame)
}
