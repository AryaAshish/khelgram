import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImpactStatsPage } from './ImpactStatsPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseImpactStats = vi.fn()

vi.mock('@/hooks/useImpactStats', () => ({
  useImpactStats: () => mockUseImpactStats(),
}))

vi.mock('@/hooks/useAdminImpactStats', () => ({
  useAddImpactStat: () => ({ mutateAsync: mockAdd, isPending: false }),
  useDeleteImpactStat: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderImpactStats: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('ImpactStatsPage', () => {
  beforeEach(() => {
    mockUseImpactStats.mockReturnValue({
      impactStats: [
        { id: 'children', value: '500+', label: 'Children', sortOrder: 0 },
        { id: 'games', value: '15+', label: 'Games', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
  })

  it('adds impact stat from form', async () => {
    const user = userEvent.setup()
    render(<ImpactStatsPage />)
    await user.type(screen.getByLabelText('Value'), '100+')
    await user.type(screen.getByLabelText('Label'), 'Schools')
    await user.click(screen.getByRole('button', { name: 'Add stat' }))
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '100+',
        label: 'Schools',
        scope: 'org',
      }),
    )
  })

  it('switches to event scope tab', async () => {
    const user = userEvent.setup()
    render(<ImpactStatsPage />)
    await user.click(screen.getByRole('button', { name: 'Khel 2026 event' }))
    expect(
      screen.getByRole('heading', { name: 'Khel 2026 event impact stats' }),
    ).toBeInTheDocument()
  })

  it('deletes and reorders impact stats', async () => {
    const user = userEvent.setup()
    render(<ImpactStatsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('children')
    expect(mockReorder).toHaveBeenCalled()
  })
})
