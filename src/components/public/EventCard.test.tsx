import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventCard } from './EventCard'

describe('EventCard', () => {
  const baseGame = {
    id: 'game-1',
    name: 'Sack Race',
    description: 'Hop',
    ageGroup: 'Ages 6-10',
    startTime: '10:00 AM',
    status: 'active' as const,
  }

  it('renders capacity section when capacity exists', () => {
    render(<EventCard game={{ ...baseGame, capacity: 20, registeredCount: 8 }} />)
    expect(screen.getByLabelText('Sack Race capacity')).toBeInTheDocument()
    expect(screen.getByText('8 / 20')).toBeInTheDocument()
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders waitlist badge when game is full', () => {
    render(<EventCard game={{ ...baseGame, capacity: 5, registeredCount: 5 }} />)
    expect(screen.getByText('Waitlist')).toBeInTheDocument()
  })

  it('defaults registered count to zero in capacity label', () => {
    render(<EventCard game={{ ...baseGame, capacity: 10 }} />)
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
  })

  it('renders closed badge for closed games', () => {
    render(<EventCard game={{ ...baseGame, status: 'closed' }} />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })
})
