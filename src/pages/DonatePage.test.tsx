import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { footerContent } from '@/fixtures/homePageFixtures'
import { DonatePage } from './DonatePage'

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: vi.fn(),
}))

vi.mock('@/hooks/useLeads', () => ({
  useSubmitLead: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
  }),
}))

import { useAllSettings } from '@/hooks/useSiteSettings'

const mockUseAllSettings = vi.mocked(useAllSettings)

describe('DonatePage', () => {
  beforeEach(() => {
    document.title = ''
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        support_title: 'Support Our Mission',
        support_description: 'Help grassroots sports grow.',
        footer_description: 'Footer description',
        footer_copyright: 'Footer copyright',
      },
    } as unknown as ReturnType<typeof useAllSettings>)
  })

  it('renders donate intro and interest form', () => {
    render(
      <MemoryRouter>
        <DonatePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Support Our Mission' })).toBeInTheDocument()
    expect(screen.getByText(/do not collect payments on this page/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Back to homepage' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('form', { name: 'Donation interest form' })).toBeInTheDocument()
    expect(document.title).toBe('Donate | Khelgram Foundation')
  })

  it('hides footer when footer visibility is false', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        footer_visible: 'false',
      },
    } as unknown as ReturnType<typeof useAllSettings>)

    render(
      <MemoryRouter>
        <DonatePage />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Footer description')).not.toBeInTheDocument()
  })

  it('uses footer fallbacks when CMS values are missing', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
      },
    } as unknown as ReturnType<typeof useAllSettings>)

    render(
      <MemoryRouter>
        <DonatePage />
      </MemoryRouter>,
    )

    expect(screen.getByText(footerContent.description)).toBeInTheDocument()
    expect(screen.getByText(footerContent.copyright)).toBeInTheDocument()
  })

  it('uses default site name when CMS value is missing', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {},
    } as unknown as ReturnType<typeof useAllSettings>)

    render(
      <MemoryRouter>
        <DonatePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Khelgram Foundation' })).toBeInTheDocument()
    expect(document.title).toBe('Donate | Khelgram Foundation')
  })
})
