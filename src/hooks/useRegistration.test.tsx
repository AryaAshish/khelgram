import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useCreateRegistration, useRegistrationCount } from './useRegistration'
import * as gamesService from '@/services/games.service'
import * as registrationsService from '@/services/registrations.service'
import { RegistrationError } from '@/lib/errors'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/services/games.service', () => ({
  getGames: vi.fn(),
}))

vi.mock('@/services/registrations.service', () => ({
  checkDuplicate: vi.fn(),
  resolveGameRegistrationStatuses: vi.fn(),
  createRegistration: vi.fn(),
  getRegistrationCount: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const validInput = {
  childName: 'Aarav',
  age: '9',
  parentName: 'Neha',
  email: 'neha@example.com',
  phone: '9999999999',
  selectedEvents: ['Sack Race'],
}

describe('useRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(gamesService.getGames).mockResolvedValue([
      {
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
        capacity: 10,
        registeredCount: 0,
      },
    ])
    vi.mocked(registrationsService.checkDuplicate).mockResolvedValue(false)
    vi.mocked(registrationsService.createRegistration).mockResolvedValue({
      id: 'reg-1',
      code: 'KG-2026-12345',
      status: 'confirmed',
    })
    vi.mocked(registrationsService.resolveGameRegistrationStatuses).mockReturnValue({
      'game-1': 'confirmed',
    })
    vi.mocked(registrationsService.getRegistrationCount).mockResolvedValue(5)
  })

  it('useRegistrationCount returns count from service', async () => {
    const { result } = renderHook(() => useRegistrationCount(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe(5)
  })

  it('useCreateRegistration succeeds and shows success toast', async () => {
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await result.current.mutateAsync(validInput)

    expect(registrationsService.createRegistration).toHaveBeenCalled()
    expect(registrationsService.createRegistration).toHaveBeenCalledWith(
      expect.objectContaining({
        gameStatuses: { 'game-1': 'confirmed' },
      }),
    )
    expect(toast.success).toHaveBeenCalledWith(
      'Registration confirmed! Your code is KG-2026-12345.',
    )
  })

  it('useCreateRegistration blocks duplicate registrations', async () => {
    vi.mocked(registrationsService.checkDuplicate).mockResolvedValue(true)
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync(validInput)).rejects.toBeInstanceOf(RegistrationError)
    expect(registrationsService.createRegistration).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })

  it('useCreateRegistration blocks invalid input', async () => {
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        ...validInput,
        selectedEvents: [],
      }),
    ).rejects.toBeInstanceOf(RegistrationError)

    expect(registrationsService.createRegistration).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })

  it('useCreateRegistration blocks unknown event names', async () => {
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        ...validInput,
        selectedEvents: ['Missing Event'],
      }),
    ).rejects.toBeInstanceOf(RegistrationError)

    expect(toast.error).toHaveBeenCalled()
  })

  it('useCreateRegistration shows generic error toast for unexpected failures', async () => {
    vi.mocked(registrationsService.createRegistration).mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync(validInput)).rejects.toThrow('network')
    expect(toast.error).toHaveBeenCalledWith('Registration failed. Please try again.')
  })

  it('useCreateRegistration waitlists when game is full', async () => {
    vi.mocked(registrationsService.resolveGameRegistrationStatuses).mockReturnValue({
      'game-1': 'waitlisted',
    })
    vi.mocked(registrationsService.createRegistration).mockResolvedValue({
      id: 'reg-1',
      code: 'KG-2026-12345',
      status: 'waitlisted',
    })
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await result.current.mutateAsync(validInput)
    expect(toast.success).toHaveBeenCalledWith(
      "You're on the waitlist. We'll contact you if a spot opens. Your code is KG-2026-12345.",
    )
  })

  it('useCreateRegistration blocks when event registration is closed', async () => {
    const { result } = renderHook(() => useCreateRegistration('registration_closed'), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync(validInput)).rejects.toBeInstanceOf(RegistrationError)
    expect(toast.error).toHaveBeenCalledWith('Registration is currently closed.')
    expect(registrationsService.createRegistration).not.toHaveBeenCalled()
  })

  it('useCreateRegistration uses fallback game name in duplicate error', async () => {
    vi.mocked(gamesService.getGames).mockResolvedValue([
      {
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
      },
    ])
    vi.mocked(registrationsService.checkDuplicate).mockResolvedValue(true)
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync(validInput)).rejects.toBeInstanceOf(RegistrationError)
    expect(toast.error).toHaveBeenCalledWith('You are already registered for Sack Race.')
  })

  it('useCreateRegistration supports pre-registration filtering by game flag', async () => {
    vi.mocked(gamesService.getGames).mockResolvedValue([
      {
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
        preRegistrationAllowed: false,
      },
    ])
    const { result } = renderHook(() => useCreateRegistration('pre_registration'), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync(validInput)).rejects.toBeInstanceOf(RegistrationError)
    expect(toast.error).toHaveBeenCalled()
  })
})
