import { useQuery } from '@tanstack/react-query'
import * as galleryService from '@/services/gallery.service'

export const galleryKeys = {
  all: ['gallery-images'] as const,
}

export function useGallery() {
  const query = useQuery({
    queryKey: galleryKeys.all,
    queryFn: galleryService.getGalleryImages,
  })

  return {
    ...query,
    images: query.data ?? [],
  }
}
