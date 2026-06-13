import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddTeamMember,
  useAdminTeam,
  useDeleteTeamMember,
  useReorderTeamMembers,
  useTeam,
  useUpdateTeamMember,
} from './useTeam'
import * as teamService from '@/services/team.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/team.service', () => ({
  getPublishedTeamMembers: vi.fn(),
  getAllTeamMembers: vi.fn(),
  addTeamMember: vi.fn(),
  updateTeamMember: vi.fn(),
  deleteTeamMember: vi.fn(),
  reorderTeamMembers: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTeam', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(teamService.getPublishedTeamMembers).mockReset()
  })

  it('returns DB team members when available', async () => {
    vi.mocked(teamService.getPublishedTeamMembers).mockResolvedValue([
      {
        id: 'team-db',
        name: 'DB Member',
        role: 'Director',
        bio: '',
        published: true,
        sortOrder: 0,
      },
    ])

    const { result } = renderHook(() => useTeam(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.members[0]?.id).toBe('team-db')
  })

  it('returns empty list when DB returns empty', async () => {
    vi.mocked(teamService.getPublishedTeamMembers).mockResolvedValue([])

    const { result } = renderHook(() => useTeam(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.members).toEqual([])
  })

  it('loads admin team members', async () => {
    vi.mocked(teamService.getAllTeamMembers).mockResolvedValue([
      {
        id: 'team-admin',
        name: 'Admin Member',
        role: 'Coach',
        bio: '',
        published: false,
        sortOrder: 0,
      },
    ])

    const { result } = renderHook(() => useAdminTeam(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0]?.name).toBe('Admin Member')
  })

  it('updates team member', async () => {
    vi.mocked(teamService.updateTeamMember).mockResolvedValue({
      id: 'team-1',
      name: 'Updated',
      role: 'Director',
      bio: '',
      published: true,
      sortOrder: 0,
    })
    const { result } = renderHook(() => useUpdateTeamMember(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ id: 'team-1', name: 'Updated' })
    expect(toast.success).toHaveBeenCalled()
  })

  it('mutates team members', async () => {
    vi.mocked(teamService.addTeamMember).mockResolvedValue({
      id: 'team-new',
      name: 'New',
      role: 'Coach',
      bio: '',
      published: true,
      sortOrder: 1,
    })
    vi.mocked(teamService.deleteTeamMember).mockResolvedValue()
    vi.mocked(teamService.reorderTeamMembers).mockResolvedValue()

    const wrapper = createWrapper()
    const { result: addResult } = renderHook(() => useAddTeamMember(), { wrapper })
    await addResult.current.mutateAsync({ name: 'New', role: 'Coach', published: true })

    const { result: deleteResult } = renderHook(() => useDeleteTeamMember(), { wrapper })
    await deleteResult.current.mutateAsync('team-new')

    const { result: reorderResult } = renderHook(() => useReorderTeamMembers(), { wrapper })
    await reorderResult.current.mutateAsync(['team-new'])

    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when mutations fail', async () => {
    vi.mocked(teamService.addTeamMember).mockRejectedValue(new Error('add failed'))
    vi.mocked(teamService.updateTeamMember).mockRejectedValue(new Error('update failed'))
    vi.mocked(teamService.deleteTeamMember).mockRejectedValue(new Error('delete failed'))
    vi.mocked(teamService.reorderTeamMembers).mockRejectedValue(new Error('reorder failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useAddTeamMember(), { wrapper }).result.current.mutateAsync({
        name: 'New',
        role: 'Coach',
        published: true,
      }),
    ).rejects.toThrow('add failed')

    await expect(
      renderHook(() => useUpdateTeamMember(), { wrapper }).result.current.mutateAsync({
        id: 'team-1',
        name: 'Fail',
      }),
    ).rejects.toThrow('update failed')

    await expect(
      renderHook(() => useDeleteTeamMember(), { wrapper }).result.current.mutateAsync('team-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderTeamMembers(), { wrapper }).result.current.mutateAsync(['team-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(4)
  })
})
