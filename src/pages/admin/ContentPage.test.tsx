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

  it('shows saving state while section update is pending', () => {
    mockUseUpdateSectionSettings.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    })

    render(<ContentPage />, { wrapper: createWrapper() })
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
  })
})
