import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { SiteSetting } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type SiteSettingRow = Pick<
  Database['public']['Tables']['site_settings']['Row'],
  'key' | 'value' | 'section'
>

function mapSiteSetting(row: SiteSettingRow): SiteSetting {
  return {
    key: row.key,
    value: row.value,
    section: row.section,
  }
}

export async function getSettingsBySection(section: string): Promise<SiteSetting[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, section')
    .eq('section', section)
    .order('key')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapSiteSetting)
}

export async function getSetting(key: string): Promise<SiteSetting | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, section')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    throw new SettingsError(error.message)
  }

  return data ? mapSiteSetting(data) : null
}

export async function updateSetting(
  key: string,
  value: string,
  section: string,
): Promise<SiteSetting> {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value, section })
    .select('key, value, section')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapSiteSetting(data)
}
