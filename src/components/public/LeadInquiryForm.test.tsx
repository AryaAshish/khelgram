import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LeadInquiryForm } from './LeadInquiryForm'

const mockMutateAsync = vi.fn()
const mockSubmitState = { isPending: false }

vi.mock('@/hooks/useLeads', () => ({
  useSubmitLead: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockSubmitState.isPending,
  }),
}))

describe('LeadInquiryForm', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset()
    mockMutateAsync.mockResolvedValue({})
    mockSubmitState.isPending = false
  })

  it('renders partner form with organization field', () => {
    render(
      <LeadInquiryForm
        type="partner"
        title="Partner with us"
        description="Tell us about your organization."
        showOrganization
      />,
    )

    expect(screen.getByRole('heading', { name: 'Partner with us' })).toBeInTheDocument()
    expect(screen.getByLabelText('Organization')).toBeInTheDocument()
    expect(document.getElementById('partner-inquiry')).toBeInTheDocument()
  })

  it('renders volunteer form without organization field', () => {
    render(
      <LeadInquiryForm
        type="volunteer"
        title="Volunteer signup"
        description="Share your availability."
      />,
    )

    expect(screen.queryByLabelText('Organization')).not.toBeInTheDocument()
    expect(document.getElementById('volunteer-signup')).toBeInTheDocument()
  })

  it('submits volunteer form values', async () => {
    const user = userEvent.setup()

    render(
      <LeadInquiryForm
        type="volunteer"
        title="Volunteer signup"
        description="Share your availability."
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'Ravi')
    await user.type(screen.getByLabelText('Email'), 'ravi@example.com')
    await user.type(screen.getByLabelText('Phone (optional)'), '9876543210')
    await user.type(screen.getByLabelText('Message'), 'Weekend help')
    await user.click(screen.getByRole('button', { name: 'Submit inquiry' }))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: 'Ravi',
      email: 'ravi@example.com',
      phone: '9876543210',
      organization: '',
      message: 'Weekend help',
    })
  })

  it('submits partner form with organization', async () => {
    const user = userEvent.setup()

    render(
      <LeadInquiryForm
        type="partner"
        title="Partner with us"
        description="Tell us about your organization."
        showOrganization
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'Asha')
    await user.type(screen.getByLabelText('Email'), 'asha@example.com')
    await user.type(screen.getByLabelText('Organization'), 'NGO')
    await user.type(screen.getByLabelText('Message'), 'Support')
    await user.click(screen.getByRole('button', { name: 'Submit inquiry' }))

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: 'Asha',
      email: 'asha@example.com',
      phone: '',
      organization: 'NGO',
      message: 'Support',
    })
  })

  it('shows submitting label while pending', () => {
    mockSubmitState.isPending = true

    render(
      <LeadInquiryForm
        type="volunteer"
        title="Volunteer signup"
        description="Share your availability."
      />,
    )

    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()
  })
})
