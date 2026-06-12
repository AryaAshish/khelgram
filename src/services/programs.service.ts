import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { Program, ProgramPillar } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type ProgramRow = Database['public']['Tables']['programs']['Row']

function mapProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    pillar: row.pillar as ProgramPillar,
    icon: row.icon ?? undefined,
    published: row.published,
    sortOrder: row.sort_order,
    ctaLabel: row.cta_label ?? undefined,
    ctaUrl: row.cta_url ?? undefined,
  }
}

export async function getPublishedPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapProgram)
}

export async function getAllPrograms(): Promise<Program[]> {
  const { data, error } = await supabase.from('programs').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapProgram)
}

export async function addProgram(input: {
  title: string
  description?: string
  pillar: ProgramPillar
  icon?: string
  published?: boolean
  ctaLabel?: string
  ctaUrl?: string
}): Promise<Program> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('programs')

  const { data, error } = await supabase
    .from('programs')
    .insert({
      id,
      title: input.title,
      description: input.description ?? '',
      pillar: input.pillar,
      icon: input.icon ?? null,
      published: input.published ?? false,
      cta_label: input.ctaLabel ?? null,
      cta_url: input.ctaUrl ?? null,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapProgram(data)
}

export async function updateProgram(
  id: string,
  input: {
    title?: string
    description?: string
    pillar?: ProgramPillar
    icon?: string
    published?: boolean
    ctaLabel?: string
    ctaUrl?: string
  },
): Promise<Program> {
  const updates: Database['public']['Tables']['programs']['Update'] = {}

  if (input.title !== undefined) updates.title = input.title
  if (input.description !== undefined) updates.description = input.description
  if (input.pillar !== undefined) updates.pillar = input.pillar
  if (input.icon !== undefined) updates.icon = input.icon || null
  if (input.published !== undefined) updates.published = input.published
  if (input.ctaLabel !== undefined) updates.cta_label = input.ctaLabel || null
  if (input.ctaUrl !== undefined) updates.cta_url = input.ctaUrl || null

  const { data, error } = await supabase
    .from('programs')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapProgram(data)
}

export async function deleteProgram(id: string): Promise<void> {
  await deleteRow('programs', id)
}

export async function reorderPrograms(ids: string[]): Promise<void> {
  await reorderRows('programs', ids)
}
