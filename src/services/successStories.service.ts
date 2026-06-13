import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { SuccessStory } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type SuccessStoryRow = Database['public']['Tables']['success_stories']['Row']

function mapSuccessStory(row: SuccessStoryRow): SuccessStory {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    story: row.story,
    imageUrl: row.image_url ?? undefined,
    published: row.published,
    sortOrder: row.sort_order,
  }
}

export async function getPublishedSuccessStories(): Promise<SuccessStory[]> {
  const { data, error } = await supabase
    .from('success_stories')
    .select('*')
    .eq('published', true)
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapSuccessStory)
}

export async function getAllSuccessStories(): Promise<SuccessStory[]> {
  const { data, error } = await supabase.from('success_stories').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapSuccessStory)
}

export async function addSuccessStory(input: {
  title: string
  summary?: string
  story?: string
  imageUrl?: string
  published?: boolean
}): Promise<SuccessStory> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('success_stories')

  const { data, error } = await supabase
    .from('success_stories')
    .insert({
      id,
      title: input.title,
      summary: input.summary ?? '',
      story: input.story ?? '',
      image_url: input.imageUrl ?? null,
      published: input.published ?? false,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapSuccessStory(data)
}

export async function updateSuccessStory(
  id: string,
  input: {
    title?: string
    summary?: string
    story?: string
    imageUrl?: string
    published?: boolean
  },
): Promise<SuccessStory> {
  const updates: Database['public']['Tables']['success_stories']['Update'] = {}

  if (input.title !== undefined) updates.title = input.title
  if (input.summary !== undefined) updates.summary = input.summary
  if (input.story !== undefined) updates.story = input.story
  if (input.imageUrl !== undefined) updates.image_url = input.imageUrl || null
  if (input.published !== undefined) updates.published = input.published

  const { data, error } = await supabase
    .from('success_stories')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapSuccessStory(data)
}

export async function deleteSuccessStory(id: string): Promise<void> {
  await deleteRow('success_stories', id)
}

export async function reorderSuccessStories(ids: string[]): Promise<void> {
  await reorderRows('success_stories', ids)
}
