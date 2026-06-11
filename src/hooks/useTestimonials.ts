import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { testimonials as fallbackTestimonials } from '@/fixtures/credibilityFixtures'
import * as testimonialsService from '@/services/testimonials.service'

export const testimonialKeys = {
  all: ['testimonials'] as const,
}

export function useTestimonials() {
  const query = useQuery({
    queryKey: testimonialKeys.all,
    queryFn: testimonialsService.getTestimonials,
  })

  return {
    ...query,
    testimonials: query.data?.length ? query.data : fallbackTestimonials,
  }
}

function useInvalidateTestimonials() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: testimonialKeys.all })
}

export function useAddTestimonial() {
  const invalidate = useInvalidateTestimonials()

  return useMutation({
    mutationFn: testimonialsService.addTestimonial,
    onSuccess: () => {
      toast.success('Testimonial added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add testimonial.'),
  })
}

export function useDeleteTestimonial() {
  const invalidate = useInvalidateTestimonials()

  return useMutation({
    mutationFn: testimonialsService.deleteTestimonial,
    onSuccess: () => {
      toast.success('Testimonial removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove testimonial.'),
  })
}

export function useReorderTestimonials() {
  const invalidate = useInvalidateTestimonials()

  return useMutation({
    mutationFn: testimonialsService.reorderTestimonials,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder testimonials.'),
  })
}
