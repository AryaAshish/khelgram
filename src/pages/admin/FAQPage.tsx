import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddFaqItem,
  useAdminFaq,
  useDeleteFaqItem,
  useReorderFaqItems,
  useUpdateFaqItem,
} from '@/hooks/useFaq'
import type { FaqItem } from '@/types/app.types'

const fields = [
  { key: 'question', label: 'Question' },
  { key: 'answer', label: 'Answer', type: 'textarea' as const },
]

export function FAQPage() {
  const { data: items = [], isLoading } = useAdminFaq()
  const addItem = useAddFaqItem()
  const updateItem = useUpdateFaqItem()
  const deleteItem = useDeleteFaqItem()
  const reorderItems = useReorderFaqItems()
  const isPending =
    addItem.isPending || updateItem.isPending || deleteItem.isPending || reorderItems.isPending

  return (
    <SortableCredibilityAdmin<FaqItem>
      title="FAQ"
      items={items}
      fields={fields}
      addLabel="Add FAQ"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(item) => item.question}
      mapItemToFormValues={(item) => ({
        question: item.question,
        answer: item.answer,
      })}
      onAdd={async (values) => {
        await addItem.mutateAsync({
          question: String(values.question ?? ''),
          answer: String(values.answer ?? ''),
        })
      }}
      onUpdate={async (id, values) => {
        await updateItem.mutateAsync({
          id,
          question: String(values.question ?? ''),
          answer: String(values.answer ?? ''),
        })
      }}
      onDelete={async (id) => deleteItem.mutateAsync(id)}
      onReorder={async (ids) => reorderItems.mutateAsync(ids)}
    />
  )
}
