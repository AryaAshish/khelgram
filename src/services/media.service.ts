import { supabase } from '@/lib/supabase'
import { MediaError } from '@/lib/errors'
import type { MediaAsset } from '@/types/app.types'
import type { Database } from '@/types/database.types'

const MEDIA_BUCKET = 'media'

type MediaAssetRow = Pick<
  Database['public']['Tables']['media_assets']['Row'],
  'id' | 'path' | 'url' | 'alt' | 'size' | 'created_at'
>

function mapMediaAsset(row: MediaAssetRow): MediaAsset {
  return {
    id: row.id,
    path: row.path,
    url: row.url,
    alt: row.alt,
    size: row.size,
    createdAt: row.created_at,
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-')
}

function buildStoragePath(fileName: string): string {
  return `${Date.now()}-${sanitizeFileName(fileName)}`
}

function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function listAssets(): Promise<MediaAsset[]> {
  const { data, error } = await supabase
    .from('media_assets')
    .select('id, path, url, alt, size, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new MediaError(error.message)
  }

  return (data ?? []).map(mapMediaAsset)
}

export async function uploadFile(file: File): Promise<MediaAsset> {
  const path = buildStoragePath(file.name)
  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (uploadError) {
    throw new MediaError(uploadError.message)
  }

  const url = getPublicUrl(path)
  const id = crypto.randomUUID()
  const alt = sanitizeFileName(file.name)

  const { data, error } = await supabase
    .from('media_assets')
    .insert({
      id,
      path,
      url,
      alt,
      size: file.size,
    })
    .select('id, path, url, alt, size, created_at')
    .single()

  if (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path])
    throw new MediaError(error.message)
  }

  return mapMediaAsset(data)
}

export async function deleteFile(path: string): Promise<void> {
  const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([path])

  if (storageError) {
    throw new MediaError(storageError.message)
  }

  const { error } = await supabase.from('media_assets').delete().eq('path', path)

  if (error) {
    throw new MediaError(error.message)
  }
}
