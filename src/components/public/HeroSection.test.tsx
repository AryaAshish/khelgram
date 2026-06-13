import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders registration counter when provided', () => {
    render(
      <HeroSection
        title="Festival Title"
        subtitle="Festival Subtitle"
        primaryCta="Register"
        secondaryCta="Explore"
        eventDateLabel="Date"
        eventDate="March 20, 2026"
        registrationCount={42}
        onPrimaryClick={vi.fn()}
        onSecondaryClick={vi.fn()}
      />,
    )

    expect(screen.getByText(/42/)).toBeInTheDocument()
    expect(screen.getByText(/children registered so far/)).toBeInTheDocument()
    expect(document.getElementById('hero')).toHaveAttribute('data-variant', 'festival')
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders content and handles CTA clicks', async () => {
    const user = userEvent.setup()
    const onPrimaryClick = vi.fn()
    const onSecondaryClick = vi.fn()

    render(
      <HeroSection
        title="Festival Title"
        subtitle="Festival Subtitle"
        primaryCta="Register"
        secondaryCta="Explore"
        eventDateLabel="Date"
        eventDate="March 20, 2026"
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick}
      />,
    )

    expect(screen.getByText('Festival Title')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Register' }))
    await user.click(screen.getByRole('button', { name: 'Explore' }))
    expect(onPrimaryClick).toHaveBeenCalledTimes(1)
    expect(onSecondaryClick).toHaveBeenCalledTimes(1)
  })
})
