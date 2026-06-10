import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegistrationsPage } from './RegistrationsPage'

const mockExportMutate = vi.fn()
const mockUseAdminRegistrations = vi.fn()

vi.mock('@/hooks/useAdminRegistrations', () => ({
  useAdminRegistrations: () => mockUseAdminRegistrations(),
}))

vi.mock('@/hooks/useExportRegistrations', () => ({
  useExportRegistrations: () => ({
    mutate: mockExportMutate,
    isPending: false,
  }),
}))

vi.mock('@/hooks/useGames', () => ({
  useGames: () => ({
    games: [{ id: 'game-1', name: 'Sack Race', description: '', ageGroup: '', startTime: '' }],
  }),
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

describe('RegistrationsPage', () => {
  beforeEach(() => {
    mockUseAdminRegistrations.mockReturnValue({
      registrations: [sampleRegistration],
      isLoading: false,
    })
  })

  it('shows loading and empty states', () => {
    mockUseAdminRegistrations.mockReturnValue({
      registrations: [],
      isLoading: true,
    })
    const { rerender } = render(
      <MemoryRouter>
        <RegistrationsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Loading registrations...')).toBeInTheDocument()

    mockUseAdminRegistrations.mockReturnValue({
      registrations: [],
      isLoading: false,
    })
    rerender(
      <MemoryRouter>
        <RegistrationsPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('No registrations match the current filters.')).toBeInTheDocument()
  })

  it('renders table rows, filters, and triggers export', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <RegistrationsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Aarav')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Search'), 'aarav')
    await user.selectOptions(screen.getByLabelText('Game'), 'game-1')
    await user.selectOptions(screen.getByLabelText('Status'), 'confirmed')
    await user.click(screen.getByRole('button', { name: 'Export .xlsx' }))
    expect(mockExportMutate).toHaveBeenCalled()
  })
})
