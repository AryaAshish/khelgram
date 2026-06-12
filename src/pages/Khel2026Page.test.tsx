import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent } from '@/fixtures/homePageFixtures'
import { Khel2026Page } from './Khel2026Page'

vi.mock('@/components/public/EventLandingSections', () => ({
  EventLandingSections: () => <div data-testid="event-landing-sections">Event sections</div>,
}))

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: vi.fn(),
}))

import { useAllSettings } from '@/hooks/useSiteSettings'

const mockUseAllSettings = vi.mocked(useAllSettings)

function mockSettings(settingsMap: Record<string, string>) {
  mockUseAllSettings.mockReturnValue({
    settingsMap,
    aboutContent,
    countdownTarget: '2026-04-22',
  } as ReturnType<typeof useAllSettings>)
}

describe('Khel2026Page', () => {
  beforeEach(() => {
    document.title = ''
    mockSettings({
      site_name: 'Khelgram Foundation',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    })
  })

  it('renders event landing sections and footer', () => {
    render(
      <MemoryRouter>
        <Khel2026Page />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('event-landing-sections')).toBeInTheDocument()
    expect(screen.getByText('Footer description')).toBeInTheDocument()
    expect(document.title).toContain('Khel 2026')
  })

  it('hides footer when footer visibility is false', () => {
    mockSettings({
      site_name: 'Khelgram Foundation',
      footer_visible: 'false',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    })

    render(
      <MemoryRouter>
        <Khel2026Page />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Footer description')).not.toBeInTheDocument()
  })

  it('uses default site name in document title when setting is missing', () => {
    mockSettings({
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    })

    render(
      <MemoryRouter>
        <Khel2026Page />
      </MemoryRouter>,
    )

    expect(document.title).toBe('Khel 2026 | Khelgram Foundation')
  })

  it('uses footer fixture fallbacks when settings are missing', () => {
    mockSettings({
      site_name: 'Khelgram Foundation',
    })

    render(
      <MemoryRouter>
        <Khel2026Page />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Khelgram Foundation empowers children/i)).toBeInTheDocument()
  })
})
