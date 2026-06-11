import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type { GalleryImage, GalleryImageDraft } from '@/types/app.types'
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

export async function saveGalleryImages(images: GalleryImageDraft[]): Promise<GalleryImage[]> {
  const { data: existingRows, error: existingError } = await supabase
    .from('gallery_images')
    .select('id')

  if (existingError) {
    throw new SettingsError(existingError.message)
  }

  const nextIds = new Set(images.map((image) => image.id))
  const idsToDelete = (existingRows ?? []).map((row) => row.id).filter((id) => !nextIds.has(id))

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .in('id', idsToDelete)

    if (deleteError) {
      throw new SettingsError(deleteError.message)
    }
  }

  if (images.length === 0) {
    return []
  }

  const rows = images.map((image, index) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    caption: image.caption ?? null,
    sort_order: index,
  }))

  const { data, error } = await supabase
    .from('gallery_images')
    .upsert(rows)
    .select('id, url, alt, caption')
    .order('sort_order')

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapGalleryImage)
}
