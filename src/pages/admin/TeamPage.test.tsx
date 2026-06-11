import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TeamPage } from './TeamPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminTeam = vi.fn()

vi.mock('@/hooks/useTeam', () => ({
  useAdminTeam: () => mockUseAdminTeam(),
  useAddTeamMember: () => ({
    mutateAsync: mockAdd,
    isPending: false,
  }),
  useDeleteTeamMember: () => ({
    mutateAsync: mockDelete,
    isPending: false,
  }),
  useReorderTeamMembers: () => ({
    mutateAsync: mockReorder,
    isPending: false,
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('TeamPage', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockDelete.mockReset()
    mockReorder.mockReset()
    mockUseAdminTeam.mockReturnValue({
      data: [
        {
          id: 'team-1',
          name: 'Priya Sharma',
          role: 'Director',
          bio: 'Bio',
          published: true,
          sortOrder: 0,
        },
        {
          id: 'team-2',
          name: 'Draft Member',
          role: 'Volunteer',
          published: false,
          sortOrder: 1,
        },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
    mockDelete.mockResolvedValue(undefined)
    mockReorder.mockResolvedValue(undefined)
  })

  it('renders team members with draft label', () => {
    render(<TeamPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Priya Sharma — Director')).toBeInTheDocument()
    expect(screen.getByText('Draft Member — Volunteer (draft)')).toBeInTheDocument()
  })

  it('adds a team member with optional photo URL', async () => {
    const user = userEvent.setup()
    render(<TeamPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Name'), 'Photo Member')
    await user.type(screen.getByLabelText('Role'), 'Coach')
    await user.type(screen.getByLabelText('Photo URL'), 'https://example.com/photo.jpg')
    await user.click(screen.getByRole('button', { name: 'Add member' }))

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        photoUrl: 'https://example.com/photo.jpg',
      }),
    )
  })

  it('adds a team member through mutation', async () => {
    const user = userEvent.setup()
    render(<TeamPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Name'), 'New Member')
    await user.type(screen.getByLabelText('Role'), 'Coach')
    await user.type(screen.getByLabelText('Bio'), 'Bio text')
    await user.click(screen.getByLabelText('Published'))
    await user.click(screen.getByRole('button', { name: 'Add member' }))

    expect(mockAdd).toHaveBeenCalledWith({
      name: 'New Member',
      role: 'Coach',
      bio: 'Bio text',
      photoUrl: undefined,
      published: true,
    })
  })

  it('reorders and deletes team members', async () => {
    const user = userEvent.setup()
    render(<TeamPage />, { wrapper: createWrapper() })

    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockReorder).toHaveBeenCalledWith(['team-2', 'team-1'])

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('team-1')
  })
})
