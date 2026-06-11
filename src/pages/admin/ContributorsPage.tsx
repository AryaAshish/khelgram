import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddContributor,
  useContributors,
  useDeleteContributor,
  useReorderContributors,
} from '@/hooks/useContributors'
import type { Contributor } from '@/types/app.types'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'contribution', label: 'Contribution', type: 'textarea' as const },
  { key: 'photoUrl', label: 'Photo URL' },
]

export function ContributorsPage() {
  const { contributors, isLoading } = useContributors()
  const addContributor = useAddContributor()
  const deleteContributor = useDeleteContributor()
  const reorderContributors = useReorderContributors()
  const isPending =
    addContributor.isPending || deleteContributor.isPending || reorderContributors.isPending

  return (
    <SortableCredibilityAdmin<Contributor>
      title="Contributors"
      items={contributors}
      fields={fields}
      addLabel="Add contributor"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(contributor) => `${contributor.name} — ${contributor.contribution}`}
      onAdd={async (values) => {
        await addContributor.mutateAsync({
          name: String(values.name ?? ''),
          contribution: String(values.contribution ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
        })
      }}
      onDelete={async (id) => deleteContributor.mutateAsync(id)}
      onReorder={async (ids) => reorderContributors.mutateAsync(ids)}
    />
  )
}
