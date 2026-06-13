import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { successStories as fallbackStories } from '@/fixtures/successStoriesFixtures'
import * as successStoriesService from '@/services/successStories.service'

export const successStoryKeys = {
  all: ['successStories'] as const,
  admin: () => [...successStoryKeys.all, 'admin'] as const,
}

export function useSuccessStories() {
  const query = useQuery({
    queryKey: successStoryKeys.all,
    queryFn: successStoriesService.getPublishedSuccessStories,
  })

  return {
    ...query,
    stories: query.data?.length ? query.data : fallbackStories,
  }
}

export function useAdminSuccessStories() {
  return useQuery({
    queryKey: successStoryKeys.admin(),
    queryFn: successStoriesService.getAllSuccessStories,
  })
}

function useInvalidateSuccessStories() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: successStoryKeys.all })
    void queryClient.invalidateQueries({ queryKey: successStoryKeys.admin() })
  }
}

export function useAddSuccessStory() {
  const invalidate = useInvalidateSuccessStories()

  return useMutation({
    mutationFn: successStoriesService.addSuccessStory,
    onSuccess: () => {
      toast.success('Story added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add story.'),
  })
}

export function useUpdateSuccessStory() {
  const invalidate = useInvalidateSuccessStories()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string
      title?: string
      summary?: string
      story?: string
      imageUrl?: string
      published?: boolean
    }) => successStoriesService.updateSuccessStory(id, input),
    onSuccess: () => {
      toast.success('Story updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update story.'),
  })
}

export function useDeleteSuccessStory() {
  const invalidate = useInvalidateSuccessStories()

  return useMutation({
    mutationFn: successStoriesService.deleteSuccessStory,
    onSuccess: () => {
      toast.success('Story removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove story.'),
  })
}

export function useReorderSuccessStories() {
  const invalidate = useInvalidateSuccessStories()

  return useMutation({
    mutationFn: successStoriesService.reorderSuccessStories,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder stories.'),
  })
}
