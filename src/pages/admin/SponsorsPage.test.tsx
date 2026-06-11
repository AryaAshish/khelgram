import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SponsorsPage } from './SponsorsPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseSponsors = vi.fn()

vi.mock('@/hooks/useSponsors', () => ({
  useSponsors: () => mockUseSponsors(),
  useAddSponsor: () => ({ mutateAsync: mockAdd, isPending: false }),
  useDeleteSponsor: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderSponsors: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('SponsorsPage', () => {
  beforeEach(() => {
    mockUseSponsors.mockReturnValue({
      sponsors: [
        { id: 's-1', name: 'Acme', tier: 'platinum', sortOrder: 0 },
        { id: 's-2', name: 'Beta', tier: 'gold', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
  })

  it('adds sponsor from form', async () => {
    const user = userEvent.setup()
    render(<SponsorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New Sponsor')
    await user.click(screen.getByRole('button', { name: 'Add sponsor' }))
    expect(mockAdd).toHaveBeenCalled()
  })

  it('deletes and reorders sponsors', async () => {
    const user = userEvent.setup()
    render(<SponsorsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getAllByRole('button', { name: 'Up' })[1]!)
    expect(mockDelete).toHaveBeenCalledWith('s-1')
    expect(mockReorder).toHaveBeenCalled()
  })
})
