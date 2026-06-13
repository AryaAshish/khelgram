import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useAdminLeads, useExportLeads, useSubmitLead } from './useLeads'
import * as leadsService from '@/services/leads.service'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/lib/exportCsv', () => ({ downloadCsv: vi.fn() }))
vi.mock('@/services/leads.service', () => ({
  submitLead: vi.fn(),
  getLeads: vi.fn(),
  filterLeads: vi.fn(),
  formatLeadsForCsv: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useLeads', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(toast.success).mockClear()
    vi.mocked(leadsService.submitLead).mockReset()
    vi.mocked(leadsService.getLeads).mockReset()
    vi.mocked(leadsService.filterLeads).mockReset()
    vi.mocked(leadsService.formatLeadsForCsv).mockReset()
  })

  it('submits partner lead successfully', async () => {
    vi.mocked(leadsService.submitLead).mockResolvedValue({
      id: 'lead-1',
      type: 'partner',
      name: 'Asha',
      email: 'asha@example.com',
      organization: 'NGO',
      message: 'Support',
      status: 'new',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const { result } = renderHook(() => useSubmitLead('partner'), { wrapper: createWrapper() })
    await result.current.mutateAsync({
      name: 'Asha',
      email: 'asha@example.com',
      organization: 'NGO',
      message: 'Support',
      phone: '',
    })

    expect(leadsService.submitLead).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows validation error for invalid volunteer lead', async () => {
    const { result } = renderHook(() => useSubmitLead('volunteer'), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        name: '',
        email: 'invalid',
        message: '',
        phone: '',
      }),
    ).rejects.toThrow()

    expect(toast.error).toHaveBeenCalled()
  })

  it('loads filtered admin leads', async () => {
    const leads = [
      {
        id: 'lead-1',
        type: 'partner' as const,
        name: 'Asha',
        email: 'asha@example.com',
        message: 'Support',
        status: 'new' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(leadsService.getLeads).mockResolvedValue(leads)
    vi.mocked(leadsService.filterLeads).mockReturnValue(leads)

    const { result } = renderHook(() => useAdminLeads({ type: 'partner' }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.leads).toEqual(leads)
  })

  it('shows error when export has no matching leads', async () => {
    vi.mocked(leadsService.getLeads).mockResolvedValue([])
    vi.mocked(leadsService.filterLeads).mockReturnValue([])

    const { result } = renderHook(() => useExportLeads({ type: 'partner' }), {
      wrapper: createWrapper(),
    })

    await expect(result.current.mutateAsync()).rejects.toThrow(
      'No leads match the current filters.',
    )
    expect(toast.error).toHaveBeenCalled()
  })

  it('submits volunteer lead with optional phone', async () => {
    vi.mocked(leadsService.submitLead).mockResolvedValue({
      id: 'lead-2',
      type: 'volunteer',
      name: 'Ravi',
      email: 'ravi@example.com',
      phone: '9876543210',
      message: 'Help',
      status: 'new',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const { result } = renderHook(() => useSubmitLead('volunteer'), { wrapper: createWrapper() })
    await result.current.mutateAsync({
      name: 'Ravi',
      email: 'ravi@example.com',
      phone: '9876543210',
      message: 'Help',
    })

    expect(leadsService.submitLead).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '9876543210' }),
    )
  })

  it('exports filtered leads to CSV', async () => {
    const leads = [
      {
        id: 'lead-1',
        type: 'volunteer' as const,
        name: 'Ravi',
        email: 'ravi@example.com',
        message: 'Help',
        status: 'new' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]
    vi.mocked(leadsService.getLeads).mockResolvedValue(leads)
    vi.mocked(leadsService.filterLeads).mockReturnValue(leads)
    vi.mocked(leadsService.formatLeadsForCsv).mockReturnValue([{ Name: 'Ravi' }])

    const { result } = renderHook(() => useExportLeads({}), { wrapper: createWrapper() })
    await result.current.mutateAsync()

    expect(toast.success).toHaveBeenCalled()
  })
})
