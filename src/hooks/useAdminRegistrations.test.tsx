import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { RegistrationError } from '@/lib/errors'
import {
  useAdminRegistrations,
  useAdminCreateRegistration,
  usePromoteFromWaitlist,
  useRegistrationDetail,
  useResendConfirmation,
  useUpdateRegistrationStatus,
} from './useAdminRegistrations'
import * as gamesService from '@/services/games.service'
import * as registrationsService from '@/services/registrations.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/registrations.service', () => ({
  getRegistrations: vi.fn(),
  getRegistrationDetail: vi.fn(),
  updateRegistrationStatus: vi.fn(),
  createRegistration: vi.fn(),
  resolveGameRegistrationStatuses: vi.fn(),
  promoteFromWaitlist: vi.fn(),
  resendConfirmation: vi.fn(),
  filterRegistrations: vi.fn((registrations, filters) =>
    registrations.filter((registration: { childName: string }) =>
      filters.search ? registration.childName.includes(filters.search) : true,
    ),
  ),
}))

vi.mock('@/services/games.service', () => ({
  getAllGames: vi.fn(),
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
    vi.mocked(gamesService.getAllGames).mockResolvedValue([
      {
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
      },
    ])
    vi.mocked(registrationsService.resolveGameRegistrationStatuses).mockReturnValue({
      'game-1': 'confirmed',
    })
    vi.mocked(registrationsService.createRegistration).mockResolvedValue({
      id: 'reg-2',
      code: 'KG-2026-00002',
      status: 'confirmed',
    })
    vi.mocked(registrationsService.promoteFromWaitlist).mockResolvedValue({
      ...sampleRegistration,
      status: 'confirmed',
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

  it('creates admin registration with resolved game statuses', async () => {
    const { result } = renderHook(() => useAdminCreateRegistration(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      childName: 'Riya',
      age: '8',
      parentName: 'Anita',
      email: 'anita@example.com',
      phone: '8888888888',
      selectedEvents: ['Sack Race'],
    })

    expect(registrationsService.createRegistration).toHaveBeenCalledWith(
      expect.objectContaining({
        gameIds: ['game-1'],
        gameStatuses: { 'game-1': 'confirmed' },
      }),
    )
    expect(toast.success).toHaveBeenCalledWith('Registration KG-2026-00002 created (confirmed).')
  })

  it('promotes waitlisted registration', async () => {
    const { result } = renderHook(() => usePromoteFromWaitlist(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ registrationId: 'reg-1', gameId: 'game-1' })

    expect(registrationsService.promoteFromWaitlist).toHaveBeenCalledWith('reg-1', 'game-1')
    expect(toast.success).toHaveBeenCalledWith('Promoted KG-2026-00001 to confirmed.')
  })

  it('shows validation error toast for invalid admin registration input', async () => {
    const { result } = renderHook(() => useAdminCreateRegistration(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        childName: '',
        age: '',
        parentName: '',
        email: 'bad-email',
        phone: '',
        selectedEvents: [],
      }),
    ).rejects.toThrow()

    expect(toast.error).toHaveBeenCalled()
    expect(registrationsService.createRegistration).not.toHaveBeenCalled()
  })

  it('shows fallback error toast when promote fails unexpectedly', async () => {
    vi.mocked(registrationsService.promoteFromWaitlist).mockRejectedValueOnce(new Error('boom'))

    const { result } = renderHook(() => usePromoteFromWaitlist(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({ registrationId: 'reg-1', gameId: 'game-1' }),
    ).rejects.toThrow('boom')
    expect(toast.error).toHaveBeenCalledWith('Unable to promote registration.')
  })

  it('shows not-available error when selected event is missing for admin create', async () => {
    const { result } = renderHook(() => useAdminCreateRegistration(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        childName: 'Riya',
        age: '8',
        parentName: 'Anita',
        email: 'anita@example.com',
        phone: '8888888888',
        selectedEvents: ['Unknown Event'],
      }),
    ).rejects.toThrow('Event "Unknown Event" is not available.')

    expect(toast.error).toHaveBeenCalledWith('Event "Unknown Event" is not available.')
  })

  it('shows registration-specific error when promote fails with RegistrationError', async () => {
    vi.mocked(registrationsService.promoteFromWaitlist).mockRejectedValueOnce(
      new RegistrationError('Sack Race is still at capacity.'),
    )

    const { result } = renderHook(() => usePromoteFromWaitlist(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({ registrationId: 'reg-1', gameId: 'game-1' }),
    ).rejects.toThrow('Sack Race is still at capacity.')
    expect(toast.error).toHaveBeenCalledWith('Sack Race is still at capacity.')
  })

  it('shows generic error toast when admin create fails unexpectedly', async () => {
    vi.mocked(registrationsService.createRegistration).mockRejectedValueOnce(new Error('boom'))

    const { result } = renderHook(() => useAdminCreateRegistration(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        childName: 'Riya',
        age: '8',
        parentName: 'Anita',
        email: 'anita@example.com',
        phone: '8888888888',
        selectedEvents: ['Sack Race'],
      }),
    ).rejects.toThrow('boom')

    expect(toast.error).toHaveBeenCalledWith('Unable to create registration.')
  })

  it('resends confirmation email', async () => {
    vi.mocked(registrationsService.resendConfirmation).mockResolvedValue()
    const { result } = renderHook(() => useResendConfirmation(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync('reg-1')
    expect(registrationsService.resendConfirmation).toHaveBeenCalledWith('reg-1')
    expect(toast.success).toHaveBeenCalledWith('Confirmation email sent.')
  })

  it('shows generic error toast when resend fails unexpectedly', async () => {
    vi.mocked(registrationsService.resendConfirmation).mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useResendConfirmation(), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync('reg-1')).rejects.toThrow('boom')
    expect(toast.error).toHaveBeenCalledWith('Unable to send confirmation email.')
  })

  it('shows error toast when resend confirmation fails', async () => {
    vi.mocked(registrationsService.resendConfirmation).mockRejectedValue(
      new RegistrationError('Email service is not configured'),
    )
    const { result } = renderHook(() => useResendConfirmation(), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync('reg-1')).rejects.toThrow(
      'Email service is not configured',
    )
    expect(toast.error).toHaveBeenCalledWith('Email service is not configured')
  })

  it('does not fetch registration detail when id is empty', async () => {
    const { result } = renderHook(() => useRegistrationDetail(''), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(registrationsService.getRegistrationDetail).not.toHaveBeenCalled()
  })
})
