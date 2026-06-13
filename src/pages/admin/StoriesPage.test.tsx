import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StoriesPage } from './StoriesPage'

const mockAdd = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminSuccessStories = vi.fn()
const mockPendingState = { add: false, update: false, delete: false, reorder: false }

vi.mock('@/hooks/useSuccessStories', () => ({
  useAdminSuccessStories: () => mockUseAdminSuccessStories(),
  useAddSuccessStory: () => ({ mutateAsync: mockAdd, isPending: mockPendingState.add }),
  useUpdateSuccessStory: () => ({ mutateAsync: mockUpdate, isPending: mockPendingState.update }),
  useDeleteSuccessStory: () => ({ mutateAsync: mockDelete, isPending: mockPendingState.delete }),
  useReorderSuccessStories: () => ({
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

describe('StoriesPage', () => {
  beforeEach(() => {
    mockPendingState.add = false
    mockPendingState.update = false
    mockPendingState.delete = false
    mockPendingState.reorder = false
    mockAdd.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockReorder.mockReset()
    mockUseAdminSuccessStories.mockReturnValue({
      data: [
        {
          id: 'story-1',
          title: 'Published story',
          summary: 'Summary',
          story: 'Body',
          published: true,
          sortOrder: 1,
        },
        {
          id: 'story-2',
          title: 'Draft story',
          summary: '',
          story: '',
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

  it('renders stories with draft label', () => {
    render(<StoriesPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Draft story (draft)')).toBeInTheDocument()
  })

  it('adds a story through mutation', async () => {
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Title'), 'New story')
    await user.type(screen.getByLabelText('Summary'), 'Summary')
    await user.type(screen.getByLabelText('Story'), 'Body')
    await user.click(screen.getByRole('button', { name: 'Add story' }))

    expect(mockAdd).toHaveBeenCalledWith({
      title: 'New story',
      summary: 'Summary',
      story: 'Body',
      imageUrl: undefined,
      published: false,
    })
  })

  it('toggles publish and reorders stories', async () => {
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('checkbox', { name: 'Published Draft story' }))
    expect(mockUpdate).toHaveBeenCalledWith({ id: 'story-2', published: true })

    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockReorder).toHaveBeenCalled()
  })

  it('shows loading and empty states and deletes story', async () => {
    mockUseAdminSuccessStories.mockReturnValue({ data: [], isLoading: true })
    const { rerender } = render(<StoriesPage />, { wrapper: createWrapper() })
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    mockUseAdminSuccessStories.mockReturnValue({ data: [], isLoading: false })
    rerender(<StoriesPage />)
    expect(screen.getByText('No stories yet.')).toBeInTheDocument()
  })

  it('adds story with image url and shows pending label', async () => {
    mockPendingState.add = true
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/photo.jpg')
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
  })

  it('deletes a story', async () => {
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[1]!)
    expect(mockDelete).toHaveBeenCalledWith('story-2')
  })

  it('moves story up', async () => {
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })
    await user.click(screen.getAllByRole('button', { name: 'Up' })[1]!)
    expect(mockReorder).toHaveBeenCalled()
  })

  it('checks published on add form', async () => {
    const user = userEvent.setup()
    render(<StoriesPage />, { wrapper: createWrapper() })
    await user.click(screen.getByRole('checkbox', { name: 'Published' }))
    await user.type(screen.getByLabelText('Title'), 'Published story')
    await user.click(screen.getByRole('button', { name: 'Add story' }))
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Published story', published: true }),
    )
  })
})
