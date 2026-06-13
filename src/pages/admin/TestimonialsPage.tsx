import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddTestimonial,
  useAdminTestimonials,
  useDeleteTestimonial,
  useReorderTestimonials,
  useUpdateTestimonial,
} from '@/hooks/useTestimonials'
import type { Testimonial } from '@/types/app.types'

const fields = [
  { key: 'quote', label: 'Quote', type: 'textarea' as const },
  { key: 'author', label: 'Author' },
  { key: 'relation', label: 'Relation' },
  { key: 'photoUrl', label: 'Photo URL' },
]

export function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useAdminTestimonials()
  const addTestimonial = useAddTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const reorderTestimonials = useReorderTestimonials()
  const isPending =
    addTestimonial.isPending ||
    updateTestimonial.isPending ||
    deleteTestimonial.isPending ||
    reorderTestimonials.isPending

  return (
    <SortableCredibilityAdmin<Testimonial>
      title="Testimonials"
      items={testimonials}
      fields={fields}
      addLabel="Add testimonial"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(testimonial) => `${testimonial.author}: ${testimonial.quote}`}
      mapItemToFormValues={(testimonial) => ({
        quote: testimonial.quote,
        author: testimonial.author,
        relation: testimonial.relation ?? '',
        photoUrl: testimonial.photoUrl ?? '',
      })}
      onAdd={async (values) => {
        await addTestimonial.mutateAsync({
          quote: String(values.quote ?? ''),
          author: String(values.author ?? ''),
          relation: String(values.relation ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
        })
      }}
      onUpdate={async (id, values) => {
        await updateTestimonial.mutateAsync({
          id,
          quote: String(values.quote ?? ''),
          author: String(values.author ?? ''),
          relation: String(values.relation ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
        })
      }}
      onDelete={async (id) => deleteTestimonial.mutateAsync(id)}
      onReorder={async (ids) => reorderTestimonials.mutateAsync(ids)}
    />
  )
}
