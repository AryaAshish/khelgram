import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContributorsPage } from './ContributorsPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseContributors = vi.fn()

vi.mock('@/hooks/useContributors', () => ({
  useContributors: () => mockUseContributors(),
  useAddContributor: () => ({ mutateAsync: mockAdd, isPending: false }),
  useDeleteContributor: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderContributors: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('ContributorsPage', () => {
  beforeEach(() => {
    mockUseContributors.mockReturnValue({
      contributors: [
        { id: 'c-1', name: 'School', contribution: 'Venue', sortOrder: 0 },
        { id: 'c-2', name: 'Club', contribution: 'Coaching', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
  })

  it('adds contributor from form', async () => {
    const user = userEvent.setup()
    render(<ContributorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New School')
    await user.type(screen.getByLabelText('Contribution'), 'Support')
    await user.click(screen.getByRole('button', { name: 'Add contributor' }))
    expect(mockAdd).toHaveBeenCalled()
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
