import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { GalleryImage } from '@/types/app.types'
import type { Database } from '@/types/database.types'

type GalleryImageRow = Pick<
  Database['public']['Tables']['gallery_images']['Row'],
  'id' | 'url' | 'alt' | 'caption'
>

function mapGalleryImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    caption: row.caption ?? undefined,
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id, url, alt, caption')
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapGalleryImage)
}
