import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SponsorWall } from './SponsorWall'

describe('SponsorWall', () => {
  it('groups sponsors by tier and renders logos or names', () => {
    render(
      <SponsorWall
        title="Sponsors"
        sponsors={[
          {
            id: 'sponsor-1',
            name: 'Greenfield Sports',
            tier: 'platinum',
            logoUrl: 'https://example.com/logo.png',
            website: 'https://greenfield.example',
            sortOrder: 0,
          },
          {
            id: 'sponsor-2',
            name: 'Community Partner',
            tier: 'community',
            sortOrder: 0,
          },
        ]}
      />,
    )

    expect(screen.getByText('Sponsors')).toBeInTheDocument()
    expect(screen.getByText('Platinum')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Greenfield Sports' })).toBeInTheDocument()
    expect(screen.getByText('Community Partner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Greenfield Sports' })).toHaveAttribute(
      'href',
      'https://greenfield.example',
    )
  })

  it('renders sponsors without website as static blocks', () => {
    render(
      <SponsorWall
        title="Sponsors"
        sponsors={[
          {
            id: 'sponsor-3',
            name: 'Gold Partner',
            tier: 'gold',
            logoUrl: 'https://example.com/gold.png',
            sortOrder: 0,
          },
        ]}
      />,
    )

    expect(screen.getByText('Gold')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Gold Partner' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gold Partner' })).toBeInTheDocument()
  })
})
