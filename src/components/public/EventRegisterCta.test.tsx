import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EventRegisterCta } from './EventRegisterCta'

describe('EventRegisterCta', () => {
  it('renders register CTA linking to /register', () => {
    render(
      <MemoryRouter>
        <EventRegisterCta
          title="Register Your Child"
          description="Sign up for Khel 2026"
          buttonLabel="Register Now"
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Register Your Child' })).toBeInTheDocument()
    expect(screen.getByText('Sign up for Khel 2026')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register Now' })).toHaveAttribute('href', '/register')
  })
})
