import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as mediaService from '@/services/media.service'

export const mediaLibraryKeys = {
  all: ['media-library'] as const,
  list: () => [...mediaLibraryKeys.all, 'list'] as const,
}

export function useMediaLibrary() {
  return useQuery({
    queryKey: mediaLibraryKeys.list(),
    queryFn: mediaService.listAssets,
  })
}

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => mediaService.uploadFile(file),
    onSuccess: () => {
      toast.success('Image uploaded.')
      void queryClient.invalidateQueries({ queryKey: mediaLibraryKeys.all })
    },
    onError: () => {
      toast.error('Unable to upload image.')
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (path: string) => mediaService.deleteFile(path),
    onSuccess: () => {
      toast.success('Image deleted.')
      void queryClient.invalidateQueries({ queryKey: mediaLibraryKeys.all })
    },
    onError: () => {
      toast.error('Unable to delete image.')
    },
  })
}
