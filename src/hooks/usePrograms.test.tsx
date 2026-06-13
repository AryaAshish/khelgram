import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAddProgram,
  useAdminPrograms,
  useDeleteProgram,
  usePrograms,
  useReorderPrograms,
  useUpdateProgram,
} from './usePrograms'
import * as programsService from '@/services/programs.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/services/programs.service', () => ({
  getPublishedPrograms: vi.fn(),
  getAllPrograms: vi.fn(),
  addProgram: vi.fn(),
  updateProgram: vi.fn(),
  deleteProgram: vi.fn(),
  reorderPrograms: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('usePrograms', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(programsService.getPublishedPrograms).mockReset()
  })

  it('returns DB programs when available', async () => {
    vi.mocked(programsService.getPublishedPrograms).mockResolvedValue([
      {
        id: 'program-db',
        title: 'DB Program',
        description: 'Description',
        pillar: 'health',
        published: true,
        sortOrder: 1,
      },
    ])

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.programs[0]?.id).toBe('program-db')
  })

  it('returns empty list when DB returns empty', async () => {
    vi.mocked(programsService.getPublishedPrograms).mockResolvedValue([])

    const { result } = renderHook(() => usePrograms(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.programs).toEqual([])
  })

  it('loads admin programs', async () => {
    vi.mocked(programsService.getAllPrograms).mockResolvedValue([
      {
        id: 'program-admin',
        title: 'Admin Program',
        description: '',
        pillar: 'training',
        published: false,
        sortOrder: 0,
      },
    ])

    const { result } = renderHook(() => useAdminPrograms(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0]?.title).toBe('Admin Program')
  })

  it('mutates programs', async () => {
    vi.mocked(programsService.addProgram).mockResolvedValue({
      id: 'program-new',
      title: 'New',
      description: '',
      pillar: 'training',
      published: true,
      sortOrder: 1,
    })
    vi.mocked(programsService.updateProgram).mockResolvedValue({
      id: 'program-new',
      title: 'New',
      description: '',
      pillar: 'training',
      published: false,
      sortOrder: 1,
    })
    vi.mocked(programsService.deleteProgram).mockResolvedValue()
    vi.mocked(programsService.reorderPrograms).mockResolvedValue()

    const wrapper = createWrapper()
    const { result: addResult } = renderHook(() => useAddProgram(), { wrapper })
    await addResult.current.mutateAsync({
      title: 'New',
      pillar: 'training',
      published: true,
    })

    const { result: updateResult } = renderHook(() => useUpdateProgram(), { wrapper })
    await updateResult.current.mutateAsync({ id: 'program-new', published: false })

    const { result: deleteResult } = renderHook(() => useDeleteProgram(), { wrapper })
    await deleteResult.current.mutateAsync('program-new')

    const { result: reorderResult } = renderHook(() => useReorderPrograms(), { wrapper })
    await reorderResult.current.mutateAsync(['program-new'])

    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toasts when mutations fail', async () => {
    vi.mocked(programsService.addProgram).mockRejectedValue(new Error('add failed'))
    vi.mocked(programsService.updateProgram).mockRejectedValue(new Error('update failed'))
    vi.mocked(programsService.deleteProgram).mockRejectedValue(new Error('delete failed'))
    vi.mocked(programsService.reorderPrograms).mockRejectedValue(new Error('reorder failed'))

    const wrapper = createWrapper()

    await expect(
      renderHook(() => useAddProgram(), { wrapper }).result.current.mutateAsync({
        title: 'New',
        pillar: 'training',
        published: true,
      }),
    ).rejects.toThrow('add failed')

    await expect(
      renderHook(() => useUpdateProgram(), { wrapper }).result.current.mutateAsync({
        id: 'program-1',
        published: false,
      }),
    ).rejects.toThrow('update failed')

    await expect(
      renderHook(() => useDeleteProgram(), { wrapper }).result.current.mutateAsync('program-1'),
    ).rejects.toThrow('delete failed')

    await expect(
      renderHook(() => useReorderPrograms(), { wrapper }).result.current.mutateAsync(['program-1']),
    ).rejects.toThrow('reorder failed')

    expect(toast.error).toHaveBeenCalledTimes(4)
  })
})
