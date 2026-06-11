import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContributorsGrid } from './ContributorsGrid'

describe('ContributorsGrid', () => {
  it('renders contributor names and contributions', () => {
    render(
      <ContributorsGrid
        title="Contributors"
        contributors={[
          {
            id: 'contributor-1',
            name: 'Local Schools Network',
            contribution: 'Venue and volunteer support',
            sortOrder: 0,
          },
        ]}
      />,
    )

    expect(screen.getByText('Contributors')).toBeInTheDocument()
    expect(screen.getByText('Local Schools Network')).toBeInTheDocument()
    expect(screen.getByText('Venue and volunteer support')).toBeInTheDocument()
  })
})
