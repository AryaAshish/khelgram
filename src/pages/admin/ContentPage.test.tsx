import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as contentSectionsModule from '@/lib/contentSections'
import { ContentPage } from './ContentPage'

const mockMutateAsync = vi.fn()
const mockUseAllSettings = vi.fn()
const mockUseUpdateSectionSettings = vi.fn()

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockSettingsMap = {
  org_hero_title: 'Org Hero Title',
  org_hero_subtitle: 'Org subtitle',
  org_hero_primary_cta: 'Our impact',
  org_hero_secondary_cta: 'Khel 2026',
  org_about_title: 'About Khelgram Foundation',
  org_about_mission: 'Mission text',
  org_about_vision: 'Vision text',
  org_about_values: 'Value One',
  khel2026_hero_title: 'Event Hero Title',
  khel2026_hero_subtitle: 'Event subtitle',
  khel2026_hero_primary_cta: 'Register Now',
  khel2026_hero_secondary_cta: 'Explore Events',
  khel2026_hero_event_date_label: 'Festival Date',
  khel2026_hero_event_date: 'March 20, 2026',
  khel2026_countdown_title: 'Countdown to Festival Day',
  khel2026_countdown_tba_text: 'To Be Announced',
}

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: () => mockUseAllSettings(),
  useUpdateSectionSettings: () => mockUseUpdateSectionSettings(),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('ContentPage', () => {
  beforeEach(() => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: mockSettingsMap,
      isSuccess: true,
    })
    mockUseUpdateSectionSettings.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('renders organization hero fields and saves org copy', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    expect(screen.getByLabelText('Hero title')).toHaveValue('Org Hero Title')
    await user.clear(screen.getByLabelText('Hero title'))
    await user.type(screen.getByLabelText('Hero title'), 'Updated Org Hero')
    await user.click(screen.getByRole('button', { name: 'Save org hero' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'org_hero_title',
          value: 'Updated Org Hero',
          section: 'org',
        }),
      ]),
    )
  })

  it('saves org hero CTA labels', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.clear(screen.getByLabelText('Primary CTA'))
    await user.type(screen.getByLabelText('Primary CTA'), 'Get involved')
    await user.click(screen.getByRole('button', { name: 'Save org hero' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'org_hero_primary_cta', value: 'Get involved' }),
      ]),
    )
  })

  it('edits org hero subtitle multiline field', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.clear(screen.getByLabelText('Hero subtitle'))
    await user.type(screen.getByLabelText('Hero subtitle'), 'Updated org subtitle')

    expect(screen.getByLabelText('Hero subtitle')).toHaveValue('Updated org subtitle')
  })

  it('switches to Khel 2026 group and edits event hero independently', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Khel 2026' }))
    expect(screen.getByLabelText('Hero title')).toHaveValue('Event Hero Title')

    await user.clear(screen.getByLabelText('Hero title'))
    await user.type(screen.getByLabelText('Hero title'), 'Updated Event Hero')
    expect(screen.getByLabelText('Hero title')).toHaveValue('Updated Event Hero')
  })

  it('edits org about fields on organization tab', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'About' }))
    await user.clear(screen.getByLabelText('Mission'))
    await user.type(screen.getByLabelText('Mission'), 'Updated mission')

    expect(screen.getByLabelText('Mission')).toHaveValue('Updated mission')
    expect(screen.getByLabelText('Values (one per line)')).toHaveAttribute('rows', '5')
  })

  it('saves Khel 2026 countdown from event group', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Khel 2026' }))
    await user.click(screen.getByRole('tab', { name: 'Countdown' }))
    await user.clear(screen.getByLabelText('Countdown heading'))
    await user.type(screen.getByLabelText('Countdown heading'), 'Updated countdown')
    await user.click(screen.getByRole('button', { name: 'Save countdown' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'khel2026_countdown_title', value: 'Updated countdown' }),
      ]),
    )
  })

  it('waits for settings before populating draft values', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: mockSettingsMap,
      isSuccess: false,
    })

    render(<ContentPage />, { wrapper: createWrapper() })
    expect(screen.getByLabelText('Hero title')).toHaveValue('')
  })

  it('returns null when no content sections are configured', () => {
    const groupsSpy = vi.spyOn(contentSectionsModule, 'contentGroups', 'get').mockReturnValue([])

    const { container } = render(<ContentPage />, { wrapper: createWrapper() })
    expect(container.firstChild).toBeNull()

    groupsSpy.mockRestore()
  })

  it('saves site event status from shared site tab', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        event_status: 'registration_open',
        event_date: '2026-04-22',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Shared' }))
    await user.click(screen.getByRole('tab', { name: 'Site' }))
    await user.selectOptions(screen.getByLabelText('Event status'), 'pre_registration')
    await user.click(screen.getByRole('button', { name: 'Save site settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'event_status', value: 'pre_registration' }),
      ]),
    )
  })

  it('saves org section visibility settings', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        team_visible: 'true',
        team_title: 'Our Team',
        org_impact_title: 'Impact',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    await user.click(screen.getByLabelText('Show Team section'))
    await user.clear(screen.getByLabelText('Team heading'))
    await user.type(screen.getByLabelText('Team heading'), 'Leadership Team')
    await user.click(screen.getByRole('button', { name: 'Save org section settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'team_visible', value: 'false', section: 'org_sections' }),
        expect.objectContaining({
          key: 'team_title',
          value: 'Leadership Team',
          section: 'org_sections',
        }),
      ]),
    )
  })

  it('defaults org section visibility checkboxes to checked when unset', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    expect(screen.getByLabelText('Show Hero section')).toBeChecked()
    expect(screen.getByLabelText('Show Impact section')).toBeChecked()
  })

  it('resets section tab when switching content groups', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'About' }))
    expect(screen.getByLabelText('Mission')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Khel 2026' }))
    expect(screen.getByLabelText('Hero title')).toHaveValue('Event Hero Title')

    await user.click(screen.getByRole('tab', { name: 'Shared' }))
    expect(screen.getByLabelText('Site name (header)')).toBeInTheDocument()
  })

  it('saves org footer and contact fields', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        footer_description: 'Footer description',
        contact_address: 'Old address',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Footer' }))
    await user.clear(screen.getByLabelText('Description'))
    await user.type(screen.getByLabelText('Description'), 'Updated footer')
    await user.click(screen.getByRole('button', { name: 'Save footer' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'footer_description', value: 'Updated footer' }),
      ]),
    )

    await user.click(screen.getByRole('tab', { name: 'Contact' }))
    await user.clear(screen.getByLabelText('Address'))
    await user.type(screen.getByLabelText('Address'), 'New address')
    await user.click(screen.getByRole('button', { name: 'Save contact' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'contact_address', value: 'New address' }),
      ]),
    )
  })

  it('shows saving state while section update is pending', () => {
    mockUseUpdateSectionSettings.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
  })

  it('saves Khel 2026 section visibility from event group', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        khel2026_faq_visible: 'true',
        khel2026_faq_title: 'FAQ',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Khel 2026' }))
    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    await user.click(screen.getByLabelText('Show FAQ section'))
    await user.click(screen.getByRole('button', { name: 'Save Khel 2026 section settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'khel2026_faq_visible',
          value: 'false',
          section: 'khel2026_sections',
        }),
      ]),
    )
  })

  it('loads unchecked org visibility from stored false values', async () => {
    const user = userEvent.setup()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        contact_visible: 'false',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    expect(screen.getByLabelText('Show Contact section')).not.toBeChecked()
  })

  it('saves Khel 2026 register pre-registration message', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Khel 2026' }))
    await user.click(screen.getByRole('tab', { name: 'Register' }))
    await user.clear(screen.getByLabelText('Pre-registration message'))
    await user.type(screen.getByLabelText('Pre-registration message'), 'Updated pre-reg message')
    await user.click(screen.getByRole('button', { name: 'Save register CTA' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'khel2026_register_pre_message',
          value: 'Updated pre-reg message',
        }),
      ]),
    )
  })
})
