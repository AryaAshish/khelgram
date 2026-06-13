import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ImpactStatsBar } from './ImpactStatsBar'

describe('ImpactStatsBar', () => {
  it('renders stat values and labels', () => {
    render(
      <ImpactStatsBar
        stats={[
          { id: 'children', value: '500+', label: 'Children Participating' },
          { id: 'schools', value: '20+', label: 'Schools Represented' },
        ]}
      />,
    )

    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Children Participating')).toBeInTheDocument()
    expect(screen.getByText('20+')).toBeInTheDocument()
    expect(screen.getByText('Schools Represented')).toBeInTheDocument()
  })

  it('exposes impact section anchor', () => {
    render(<ImpactStatsBar stats={[{ id: 'one', value: '100+', label: 'Kids' }]} />)

    expect(document.getElementById('impact')).toBeInTheDocument()
  })

  it('renders a custom section title', () => {
    render(
      <ImpactStatsBar title="Our Impact" stats={[{ id: 'one', value: '100+', label: 'Kids' }]} />,
    )

    expect(screen.getByRole('heading', { name: 'Our Impact' })).toBeInTheDocument()
  })

  it('renders an optional subtitle', () => {
    render(
      <ImpactStatsBar
        title="Impact"
        subtitle="Grassroots outcomes across rural India."
        stats={[{ id: 'one', value: '120+', label: 'Villages Reached' }]}
      />,
    )

    expect(screen.getByText('Grassroots outcomes across rural India.')).toBeInTheDocument()
  })
})
