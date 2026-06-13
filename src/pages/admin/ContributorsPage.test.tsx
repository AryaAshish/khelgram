import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContributorsPage } from './ContributorsPage'

const mockAdd = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminContributors = vi.fn()

vi.mock('@/hooks/useContributors', () => ({
  useAdminContributors: () => mockUseAdminContributors(),
  useAddContributor: () => ({ mutateAsync: mockAdd, isPending: false }),
  useUpdateContributor: () => ({ mutateAsync: mockUpdate, isPending: false }),
  useDeleteContributor: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderContributors: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('ContributorsPage', () => {
  beforeEach(() => {
    mockUseAdminContributors.mockReturnValue({
      data: [
        { id: 'c-1', name: 'School', contribution: 'Venue', sortOrder: 0 },
        { id: 'c-2', name: 'Club', contribution: 'Coaching', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
    mockUpdate.mockResolvedValue({})
  })

  it('adds contributor with optional photo URL', async () => {
    const user = userEvent.setup()
    render(<ContributorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New School')
    await user.type(screen.getByLabelText('Contribution'), 'Support')
    await user.type(screen.getByLabelText('Photo URL'), 'https://example.com/photo.jpg')
    await user.click(screen.getByRole('button', { name: 'Add contributor' }))
    expect(mockAdd).toHaveBeenCalledWith({
      name: 'New School',
      contribution: 'Support',
      photoUrl: 'https://example.com/photo.jpg',
    })
  })

  it('adds contributor from form', async () => {
    const user = userEvent.setup()
    render(<ContributorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New School')
    await user.type(screen.getByLabelText('Contribution'), 'Support')
    await user.click(screen.getByRole('button', { name: 'Add contributor' }))
    expect(mockAdd).toHaveBeenCalled()
  })

  it('edits contributor from list', async () => {
    const user = userEvent.setup()
    render(<ContributorsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'Updated School')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(mockUpdate).toHaveBeenCalledWith({
      id: 'c-1',
      name: 'Updated School',
      contribution: 'Venue',
      photoUrl: undefined,
    })
  })

  it('deletes and reorders contributors', async () => {
    const user = userEvent.setup()
    render(<ContributorsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('c-1')
    expect(mockReorder).toHaveBeenCalled()
  })
})
