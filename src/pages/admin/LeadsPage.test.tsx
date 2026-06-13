import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LeadsPage } from './LeadsPage'

const mockExportMutate = vi.fn()
const mockUseAdminLeads = vi.fn()
const mockExportState = { isPending: false }

vi.mock('@/hooks/useLeads', () => ({
  useAdminLeads: () => mockUseAdminLeads(),
  useExportLeads: () => ({
    mutate: mockExportMutate,
    isPending: mockExportState.isPending,
  }),
}))

const sampleLead = {
  id: 'lead-1',
  type: 'partner' as const,
  name: 'Asha',
  email: 'asha@example.com',
  organization: 'NGO',
  message: 'Support',
  status: 'new' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('LeadsPage', () => {
  beforeEach(() => {
    mockUseAdminLeads.mockReturnValue({
      leads: [sampleLead],
      isLoading: false,
    })
    mockExportState.isPending = false
    mockExportMutate.mockReset()
  })

  it('renders leads table and filters', () => {
    render(<LeadsPage />)

    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
    expect(screen.getByText('Asha')).toBeInTheDocument()
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseAdminLeads.mockReturnValue({
      leads: [],
      isLoading: true,
    })

    render(<LeadsPage />)
    expect(screen.getByText('Loading leads...')).toBeInTheDocument()
  })

  it('updates filters', async () => {
    const user = userEvent.setup()
    render(<LeadsPage />)

    await user.type(screen.getByLabelText('Search'), 'asha')
    await user.selectOptions(screen.getByLabelText('Type'), 'partner')
    await user.selectOptions(screen.getByLabelText('Status'), 'new')

    expect(mockUseAdminLeads).toHaveBeenCalled()
  })

  it('shows exporting label while export is pending', () => {
    mockExportState.isPending = true
    render(<LeadsPage />)
    expect(screen.getByRole('button', { name: 'Exporting...' })).toBeDisabled()
  })

  it('triggers CSV export', async () => {
    const user = userEvent.setup()
    render(<LeadsPage />)

    await user.click(screen.getByRole('button', { name: 'Export CSV' }))
    expect(mockExportMutate).toHaveBeenCalled()
  })

  it('shows empty state when no leads match', () => {
    mockUseAdminLeads.mockReturnValue({
      leads: [],
      isLoading: false,
    })

    render(<LeadsPage />)
    expect(screen.getByText('No leads match the current filters.')).toBeInTheDocument()
  })
})
