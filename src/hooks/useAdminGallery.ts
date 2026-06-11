import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { galleryKeys } from '@/hooks/useGallery'
import * as galleryService from '@/services/gallery.service'
import type { GalleryImageDraft } from '@/types/app.types'

export function useSaveGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (images: GalleryImageDraft[]) => galleryService.saveGalleryImages(images),
    onSuccess: () => {
      toast.success('Gallery saved.')
      void queryClient.invalidateQueries({ queryKey: galleryKeys.all })
    },
    onError: () => {
      toast.error('Unable to save gallery.')
    },
  })
}
