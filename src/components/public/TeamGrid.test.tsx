import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TeamGrid } from './TeamGrid'

describe('TeamGrid', () => {
  it('renders team members with optional photo and bio', () => {
    render(
      <TeamGrid
        title="Our Team"
        members={[
          {
            id: 'team-1',
            name: 'Priya Sharma',
            role: 'Director',
            bio: 'Leads operations',
            photoUrl: 'https://example.com/priya.jpg',
            published: true,
            sortOrder: 0,
          },
          {
            id: 'team-2',
            name: 'Draft Member',
            role: 'Volunteer',
            bio: '',
            published: false,
            sortOrder: 1,
          },
        ]}
      />,
    )

    expect(screen.getByText('Our Team')).toBeInTheDocument()
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
    expect(screen.getByText('Director')).toBeInTheDocument()
    expect(screen.getByText('Leads operations')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Priya Sharma' })).toHaveAttribute(
      'src',
      'https://example.com/priya.jpg',
    )
    expect(screen.getByText('Draft Member')).toBeInTheDocument()
  })
})
