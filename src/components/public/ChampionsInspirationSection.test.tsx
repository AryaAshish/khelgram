import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { championAthletes } from '@/fixtures/visualAssets'
import { ChampionsInspirationSection } from './ChampionsInspirationSection'

describe('ChampionsInspirationSection', () => {
  it('renders publicly licensed Indian athlete photos with attribution', () => {
    render(<ChampionsInspirationSection />)

    expect(
      screen.getByRole('heading', { name: 'Champions who inspire our villages' }),
    ).toBeInTheDocument()
    for (const athlete of championAthletes) {
      expect(screen.getByRole('img', { name: athlete.alt })).toHaveAttribute('src', athlete.url)
      expect(screen.getByText(athlete.name)).toBeInTheDocument()
      expect(screen.getByText(athlete.credit)).toBeInTheDocument()
    }
  })

  it('supports custom heading copy', () => {
    render(
      <ChampionsInspirationSection
        title="Our sporting heroes"
        subtitle="From village grounds to global podiums."
      />,
    )

    expect(screen.getByRole('heading', { name: 'Our sporting heroes' })).toBeInTheDocument()
    expect(screen.getByText('From village grounds to global podiums.')).toBeInTheDocument()
  })
})
