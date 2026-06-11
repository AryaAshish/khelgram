import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from '@/services/credibility.helpers'
import type { Testimonial } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type TestimonialRow = Database['public']['Tables']['testimonials']['Row']

function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    relation: row.relation,
    photoUrl: row.photo_url ?? undefined,
    sortOrder: row.sort_order,
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapTestimonial)
}

export async function addTestimonial(input: {
  quote: string
  author: string
  relation?: string
  photoUrl?: string
}): Promise<Testimonial> {
  const id = crypto.randomUUID()
  const sortOrder = await getNextSortOrder('testimonials')

  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      id,
      quote: input.quote,
      author: input.author,
      relation: input.relation ?? '',
      photo_url: input.photoUrl ?? null,
      sort_order: sortOrder,
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapTestimonial(data)
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteRow('testimonials', id)
}

export async function reorderTestimonials(ids: string[]): Promise<void> {
  await reorderRows('testimonials', ids)
}
