import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent, footerContent } from '@/fixtures/homePageFixtures'
import { GetInvolvedPage } from './GetInvolvedPage'

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: vi.fn(),
}))

vi.mock('@/hooks/useLeads', () => ({
  useSubmitLead: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  }),
}))

const mockGetInvolvedContent = vi.fn()

vi.mock('@/lib/getInvolvedContent', () => ({
  getInvolvedContent: (...args: unknown[]) => mockGetInvolvedContent(...args),
}))

import { useAllSettings } from '@/hooks/useSiteSettings'

const mockUseAllSettings = vi.mocked(useAllSettings)

const defaultContent = {
  title: 'Get Involved',
  cards: [
    {
      id: 'parents',
      title: 'Parents',
      description: 'Register your child for Khel 2026 and grassroots sports programs.',
      buttonLabel: 'Register your child',
      buttonUrl: '/register',
    },
    {
      id: 'schools',
      title: 'Schools',
      description: 'Partner with us to bring sports programs to your students.',
      buttonLabel: 'Contact us',
      buttonUrl: '#contact',
    },
    {
      id: 'partners',
      title: 'Partners',
      description: 'Support equipment, coaching, and village outreach with your organization.',
      buttonLabel: 'Partner with us',
      buttonUrl: '/get-involved#partner-inquiry',
    },
    {
      id: 'volunteers',
      title: 'Volunteers',
      description: 'Help at events, training camps, and community sports days.',
      buttonLabel: 'Sign up to volunteer',
      buttonUrl: '/get-involved#volunteer-signup',
    },
  ],
}

function mockSettings(settingsMap: Record<string, string>) {
  mockUseAllSettings.mockReturnValue({
    settingsMap,
    aboutContent,
  } as ReturnType<typeof useAllSettings>)
}

describe('GetInvolvedPage', () => {
  beforeEach(() => {
    document.title = ''
    mockGetInvolvedContent.mockReturnValue(defaultContent)
    mockSettings({
      site_name: 'Khelgram Foundation',
      org_get_involved_title: 'Get Involved',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    })
  })

  it('renders get involved section and footer', () => {
    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Get Involved' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Parents' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register your child' })).toHaveAttribute(
      'href',
      '/register',
    )
    expect(document.getElementById('partner-inquiry')).toBeInTheDocument()
    expect(document.getElementById('volunteer-signup')).toBeInTheDocument()
    expect(screen.getByText('Footer description')).toBeInTheDocument()
    expect(document.title).toContain('Get Involved')
  })

  it('hides footer when footer visibility is false', () => {
    mockSettings({
      site_name: 'Khelgram Foundation',
      footer_visible: 'false',
    })

    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Footer description')).not.toBeInTheDocument()
  })

  it('uses site name and footer fallbacks when CMS values are missing', () => {
    mockSettings({
      org_get_involved_title: 'Join Us',
    })
    mockGetInvolvedContent.mockReturnValue({
      ...defaultContent,
      title: 'Join Us',
    })

    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Khelgram Foundation' })).toBeInTheDocument()
    expect(document.title).toBe('Join Us | Khelgram Foundation')
    expect(screen.getByText(footerContent.description)).toBeInTheDocument()
    expect(screen.getByText(footerContent.copyright)).toBeInTheDocument()
  })

  it('uses partner and volunteer card copy for form headings', () => {
    mockGetInvolvedContent.mockReturnValue({
      ...defaultContent,
      cards: defaultContent.cards.map((card) => {
        if (card.id === 'partners') {
          return {
            ...card,
            title: 'Corporate Partners',
            description: 'Partner description',
          }
        }
        if (card.id === 'volunteers') {
          return {
            ...card,
            title: 'Community Volunteers',
            description: 'Volunteer description',
          }
        }
        return card
      }),
    })

    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(document.getElementById('partner-inquiry')).toHaveTextContent('Corporate Partners')
    expect(document.getElementById('partner-inquiry')).toHaveTextContent('Partner description')
    expect(document.getElementById('volunteer-signup')).toHaveTextContent('Community Volunteers')
    expect(document.getElementById('volunteer-signup')).toHaveTextContent('Volunteer description')
  })

  it('uses default form copy when stakeholder cards are missing', () => {
    mockGetInvolvedContent.mockReturnValue({
      title: 'Get Involved',
      cards: [],
    })
    mockSettings({ site_name: 'Khelgram Foundation' })

    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(document.getElementById('partner-inquiry')).toHaveTextContent('Partners')
    expect(document.getElementById('volunteer-signup')).toHaveTextContent('Volunteers')
  })
})
