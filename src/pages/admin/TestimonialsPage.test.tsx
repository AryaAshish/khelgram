import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TestimonialsPage } from './TestimonialsPage'

const mockAdd = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseAdminTestimonials = vi.fn()

vi.mock('@/hooks/useTestimonials', () => ({
  useAdminTestimonials: () => mockUseAdminTestimonials(),
  useAddTestimonial: () => ({ mutateAsync: mockAdd, isPending: false }),
  useUpdateTestimonial: () => ({ mutateAsync: mockUpdate, isPending: false }),
  useDeleteTestimonial: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderTestimonials: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('TestimonialsPage', () => {
  beforeEach(() => {
    mockUseAdminTestimonials.mockReturnValue({
      data: [
        { id: 't-1', quote: 'Great', author: 'Parent', relation: 'Mom', sortOrder: 0 },
        { id: 't-2', quote: 'Fun', author: 'Coach', relation: '', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
    mockUpdate.mockResolvedValue({})
  })

  it('adds testimonial with relation and photo URL', async () => {
    const user = userEvent.setup()
    render(<TestimonialsPage />)
    await user.type(screen.getByLabelText('Quote'), 'Amazing event')
    await user.type(screen.getByLabelText('Author'), 'Neha')
    await user.type(screen.getByLabelText('Relation'), 'Parent')
    await user.type(screen.getByLabelText('Photo URL'), 'https://example.com/photo.jpg')
    await user.click(screen.getByRole('button', { name: 'Add testimonial' }))
    expect(mockAdd).toHaveBeenCalledWith({
      quote: 'Amazing event',
      author: 'Neha',
      relation: 'Parent',
      photoUrl: 'https://example.com/photo.jpg',
    })
  })

  it('adds testimonial from form', async () => {
    const user = userEvent.setup()
    render(<TestimonialsPage />)
    await user.type(screen.getByLabelText('Quote'), 'Amazing event')
    await user.type(screen.getByLabelText('Author'), 'Neha')
    await user.click(screen.getByRole('button', { name: 'Add testimonial' }))
    expect(mockAdd).toHaveBeenCalled()
  })

  it('edits testimonial from list', async () => {
    const user = userEvent.setup()
    render(<TestimonialsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]!)
    await user.clear(screen.getByLabelText('Quote'))
    await user.type(screen.getByLabelText('Quote'), 'Updated quote')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(mockUpdate).toHaveBeenCalledWith({
      id: 't-1',
      quote: 'Updated quote',
      author: 'Parent',
      relation: 'Mom',
      photoUrl: undefined,
    })
  })

  it('deletes and reorders testimonials', async () => {
    const user = userEvent.setup()
    render(<TestimonialsPage />)
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('t-1')
    expect(mockReorder).toHaveBeenCalled()
  })
})
