import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddContributor,
  useAdminContributors,
  useDeleteContributor,
  useReorderContributors,
  useUpdateContributor,
} from '@/hooks/useContributors'
import type { Contributor } from '@/types/app.types'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'contribution', label: 'Contribution', type: 'textarea' as const },
  { key: 'photoUrl', label: 'Photo URL' },
]

export function ContributorsPage() {
  const { data: contributors = [], isLoading } = useAdminContributors()
  const addContributor = useAddContributor()
  const updateContributor = useUpdateContributor()
  const deleteContributor = useDeleteContributor()
  const reorderContributors = useReorderContributors()
  const isPending =
    addContributor.isPending ||
    updateContributor.isPending ||
    deleteContributor.isPending ||
    reorderContributors.isPending

  return (
    <SortableCredibilityAdmin<Contributor>
      title="Contributors"
      items={contributors}
      fields={fields}
      addLabel="Add contributor"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(contributor) => `${contributor.name} — ${contributor.contribution}`}
      mapItemToFormValues={(contributor) => ({
        name: contributor.name,
        contribution: contributor.contribution,
        photoUrl: contributor.photoUrl ?? '',
      })}
      onAdd={async (values) => {
        await addContributor.mutateAsync({
          name: String(values.name ?? ''),
          contribution: String(values.contribution ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
        })
      }}
      onUpdate={async (id, values) => {
        await updateContributor.mutateAsync({
          id,
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
