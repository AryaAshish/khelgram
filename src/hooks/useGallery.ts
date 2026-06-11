import { useQuery } from '@tanstack/react-query'
import { galleryImages as fallbackGalleryImages } from '@/fixtures/homePageFixtures'
import * as galleryService from '@/services/gallery.service'

export const galleryKeys = {
  all: ['gallery-images'] as const,
}

type UseGalleryOptions = {
  withFallback?: boolean
}

export function useGallery({ withFallback = true }: UseGalleryOptions = {}) {
  const query = useQuery({
    queryKey: galleryKeys.all,
    queryFn: galleryService.getGalleryImages,
  })

  const images =
    query.data && query.data.length > 0
      ? query.data
      : withFallback
        ? fallbackGalleryImages
        : (query.data ?? [])

  return {
    ...query,
    images,
  }
}
