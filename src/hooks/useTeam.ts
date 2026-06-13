import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as teamService from '@/services/team.service'

export const teamKeys = {
  all: ['team-members'] as const,
  admin: () => [...teamKeys.all, 'admin'] as const,
}

export function useTeam() {
  const query = useQuery({
    queryKey: teamKeys.all,
    queryFn: teamService.getPublishedTeamMembers,
  })

  return {
    ...query,
    members: query.data ?? [],
  }
}

export function useAdminTeam() {
  return useQuery({
    queryKey: teamKeys.admin(),
    queryFn: teamService.getAllTeamMembers,
  })
}

function useInvalidateTeam() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: teamKeys.all })
}

export function useAddTeamMember() {
  const invalidate = useInvalidateTeam()

  return useMutation({
    mutationFn: teamService.addTeamMember,
    onSuccess: () => {
      toast.success('Team member added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add team member.'),
  })
}

export function useUpdateTeamMember() {
  const invalidate = useInvalidateTeam()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof teamService.updateTeamMember>[1]) =>
      teamService.updateTeamMember(id, input),
    onSuccess: () => {
      toast.success('Team member updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update team member.'),
  })
}

export function useDeleteTeamMember() {
  const invalidate = useInvalidateTeam()

  return useMutation({
    mutationFn: teamService.deleteTeamMember,
    onSuccess: () => {
      toast.success('Team member removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove team member.'),
  })
}

export function useReorderTeamMembers() {
  const invalidate = useInvalidateTeam()

  return useMutation({
    mutationFn: teamService.reorderTeamMembers,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder team members.'),
  })
}
