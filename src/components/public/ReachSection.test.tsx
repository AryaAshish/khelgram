import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReachSection } from './ReachSection'

describe('ReachSection', () => {
  it('renders region cards', () => {
    render(
      <ReachSection
        title="Where We Work"
        regions={[
          { name: 'Uttar Pradesh', states: ['UP'], description: 'Eastern UP camps.' },
          { name: 'Bihar', states: ['BR'], description: 'School partnerships.' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Where We Work' })).toBeInTheDocument()
    expect(screen.getByText('Uttar Pradesh')).toBeInTheDocument()
    expect(screen.getByText('UP')).toBeInTheDocument()
    expect(screen.getByText('Eastern UP camps.')).toBeInTheDocument()
  })
})
