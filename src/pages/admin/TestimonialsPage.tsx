import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddTestimonial,
  useDeleteTestimonial,
  useReorderTestimonials,
  useTestimonials,
} from '@/hooks/useTestimonials'
import type { Testimonial } from '@/types/app.types'

const fields = [
  { key: 'quote', label: 'Quote', type: 'textarea' as const },
  { key: 'author', label: 'Author' },
  { key: 'relation', label: 'Relation' },
  { key: 'photoUrl', label: 'Photo URL' },
]

export function TestimonialsPage() {
  const { testimonials, isLoading } = useTestimonials()
  const addTestimonial = useAddTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const reorderTestimonials = useReorderTestimonials()
  const isPending =
    addTestimonial.isPending || deleteTestimonial.isPending || reorderTestimonials.isPending

  return (
    <SortableCredibilityAdmin<Testimonial>
      title="Testimonials"
      items={testimonials}
      fields={fields}
      addLabel="Add testimonial"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(testimonial) => `${testimonial.author}: ${testimonial.quote}`}
      onAdd={async (values) => {
        await addTestimonial.mutateAsync({
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
