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
  hero_title: 'Current Hero Title',
  hero_subtitle: 'Current subtitle',
  hero_primary_cta: 'Register Now',
  hero_secondary_cta: 'Explore Events',
  hero_event_date_label: 'Festival Date',
  hero_event_date: 'March 20, 2026',
  about_title: 'About Khelgram Foundation',
  about_mission: 'Mission text',
  about_vision: 'Vision text',
  about_values: 'Value One',
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

  it('renders hero tab fields and saves section content', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    expect(screen.getByLabelText('Hero title')).toHaveValue('Current Hero Title')
    await user.clear(screen.getByLabelText('Hero title'))
    await user.type(screen.getByLabelText('Hero title'), 'Updated Hero Title')
    await user.click(screen.getByRole('button', { name: 'Save Hero' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'hero_title',
          value: 'Updated Hero Title',
          section: 'hero',
        }),
      ]),
    )
  })

  it('switches tabs and edits multiline about fields', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'About' }))
    await user.clear(screen.getByLabelText('Mission'))
    await user.type(screen.getByLabelText('Mission'), 'Updated mission')

    expect(screen.getByLabelText('Mission')).toHaveValue('Updated mission')
    expect(screen.getByLabelText('Values (one per line)')).toHaveAttribute('rows', '5')
  })

  it('saves countdown section from non-hero tab', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Countdown' }))
    await user.clear(screen.getByLabelText('Countdown heading'))
    await user.type(screen.getByLabelText('Countdown heading'), 'Updated countdown')
    await user.click(screen.getByRole('button', { name: 'Save Countdown' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'countdown_title', value: 'Updated countdown' }),
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
    const sectionsSpy = vi
      .spyOn(contentSectionsModule, 'contentSections', 'get')
      .mockReturnValue([])

    const { container } = render(<ContentPage />, { wrapper: createWrapper() })
    expect(container.firstChild).toBeNull()

    sectionsSpy.mockRestore()
  })

  it('saves site event status from select field', async () => {
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

    await user.click(screen.getByRole('tab', { name: 'Site' }))
    await user.selectOptions(screen.getByLabelText('Event status'), 'pre_registration')
    await user.click(screen.getByRole('button', { name: 'Save site settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'event_status', value: 'pre_registration' }),
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

  it('saves section visibility and credibility headings', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        team_visible: 'true',
        team_title: 'Our Team',
        faq_visible: 'true',
        faq_title: 'FAQ',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    await user.click(screen.getByLabelText('Show Team section'))
    await user.clear(screen.getByLabelText('Team heading'))
    await user.type(screen.getByLabelText('Team heading'), 'Leadership Team')
    await user.click(screen.getByRole('button', { name: 'Save section settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'team_visible', value: 'false', section: 'sections' }),
        expect.objectContaining({
          key: 'team_title',
          value: 'Leadership Team',
          section: 'sections',
        }),
      ]),
    )
  })

  it('defaults section visibility checkboxes to checked when unset', async () => {
    const user = userEvent.setup()
    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    expect(screen.getByLabelText('Show Hero section')).toBeChecked()
    expect(screen.getByLabelText('Show FAQ section')).toBeChecked()
  })

  it('loads unchecked visibility from stored false values', async () => {
    const user = userEvent.setup()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        gallery_visible: 'false',
        contact_visible: 'false',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    expect(screen.getByLabelText('Show Gallery section')).not.toBeChecked()
    expect(screen.getByLabelText('Show Contact section')).not.toBeChecked()
  })

  it('saves footer and contact multiline fields', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        footer_description: 'Footer description',
        footer_copyright: 'Footer copyright',
        contact_title: 'Contact',
        contact_address: 'Old address',
        contact_phone: '111',
        contact_email: 'old@example.com',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Footer' }))
    await user.clear(screen.getByLabelText('Description'))
    await user.type(screen.getByLabelText('Description'), 'Updated footer')
    await user.click(screen.getByRole('button', { name: 'Save Footer' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'footer_description', value: 'Updated footer' }),
      ]),
    )

    await user.click(screen.getByRole('tab', { name: 'Contact' }))
    await user.clear(screen.getByLabelText('Address'))
    await user.type(screen.getByLabelText('Address'), 'New address')
    await user.click(screen.getByRole('button', { name: 'Save Contact' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'contact_address', value: 'New address' }),
      ]),
    )
  })

  it('saves register and events section headings', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        events_title: 'Festival Events',
        register_title: 'Register Your Child',
        register_submit_label: 'Submit Registration',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Events' }))
    await user.clear(screen.getByLabelText('Section heading'))
    await user.type(screen.getByLabelText('Section heading'), 'Updated Events')
    await user.click(screen.getByRole('button', { name: 'Save Events' }))

    await user.click(screen.getByRole('tab', { name: 'Register' }))
    await user.clear(screen.getByLabelText('Submit button label'))
    await user.type(screen.getByLabelText('Submit button label'), 'Send Form')
    await user.click(screen.getByRole('button', { name: 'Save Register' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'events_title', value: 'Updated Events' }),
      ]),
    )
    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'register_submit_label', value: 'Send Form' }),
      ]),
    )
  })

  it('saves register pre-registration message', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        register_pre_message: 'Old message',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Register' }))
    await user.clear(screen.getByLabelText('Pre-registration message'))
    await user.type(screen.getByLabelText('Pre-registration message'), 'Updated pre-reg message')
    await user.click(screen.getByRole('button', { name: 'Save Register' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'register_pre_message',
          value: 'Updated pre-reg message',
        }),
      ]),
    )
  })

  it('saves impact heading on sections tab', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        impact_title: 'Impact',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    await user.clear(screen.getByLabelText('Impact heading'))
    await user.type(screen.getByLabelText('Impact heading'), 'Our Impact')
    await user.click(screen.getByRole('button', { name: 'Save section settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'impact_title', value: 'Our Impact', section: 'sections' }),
      ]),
    )
  })

  it('saves re-enabled section visibility', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        gallery_visible: 'false',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Sections' }))
    await user.click(screen.getByLabelText('Show Gallery section'))
    await user.click(screen.getByRole('button', { name: 'Save section settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'gallery_visible', value: 'true', section: 'sections' }),
      ]),
    )
  })

  it('saves site name from site tab', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue([])
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        ...mockSettingsMap,
        site_name: 'Khelgram Foundation',
      },
      isSuccess: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('tab', { name: 'Site' }))
    await user.clear(screen.getByLabelText('Site name (header)'))
    await user.type(screen.getByLabelText('Site name (header)'), 'Khelgram Sports')
    await user.click(screen.getByRole('button', { name: 'Save site settings' }))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'site_name', value: 'Khelgram Sports', section: 'header' }),
      ]),
    )
  })
})
