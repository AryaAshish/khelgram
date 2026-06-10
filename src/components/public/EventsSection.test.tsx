import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventsSection } from './EventsSection'

describe('EventsSection', () => {
  it('renders all games', () => {
    render(
      <EventsSection
        title="Festival Events"
        games={[
          {
            id: 'one',
            name: 'Sack Race',
            description: 'Description',
            ageGroup: 'Ages 6-10',
            startTime: '10:00 AM',
          },
        ]}
      />,
    )

    expect(screen.getByText('Sack Race')).toBeInTheDocument()
  })
})
