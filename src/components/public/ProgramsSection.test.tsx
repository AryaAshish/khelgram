import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgramsSection } from './ProgramsSection'

describe('ProgramsSection', () => {
  it('renders program cards with pillar labels and CTA links', () => {
    render(
      <ProgramsSection
        title="Our Programs"
        programs={[
          {
            id: 'program-1',
            title: 'Grassroots Discovery',
            description: 'Scouting talent in villages.',
            pillar: 'grassroots_discovery',
            icon: 'search',
            published: true,
            sortOrder: 1,
            ctaLabel: 'Learn more',
            ctaUrl: '/khel2026',
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Our Programs' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Grassroots Discovery', level: 3 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Scouting talent in villages.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '/khel2026')
    expect(document.getElementById('programs')).toBeInTheDocument()
  })

  it('renders programs without optional icon or CTA', () => {
    render(
      <ProgramsSection
        title="Programs"
        programs={[
          {
            id: 'program-2',
            title: 'Training & Coaching',
            description: 'Structured coaching camps.',
            pillar: 'training',
            published: true,
            sortOrder: 2,
          },
        ]}
      />,
    )

    expect(screen.getByText('Training & Coaching')).toBeInTheDocument()
    expect(screen.getByText('Training')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders all pillar variants with icons', () => {
    render(
      <ProgramsSection
        title="Programs"
        programs={[
          {
            id: 'p1',
            title: 'Grassroots',
            description: 'A',
            pillar: 'grassroots_discovery',
            published: true,
            sortOrder: 1,
          },
          {
            id: 'p2',
            title: 'Training',
            description: 'B',
            pillar: 'training',
            published: true,
            sortOrder: 2,
          },
          {
            id: 'p3',
            title: 'Traditional',
            description: 'C',
            pillar: 'traditional_sports',
            published: true,
            sortOrder: 3,
          },
          {
            id: 'p4',
            title: 'Health',
            description: 'D',
            pillar: 'health',
            published: true,
            sortOrder: 4,
          },
          {
            id: 'p5',
            title: 'Scholarships',
            description: 'E',
            pillar: 'scholarships',
            published: true,
            sortOrder: 5,
            ctaLabel: 'Apply',
            ctaUrl: '/get-involved',
          },
          {
            id: 'p6',
            title: 'Girls',
            description: 'F',
            pillar: 'girls_inclusion',
            published: true,
            sortOrder: 6,
          },
        ]}
      />,
    )

    expect(screen.getByRole('link', { name: 'Apply' })).toHaveAttribute('href', '/get-involved')
    expect(screen.getByText('Traditional Sports')).toBeInTheDocument()
    expect(screen.getByText('Girls & Inclusion')).toBeInTheDocument()
  })
})
