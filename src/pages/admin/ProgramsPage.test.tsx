import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProgramsPage } from './ProgramsPage'

const mockAdd = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminPrograms = vi.fn()
const mockPendingState = {
  add: false,
  update: false,
  delete: false,
  reorder: false,
}

vi.mock('@/hooks/usePrograms', () => ({
  useAdminPrograms: () => mockUseAdminPrograms(),
  useAddProgram: () => ({
    mutateAsync: mockAdd,
    isPending: mockPendingState.add,
  }),
  useUpdateProgram: () => ({
    mutateAsync: mockUpdate,
    isPending: mockPendingState.update,
  }),
  useDeleteProgram: () => ({
    mutateAsync: mockDelete,
    isPending: mockPendingState.delete,
  }),
  useReorderPrograms: () => ({
    mutateAsync: mockReorder,
    isPending: mockPendingState.reorder,
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('ProgramsPage', () => {
  beforeEach(() => {
    mockPendingState.add = false
    mockPendingState.update = false
    mockPendingState.delete = false
    mockPendingState.reorder = false
    mockAdd.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockReorder.mockReset()
    mockUseAdminPrograms.mockReturnValue({
      data: [
        {
          id: 'program-1',
          title: 'Grassroots Discovery',
          description: 'Scouting talent',
          pillar: 'grassroots_discovery',
          published: true,
          sortOrder: 1,
        },
        {
          id: 'program-2',
          title: 'Draft Program',
          description: '',
          pillar: 'training',
          published: false,
          sortOrder: 2,
        },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
    mockUpdate.mockResolvedValue({})
    mockDelete.mockResolvedValue(undefined)
    mockReorder.mockResolvedValue(undefined)
  })

  it('renders programs with draft label', () => {
    render(<ProgramsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Draft Program (draft)')).toBeInTheDocument()
    expect(screen.getAllByText('Grassroots Discovery').length).toBeGreaterThan(0)
  })

  it('adds a program through mutation', async () => {
    const user = userEvent.setup()
    render(<ProgramsPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Title'), 'New Program')
    await user.type(screen.getByLabelText('Description'), 'Program description')
    await user.selectOptions(screen.getByLabelText('Pillar'), 'health')
    await user.type(screen.getByLabelText('Icon'), 'heart')
    await user.type(screen.getByLabelText('CTA label'), 'Join')
    await user.type(screen.getByLabelText('CTA URL'), '/register')
    await user.click(screen.getByRole('checkbox', { name: 'Published' }))
    await user.click(screen.getByRole('button', { name: 'Add program' }))

    expect(mockAdd).toHaveBeenCalledWith({
      title: 'New Program',
      description: 'Program description',
      pillar: 'health',
      icon: 'heart',
      published: true,
      ctaLabel: 'Join',
      ctaUrl: '/register',
    })
  })

  it('shows loading and empty states', () => {
    mockUseAdminPrograms.mockReturnValue({ data: [], isLoading: true })
    render(<ProgramsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty message when no programs exist', () => {
    mockUseAdminPrograms.mockReturnValue({ data: [], isLoading: false })
    render(<ProgramsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('No programs yet.')).toBeInTheDocument()
  })

  it('toggles publish state for an existing program', async () => {
    const user = userEvent.setup()
    render(<ProgramsPage />, { wrapper: createWrapper() })

    await user.click(screen.getByLabelText('Published Draft Program'))

    expect(mockUpdate).toHaveBeenCalledWith({
      id: 'program-2',
      published: true,
    })
  })

  it('reorders and deletes programs', async () => {
    const user = userEvent.setup()
    render(<ProgramsPage />, { wrapper: createWrapper() })

    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockReorder).toHaveBeenCalledWith(['program-2', 'program-1'])

    await user.click(screen.getAllByRole('button', { name: 'Up' })[1]!)
    expect(mockReorder).toHaveBeenCalledWith(['program-2', 'program-1'])

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('program-1')
  })

  it('disables actions while a mutation is pending', () => {
    mockPendingState.add = true
    render(<ProgramsPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Up' })).toHaveLength(2)
    screen.getAllByRole('button', { name: 'Up' }).forEach((button) => {
      expect(button).toBeDisabled()
    })
    screen.getAllByRole('button', { name: 'Down' }).forEach((button) => {
      expect(button).toBeDisabled()
    })
    screen.getAllByRole('button', { name: 'Delete' }).forEach((button) => {
      expect(button).toBeDisabled()
    })
  })
})
