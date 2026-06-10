import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RegistrationsPage } from './RegistrationsPage'

describe('RegistrationsPage', () => {
  it('renders registrations placeholder', () => {
    render(<RegistrationsPage />)
    expect(screen.getByRole('heading', { name: 'Registrations' })).toBeInTheDocument()
  })
})
