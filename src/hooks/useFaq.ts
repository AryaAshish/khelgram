import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as faqService from '@/services/faq.service'

export const faqKeys = {
  all: ['faq-items'] as const,
}

export function useFaq() {
  const query = useQuery({
    queryKey: faqKeys.all,
    queryFn: faqService.getFaqItems,
  })

  return {
    ...query,
    items: query.data ?? [],
  }
}

function useInvalidateFaq() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: faqKeys.all })
}

export function useAddFaqItem() {
  const invalidate = useInvalidateFaq()

  return useMutation({
    mutationFn: faqService.addFaqItem,
    onSuccess: () => {
      toast.success('FAQ item added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add FAQ item.'),
  })
}

export function useAdminFaq() {
  return useQuery({
    queryKey: [...faqKeys.all, 'admin'] as const,
    queryFn: faqService.getFaqItems,
  })
}

export function useUpdateFaqItem() {
  const invalidate = useInvalidateFaq()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof faqService.updateFaqItem>[1]) =>
      faqService.updateFaqItem(id, input),
    onSuccess: () => {
      toast.success('FAQ item updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update FAQ item.'),
  })
}

export function useDeleteFaqItem() {
  const invalidate = useInvalidateFaq()

  return useMutation({
    mutationFn: faqService.deleteFaqItem,
    onSuccess: () => {
      toast.success('FAQ item removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove FAQ item.'),
  })
}

export function useReorderFaqItems() {
  const invalidate = useInvalidateFaq()

  return useMutation({
    mutationFn: faqService.reorderFaqItems,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder FAQ items.'),
  })
}
