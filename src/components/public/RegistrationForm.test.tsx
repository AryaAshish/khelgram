import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { RegistrationForm, RegistrationFormWithI18n } from './RegistrationForm'

const defaultProps = {
  title: 'Register Your Child',
  preRegistrationMessage: "Pre-registration open — we'll confirm dates by email",
  submitLabel: 'Submit Registration',
}

describe('RegistrationForm', () => {
  it('submits registration payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<RegistrationForm {...defaultProps} eventOptions={['Sack Race']} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Child Name'), 'Aarav')
    await user.type(screen.getByLabelText('Age'), '9')
    await user.type(screen.getByLabelText('Parent Name'), 'Neha')
    await user.type(screen.getByLabelText('Email'), 'neha@example.com')
    await user.type(screen.getByLabelText('Phone'), '9999999999')
    await user.click(screen.getByLabelText('Sack Race'))
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))

    expect(onSubmit).toHaveBeenCalledWith({
      childName: 'Aarav',
      age: '9',
      parentName: 'Neha',
      email: 'neha@example.com',
      phone: '9999999999',
      selectedEvents: ['Sack Race'],
    })
  })

  it('renders share actions when shareUrl is provided', () => {
    render(
      <RegistrationForm
        {...defaultProps}
        eventOptions={['Sack Race']}
        shareUrl="https://khelgram.example/register"
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Copy registration link' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Share registration form' })).toBeInTheDocument()
  })

  it('shows pre-registration notice and submitting state', () => {
    render(
      <RegistrationForm
        {...defaultProps}
        eventOptions={['Sack Race']}
        isPreRegistration
        isSubmitting
        onSubmit={vi.fn()}
      />,
    )

    expect(
      screen.getByText("Pre-registration open — we'll confirm dates by email"),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()
  })

  it('removes event when checkbox is unchecked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <RegistrationForm
        {...defaultProps}
        eventOptions={['Sack Race', 'Relay Race']}
        onSubmit={onSubmit}
      />,
    )

    const sackRace = screen.getByLabelText('Sack Race')
    const relayRace = screen.getByLabelText('Relay Race')
    await user.click(sackRace)
    await user.click(relayRace)
    await user.click(sackRace)

    await user.type(screen.getByLabelText('Child Name'), 'Aarav')
    await user.type(screen.getByLabelText('Age'), '9')
    await user.type(screen.getByLabelText('Parent Name'), 'Neha')
    await user.type(screen.getByLabelText('Email'), 'neha@example.com')
    await user.type(screen.getByLabelText('Phone'), '9999999999')
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ selectedEvents: ['Relay Race'] }),
    )
  })

  it('uses default submit label when submitLabel is omitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <RegistrationForm
        {...defaultProps}
        submitLabel={undefined}
        eventOptions={['Sack Race']}
        onSubmit={onSubmit}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('renders Hindi labels via RegistrationFormWithI18n', async () => {
    await i18n.changeLanguage('hi')

    render(
      <RegistrationFormWithI18n
        title={defaultProps.title}
        preRegistrationMessage={defaultProps.preRegistrationMessage}
        eventOptions={['Sack Race']}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByText('बच्चे का नाम')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'पंजीकरण जमा करें' })).toBeInTheDocument()

    await i18n.changeLanguage('en')
  })
})
