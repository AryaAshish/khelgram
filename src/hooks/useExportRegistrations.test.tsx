import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { useExportRegistrations } from './useExportRegistrations'
import * as registrationsService from '@/services/registrations.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}))

vi.mock('@/services/registrations.service', () => ({
  getRegistrations: vi.fn(),
  filterRegistrations: vi.fn((registrations) => registrations),
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

describe('useExportRegistrations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(registrationsService.getRegistrations).mockResolvedValue([sampleRegistration])
  })

  it('exports filtered registrations to xlsx', async () => {
    const { result } = renderHook(() => useExportRegistrations({}), { wrapper: createWrapper() })

    await result.current.mutateAsync()

    expect(XLSX.writeFile).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Exported 1 registrations.')
  })

  it('shows error toast when export has no rows', async () => {
    vi.mocked(registrationsService.getRegistrations).mockResolvedValue([])
    vi.mocked(registrationsService.filterRegistrations).mockReturnValue([])

    const { result } = renderHook(() => useExportRegistrations({ search: 'missing' }), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync()).rejects.toThrow('No registrations match')
    expect(toast.error).toHaveBeenCalled()
  })
})
