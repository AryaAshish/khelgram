import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { GetInvolvedContent } from '@/lib/getInvolvedContent'
import { GetInvolvedSection } from './GetInvolvedSection'

const sampleContent: GetInvolvedContent = {
  title: 'Get Involved',
  cards: [
    {
      id: 'parents',
      title: 'Parents',
      description: 'Register your child.',
      buttonLabel: 'Register your child',
      buttonUrl: '/register',
    },
    {
      id: 'schools',
      title: 'Schools',
      description: 'Partner with us.',
      buttonLabel: 'Contact us',
      buttonUrl: '#contact',
    },
  ],
}

describe('GetInvolvedSection', () => {
  it('renders stakeholder cards with internal and anchor links', () => {
    render(
      <MemoryRouter>
        <GetInvolvedSection content={sampleContent} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Get Involved' })).toBeInTheDocument()
    expect(document.getElementById('get-involved')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register your child' })).toHaveAttribute(
      'href',
      '/register',
    )
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '#contact')
  })

  it('shows expanded link on homepage variant', () => {
    render(
      <MemoryRouter>
        <GetInvolvedSection content={sampleContent} showExpandedLink />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'View all ways to help' })).toHaveAttribute(
      'href',
      '/get-involved',
    )
  })

  it('renders external CTA links as anchor tags', () => {
    render(
      <MemoryRouter>
        <GetInvolvedSection
          content={{
            title: 'Get Involved',
            cards: [
              {
                id: 'donors',
                title: 'Donors',
                description: 'Support our work.',
                buttonLabel: 'Email us',
                buttonUrl: 'mailto:hello@khelgram.org',
              },
            ],
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Email us' })).toHaveAttribute(
      'href',
      'mailto:hello@khelgram.org',
    )
  })
})
