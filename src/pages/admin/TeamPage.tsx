import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddTeamMember,
  useAdminTeam,
  useDeleteTeamMember,
  useReorderTeamMembers,
  useUpdateTeamMember,
} from '@/hooks/useTeam'
import type { TeamMember } from '@/types/app.types'

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'bio', label: 'Bio', type: 'textarea' as const },
  { key: 'photoUrl', label: 'Photo URL' },
  { key: 'published', label: 'Published', type: 'checkbox' as const },
]

export function TeamPage() {
  const { data: members = [], isLoading } = useAdminTeam()
  const addMember = useAddTeamMember()
  const updateMember = useUpdateTeamMember()
  const deleteMember = useDeleteTeamMember()
  const reorderMembers = useReorderTeamMembers()
  const isPending =
    addMember.isPending ||
    updateMember.isPending ||
    deleteMember.isPending ||
    reorderMembers.isPending

  return (
    <SortableCredibilityAdmin<TeamMember>
      title="Team"
      items={members}
      fields={fields}
      addLabel="Add member"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(member) =>
        `${member.name} — ${member.role}${member.published ? '' : ' (draft)'}`
      }
      mapItemToFormValues={(member) => ({
        name: member.name,
        role: member.role,
        bio: member.bio ?? '',
        photoUrl: member.photoUrl ?? '',
        published: member.published,
      })}
      onAdd={async (values) => {
        await addMember.mutateAsync({
          name: String(values.name ?? ''),
          role: String(values.role ?? ''),
          bio: String(values.bio ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
          published: Boolean(values.published),
        })
      }}
      onUpdate={async (id, values) => {
        await updateMember.mutateAsync({
          id,
          name: String(values.name ?? ''),
          role: String(values.role ?? ''),
          bio: String(values.bio ?? ''),
          photoUrl: String(values.photoUrl ?? '') || undefined,
          published: Boolean(values.published),
        })
      }}
      onDelete={async (id) => deleteMember.mutateAsync(id)}
      onReorder={async (ids) => reorderMembers.mutateAsync(ids)}
    />
  )
}
