import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TestimonialsPage } from './TestimonialsPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseTestimonials = vi.fn()

vi.mock('@/hooks/useTestimonials', () => ({
  useTestimonials: () => mockUseTestimonials(),
  useAddTestimonial: () => ({ mutateAsync: mockAdd, isPending: false }),
  useDeleteTestimonial: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderTestimonials: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('TestimonialsPage', () => {
  beforeEach(() => {
    mockUseTestimonials.mockReturnValue({
      testimonials: [
        { id: 't-1', quote: 'Great', author: 'Parent', relation: 'Mom', sortOrder: 0 },
        { id: 't-2', quote: 'Fun', author: 'Coach', relation: '', sortOrder: 1 },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
  })

  it('adds testimonial from form', async () => {
    const user = userEvent.setup()
    render(<TestimonialsPage />)
    await user.type(screen.getByLabelText('Quote'), 'Amazing event')
    await user.type(screen.getByLabelText('Author'), 'Neha')
    await user.click(screen.getByRole('button', { name: 'Add testimonial' }))
    expect(mockAdd).toHaveBeenCalled()
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
