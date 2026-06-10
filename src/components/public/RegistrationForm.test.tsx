import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegistrationForm } from './RegistrationForm'

describe('RegistrationForm', () => {
  it('submits registration payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<RegistrationForm eventOptions={['Sack Race']} onSubmit={onSubmit} />)

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

  it('removes event when checkbox is unchecked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<RegistrationForm eventOptions={['Sack Race', 'Relay Race']} onSubmit={onSubmit} />)

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
})
