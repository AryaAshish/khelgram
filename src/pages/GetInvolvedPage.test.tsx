import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent, footerContent } from '@/fixtures/homePageFixtures'
import { GetInvolvedPage } from './GetInvolvedPage'

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: vi.fn(),
}))

import { useAllSettings } from '@/hooks/useSiteSettings'

const mockUseAllSettings = vi.mocked(useAllSettings)

function mockSettings(settingsMap: Record<string, string>) {
  mockUseAllSettings.mockReturnValue({
    settingsMap,
    aboutContent,
  } as ReturnType<typeof useAllSettings>)
}

describe('GetInvolvedPage', () => {
  beforeEach(() => {
    document.title = ''
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
    expect(screen.getByRole('link', { name: 'Register your child' })).toHaveAttribute(
      'href',
      '/register',
    )
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

    render(
      <MemoryRouter>
        <GetInvolvedPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(document.title).toBe('Join Us | Khelgram Foundation')
    expect(screen.getByText(footerContent.description)).toBeInTheDocument()
    expect(screen.getByText(footerContent.copyright)).toBeInTheDocument()
  })
})
