import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as programsService from '@/services/programs.service'
import type { ProgramPillar } from '@/types/app.types'

export const programKeys = {
  all: ['programs'] as const,
  admin: () => [...programKeys.all, 'admin'] as const,
}

export function usePrograms() {
  const query = useQuery({
    queryKey: programKeys.all,
    queryFn: programsService.getPublishedPrograms,
  })

  return {
    ...query,
    programs: query.data ?? [],
  }
}

export function useAdminPrograms() {
  return useQuery({
    queryKey: programKeys.admin(),
    queryFn: programsService.getAllPrograms,
  })
}

function useInvalidatePrograms() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: programKeys.all })
    void queryClient.invalidateQueries({ queryKey: programKeys.admin() })
  }
}

export function useAddProgram() {
  const invalidate = useInvalidatePrograms()

  return useMutation({
    mutationFn: programsService.addProgram,
    onSuccess: () => {
      toast.success('Program added.')
      invalidate()
    },
    onError: () => toast.error('Unable to add program.'),
  })
}

export function useUpdateProgram() {
  const invalidate = useInvalidatePrograms()

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string
      title?: string
      description?: string
      pillar?: ProgramPillar
      icon?: string
      published?: boolean
      ctaLabel?: string
      ctaUrl?: string
    }) => programsService.updateProgram(id, input),
    onSuccess: () => {
      toast.success('Program updated.')
      invalidate()
    },
    onError: () => toast.error('Unable to update program.'),
  })
}

export function useDeleteProgram() {
  const invalidate = useInvalidatePrograms()

  return useMutation({
    mutationFn: programsService.deleteProgram,
    onSuccess: () => {
      toast.success('Program removed.')
      invalidate()
    },
    onError: () => toast.error('Unable to remove program.'),
  })
}

export function useReorderPrograms() {
  const invalidate = useInvalidatePrograms()

  return useMutation({
    mutationFn: programsService.reorderPrograms,
    onSuccess: invalidate,
    onError: () => toast.error('Unable to reorder programs.'),
  })
}
