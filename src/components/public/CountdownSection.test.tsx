import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CountdownSection } from './CountdownSection'

describe('CountdownSection', () => {
  it('renders heading', () => {
    render(
      <CountdownSection
        title="Countdown to Festival Day"
        targetDate="2026-03-20T09:00:00+05:30"
        toBeAnnouncedText="To Be Announced"
      />,
    )
    expect(screen.getByText('Countdown to Festival Day')).toBeInTheDocument()
  })

  it('shows announcement when target date is unavailable', () => {
    render(
      <CountdownSection
        title="Countdown to Festival Day"
        targetDate={null}
        toBeAnnouncedText="To Be Announced"
      />,
    )
    expect(screen.getByText('To Be Announced')).toBeInTheDocument()
    expect(document.getElementById('countdown')).toHaveAttribute('data-variant', 'default')
  })
})
