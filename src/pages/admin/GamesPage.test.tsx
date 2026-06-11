import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GamesPage } from './GamesPage'

const mockUseAdminGames = vi.fn()
const mockUpsertMutateAsync = vi.fn()
const mockDeleteMutateAsync = vi.fn()
const mockOpenMutate = vi.fn()
const mockCloseMutate = vi.fn()
const mockAdminCreateRegistrationMutateAsync = vi.fn()

vi.mock('@/hooks/useAdminGames', () => ({
  useAdminGames: () => mockUseAdminGames(),
  useUpsertGame: () => ({
    mutateAsync: mockUpsertMutateAsync,
    isPending: false,
  }),
  useDeleteGame: () => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  }),
  useOpenGame: () => ({
    mutate: mockOpenMutate,
    isPending: false,
  }),
  useCloseGame: () => ({
    mutate: mockCloseMutate,
    isPending: false,
  }),
}))

vi.mock('@/hooks/useAdminRegistrations', () => ({
  useAdminCreateRegistration: () => ({
    mutateAsync: mockAdminCreateRegistrationMutateAsync,
    isPending: false,
  }),
}))

const sampleGames = [
  {
    id: 'game-1',
    name: 'Sack Race',
    description: 'Hop',
    ageGroup: 'Ages 6-10',
    startTime: '10:00 AM',
    status: 'active' as const,
    capacity: 10,
    registeredCount: 2,
    preRegistrationAllowed: true,
  },
  {
    id: 'game-2',
    name: 'Relay Race',
    description: 'Pass baton',
    ageGroup: 'Ages 8-12',
    startTime: '11:00 AM',
    status: 'closed' as const,
    capacity: 6,
    registeredCount: 6,
    preRegistrationAllowed: true,
  },
]

describe('GamesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseAdminGames.mockReturnValue({ data: [], isLoading: true })
    render(<GamesPage />)
    expect(screen.getByText('Loading games...')).toBeInTheDocument()
  })

  it('shows game table row', () => {
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)
    expect(screen.getByRole('table')).toHaveTextContent('Sack Race')
  })

  it('edits game and saves numeric capacity', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.clear(screen.getByLabelText('Capacity'))
    await user.type(screen.getByLabelText('Capacity'), '12')
    await user.click(screen.getByRole('button', { name: 'Save game' }))

    expect(mockUpsertMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'game-1',
        name: 'Sack Race',
        capacity: 12,
      }),
    )
  })

  it('adds a new game', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getByRole('button', { name: 'Add game' }))
    await user.type(screen.getByLabelText('Name'), 'Kho Kho')
    await user.type(screen.getByLabelText('Description'), 'Tag game')
    await user.type(screen.getByLabelText('Age group'), 'Ages 7-12')
    await user.type(screen.getByLabelText('Start time'), '12:00 PM')
    await user.type(screen.getByLabelText('Capacity'), '30')
    await user.click(screen.getByRole('button', { name: 'Save game' }))

    expect(mockUpsertMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Kho Kho',
        capacity: 30,
      }),
    )
  })

  it('closes and opens games from table actions', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getByRole('button', { name: 'Close' }))
    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(mockCloseMutate).toHaveBeenCalledWith('game-1')
    expect(mockOpenMutate).toHaveBeenCalledWith('game-2')
  })

  it('confirms delete flow', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    mockDeleteMutateAsync.mockResolvedValue(undefined)
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }))

    expect(mockDeleteMutateAsync).toHaveBeenCalledWith('game-1')
  })

  it('submits manual registration for selected active game', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.selectOptions(screen.getByLabelText('Game'), 'game-1')
    await user.type(screen.getByLabelText('Child name'), 'Aarav')
    await user.type(screen.getByLabelText('Age'), '8')
    await user.type(screen.getByLabelText('Parent name'), 'Neha')
    await user.type(screen.getByLabelText('Email'), 'neha@example.com')
    await user.type(screen.getByLabelText('Phone'), '9999999999')
    await user.click(screen.getByRole('button', { name: 'Add registration' }))

    expect(mockAdminCreateRegistrationMutateAsync).toHaveBeenCalledWith({
      childName: 'Aarav',
      age: '8',
      parentName: 'Neha',
      email: 'neha@example.com',
      phone: '9999999999',
      selectedEvents: ['Sack Race'],
    })
  })

  it('does not submit manual registration when no game is selected', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getByRole('button', { name: 'Add registration' }))
    expect(mockAdminCreateRegistrationMutateAsync).not.toHaveBeenCalled()
  })

  it('hides closed games from manual registration dropdown', () => {
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toContain('Sack Race')
    expect(options).not.toContain('Relay Race')
  })

  it('cancels delete confirmation', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    expect(screen.getByText('Delete this game permanently?')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Cancel' })[0]!)
    expect(screen.queryByText('Delete this game permanently?')).not.toBeInTheDocument()
  })

  it('shows unlimited capacity label for games without capacity', () => {
    mockUseAdminGames.mockReturnValue({
      data: [{ ...sampleGames[0]!, capacity: undefined }],
      isLoading: false,
    })
    render(<GamesPage />)
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })

  it('saves game without capacity when capacity field is cleared', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.clear(screen.getByLabelText('Capacity'))
    await user.click(screen.getByRole('button', { name: 'Save game' }))

    expect(mockUpsertMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        capacity: undefined,
      }),
    )
  })

  it('updates icon and pre-registration checkbox when editing', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.selectOptions(screen.getByLabelText('Icon'), 'trophy')
    await user.click(screen.getByLabelText('Allow during pre-registration'))
    await user.click(screen.getByRole('button', { name: 'Save game' }))

    expect(mockUpsertMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'trophy',
        preRegistrationAllowed: false,
      }),
    )
  })

  it('cancels game form while editing', async () => {
    const user = userEvent.setup()
    mockUseAdminGames.mockReturnValue({ data: sampleGames, isLoading: false })
    render(<GamesPage />)

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    expect(screen.getByText('Edit Sack Race')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Cancel' })[0]!)
    expect(screen.queryByText('Edit Sack Race')).not.toBeInTheDocument()
  })
})
