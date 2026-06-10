import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'
import * as settingsService from '@/services/settings.service'

vi.mock('@/services/settings.service', () => ({
  getSetting: vi.fn(),
  getSettingsBySection: vi.fn(),
  updateSetting: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('HomePage', () => {
  it('renders the festival heading', async () => {
    vi.mocked(settingsService.getSetting).mockResolvedValue({
      key: 'site_name',
      value: 'Khelgram Foundation',
      section: 'header',
    })

    render(<HomePage />, { wrapper: createWrapper() })

    expect(
      await screen.findByText("Khelgram Foundation — Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(await screen.findByText('Khelgram Foundation')).toBeInTheDocument()
  })

  it('shows error message when settings fail to load', async () => {
    vi.mocked(settingsService.getSetting).mockRejectedValue(new Error('network'))

    render(<HomePage />, { wrapper: createWrapper() })

    expect(
      await screen.findByText('Unable to load site settings. Showing default content.'),
    ).toBeInTheDocument()
  })
})
