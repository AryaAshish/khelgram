import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { FaqItem } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type FaqItemRow = Database['public']['Tables']['faq_items']['Row']

function mapFaqItem(row: FaqItemRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
  }
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const { data, error } = await supabase.from('faq_items').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapFaqItem)
}

export async function addFaqItem(input: { question: string; answer: string }): Promise<FaqItem> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('faq_items')

  const { data, error } = await supabase
    .from('faq_items')
    .insert({
      id,
      question: input.question,
      answer: input.answer,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapFaqItem(data)
}

export async function deleteFaqItem(id: string): Promise<void> {
  await deleteRow('faq_items', id)
}

export async function reorderFaqItems(ids: string[]): Promise<void> {
  await reorderRows('faq_items', ids)
}
