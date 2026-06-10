import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAdminRegistrations,
  useRegistrationDetail,
  useUpdateRegistrationStatus,
} from './useAdminRegistrations'
import * as registrationsService from '@/services/registrations.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/registrations.service', () => ({
  getRegistrations: vi.fn(),
  getRegistrationDetail: vi.fn(),
  updateRegistrationStatus: vi.fn(),
  filterRegistrations: vi.fn((registrations, filters) =>
    registrations.filter((registration: { childName: string }) =>
      filters.search ? registration.childName.includes(filters.search) : true,
    ),
  ),
}))

const sampleRegistration = {
  id: 'reg-1',
  code: 'KG-2026-00001',
  childName: 'Aarav',
  age: 9,
  parentName: 'Neha',
  email: 'neha@example.com',
  phone: '9999999999',
  status: 'confirmed' as const,
  createdAt: '2026-04-01T10:00:00.000Z',
  gameNames: ['Sack Race'],
  gameIds: ['game-1'],
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useAdminRegistrations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(registrationsService.getRegistrations).mockResolvedValue([sampleRegistration])
    vi.mocked(registrationsService.getRegistrationDetail).mockResolvedValue(sampleRegistration)
    vi.mocked(registrationsService.updateRegistrationStatus).mockResolvedValue({
      ...sampleRegistration,
      status: 'waitlisted',
    })
  })

  it('returns filtered registrations', async () => {
    const { result } = renderHook(() => useAdminRegistrations({ search: 'Aarav' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.registrations).toHaveLength(1)
  })

  it('loads registration detail by id', async () => {
    const { result } = renderHook(() => useRegistrationDetail('reg-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.code).toBe('KG-2026-00001')
  })

  it('shows error toast when status update fails', async () => {
    vi.mocked(registrationsService.updateRegistrationStatus).mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useUpdateRegistrationStatus(), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync({ id: 'reg-1', status: 'waitlisted' })).rejects.toThrow(
      'fail',
    )
    expect(toast.error).toHaveBeenCalled()
  })

  it('updates registration status and shows toast', async () => {
    const { result } = renderHook(() => useUpdateRegistrationStatus(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ id: 'reg-1', status: 'waitlisted' })

    expect(registrationsService.updateRegistrationStatus).toHaveBeenCalledWith(
      'reg-1',
      'waitlisted',
    )
    expect(toast.success).toHaveBeenCalled()
  })
})
