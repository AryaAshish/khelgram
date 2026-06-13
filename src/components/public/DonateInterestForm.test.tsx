import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DonateInterestForm } from './DonateInterestForm'

const mockMutateAsync = vi.fn()
const mockSubmitState = { isPending: false }

vi.mock('@/hooks/useLeads', () => ({
  useSubmitLead: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockSubmitState.isPending,
  }),
}))

describe('DonateInterestForm', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset()
    mockMutateAsync.mockResolvedValue({})
    mockSubmitState.isPending = false
  })

  it('renders contact fields and callback promise', () => {
    render(<DonateInterestForm />)

    expect(screen.getByRole('heading', { name: 'Share your contact details' })).toBeInTheDocument()
    expect(screen.getByText(/call or write back within 2–3 working days/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('How you would like to support (optional)')).toBeInTheDocument()
  })

  it('submits phone-only interest', async () => {
    const user = userEvent.setup()
    render(<DonateInterestForm />)

    await user.type(screen.getByLabelText('Phone'), '9876543210')
    await user.type(screen.getByLabelText('How you would like to support (optional)'), 'Equipment')
    await user.click(screen.getByRole('button', { name: 'Request a callback' }))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: '',
      email: '',
      phone: '9876543210',
      message: 'Equipment',
    })
  })

  it('submits optional name with email interest', async () => {
    const user = userEvent.setup()
    render(<DonateInterestForm />)

    await user.type(screen.getByLabelText('Name (optional)'), 'Asha')
    await user.type(screen.getByLabelText('Email'), 'donor@example.com')
    await user.click(screen.getByRole('button', { name: 'Request a callback' }))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: 'Asha',
      email: 'donor@example.com',
      phone: '',
      message: '',
    })
  })

  it('shows success message after submit', async () => {
    const user = userEvent.setup()
    render(<DonateInterestForm />)

    await user.type(screen.getByLabelText('Email'), 'donor@example.com')
    await user.click(screen.getByRole('button', { name: 'Request a callback' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      /call or email you within 2–3 working days/i,
    )
  })
})
