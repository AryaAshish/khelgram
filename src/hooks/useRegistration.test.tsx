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
  assertCapacity: vi.fn(),
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
        capacity: 10,
        registeredCount: 0,
      },
    ])
    vi.mocked(registrationsService.checkDuplicate).mockResolvedValue(false)
    vi.mocked(registrationsService.createRegistration).mockResolvedValue({
      id: 'reg-1',
      code: 'KG-2026-12345',
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

  it('useCreateRegistration blocks when capacity assertion fails', async () => {
    vi.mocked(registrationsService.assertCapacity).mockImplementation(() => {
      throw new RegistrationError('Sack Race is full. Please choose another event.')
    })
    const { result } = renderHook(() => useCreateRegistration(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync(validInput)).rejects.toBeInstanceOf(RegistrationError)
    expect(toast.error).toHaveBeenCalledWith('Sack Race is full. Please choose another event.')
  })
})
