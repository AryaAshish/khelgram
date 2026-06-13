import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SponsorsPage } from './SponsorsPage'

const mockAdd = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminSponsors = vi.fn()

vi.mock('@/hooks/useSponsors', () => ({
  useAdminSponsors: () => mockUseAdminSponsors(),
  useAddSponsor: () => ({ mutateAsync: mockAdd, isPending: false }),
  useUpdateSponsor: () => ({ mutateAsync: mockUpdate, isPending: false }),
  useDeleteSponsor: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderSponsors: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('SponsorsPage', () => {
  beforeEach(() => {
    mockUseAdminSponsors.mockReturnValue({
      data: [
        { id: 's-1', name: 'Acme', tier: 'platinum', sortOrder: 0 },
        { id: 's-2', name: 'Beta', tier: 'gold', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
    mockUpdate.mockResolvedValue({})
  })

  it('adds sponsor with logo and website', async () => {
    const user = userEvent.setup()
    render(<SponsorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New Sponsor')
    await user.type(screen.getByLabelText('Logo URL'), 'https://example.com/logo.png')
    await user.type(screen.getByLabelText('Website'), 'https://sponsor.example')
    await user.click(screen.getByRole('button', { name: 'Add sponsor' }))
    expect(mockAdd).toHaveBeenCalledWith({
      name: 'New Sponsor',
      tier: 'community',
      logoUrl: 'https://example.com/logo.png',
      website: 'https://sponsor.example',
    })
  })

  it('adds sponsor from form', async () => {
    const user = userEvent.setup()
    render(<SponsorsPage />)
    await user.type(screen.getByLabelText('Name'), 'New Sponsor')
    await user.click(screen.getByRole('button', { name: 'Add sponsor' }))
    expect(mockAdd).toHaveBeenCalled()
  })

  it('edits sponsor from list', async () => {
    const user = userEvent.setup()
    render(<SponsorsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'Updated Sponsor')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(mockUpdate).toHaveBeenCalledWith({
      id: 's-1',
      name: 'Updated Sponsor',
      tier: 'platinum',
      logoUrl: undefined,
      website: undefined,
    })
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
