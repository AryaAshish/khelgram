import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardPage } from './DashboardPage'

const mockUseAdminPrograms = vi.fn()
const mockUseAdminLeads = vi.fn()
const mockUseRegistrationCount = vi.fn()
const mockUseGames = vi.fn()

vi.mock('@/hooks/usePrograms', () => ({
  useAdminPrograms: () => mockUseAdminPrograms(),
}))

vi.mock('@/hooks/useLeads', () => ({
  useAdminLeads: () => mockUseAdminLeads(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useRegistrationCount: () => mockUseRegistrationCount(),
}))

vi.mock('@/hooks/useGames', () => ({
  useGames: () => mockUseGames(),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    mockUseAdminPrograms.mockReturnValue({
      data: [
        { id: 'p1', title: 'Program 1', published: true },
        { id: 'p2', title: 'Program 2', published: false },
      ],
    })
    mockUseAdminLeads.mockReturnValue({
      leads: [{ id: 'lead-1' }, { id: 'lead-2' }],
    })
    mockUseRegistrationCount.mockReturnValue({ data: 24 })
    mockUseGames.mockReturnValue({
      games: [
        { id: 'g1', name: 'Race', capacity: 50, registeredCount: 30 },
        { id: 'g2', name: 'Jump', capacity: 20, registeredCount: 10 },
      ],
    })
  })

  it('renders organization and event summaries', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Published programs')).toBeInTheDocument()
    expect(screen.getByText('Open leads')).toBeInTheDocument()
    expect(screen.getByText('Registrations')).toBeInTheDocument()
    expect(screen.getByText('Game capacity')).toBeInTheDocument()
    expect(screen.getByText('40/70')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('2 total programs')).toBeInTheDocument()
  })

  it('shows registered count when games have no capacity', () => {
    mockUseGames.mockReturnValue({
      games: [{ id: 'g1', name: 'Race', registeredCount: 5 }],
    })

    render(<DashboardPage />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
