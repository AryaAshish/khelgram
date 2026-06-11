import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FAQPage } from './FAQPage'

const mockAdd = vi.fn()
const mockDelete = vi.fn()
const mockReorder = vi.fn()
const mockUseFaq = vi.fn()

vi.mock('@/hooks/useFaq', () => ({
  useFaq: () => mockUseFaq(),
  useAddFaqItem: () => ({ mutateAsync: mockAdd, isPending: false }),
  useDeleteFaqItem: () => ({ mutateAsync: mockDelete, isPending: false }),
  useReorderFaqItems: () => ({ mutateAsync: mockReorder, isPending: false }),
}))

describe('FAQPage', () => {
  beforeEach(() => {
    mockUseFaq.mockReturnValue({
      items: [
        {
          id: 'faq-1',
          question: 'What should my child bring?',
          answer: 'Comfortable clothes',
          sortOrder: 0,
        },
        {
          id: 'faq-2',
          question: 'Age groups?',
          answer: 'Listed per event',
          sortOrder: 1,
        },
      ],
      isLoading: false,
    })
    mockAdd.mockResolvedValue({})
  })

  it('adds FAQ item from form', async () => {
    const user = userEvent.setup()
    render(<FAQPage />)
    await user.type(screen.getByLabelText('Question'), 'New question?')
    await user.type(screen.getByLabelText('Answer'), 'New answer')
    await user.click(screen.getByRole('button', { name: 'Add FAQ' }))
    expect(mockAdd).toHaveBeenCalled()
  })

  it('deletes and reorders FAQ items', async () => {
    const user = userEvent.setup()
    render(<FAQPage />)
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(mockDelete).toHaveBeenCalledWith('faq-1')
    expect(mockReorder).toHaveBeenCalled()
  })
})
