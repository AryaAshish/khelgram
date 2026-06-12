import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterPage } from './RegisterPage'

const mockUseGames = vi.fn()
const mockUseAllSettings = vi.fn()
const mockUseCreateRegistration = vi.fn()

vi.mock('@/hooks/useGames', () => ({
  useGames: () => mockUseGames(),
}))

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: () => mockUseAllSettings(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useCreateRegistration: () => mockUseCreateRegistration(),
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('RegisterPage', () => {
  beforeEach(() => {
    mockUseGames.mockReturnValue({
      games: [{ id: 'game-1', name: 'Sack Race' }],
      isLoading: false,
    })
    mockUseCreateRegistration.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        register_visible: 'true',
        register_title: 'Register Your Child',
        register_submit_label: 'Submit Registration',
        event_status: 'registration_open',
      },
    })
  })

  it('renders shareable registration form at dedicated route', () => {
    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('heading', { name: 'Register Your Child' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy registration link' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to Khel 2026/i })).toHaveAttribute(
      'href',
      '/khel2026',
    )
  })

  it('uses fallback copy when optional settings are missing', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        register_visible: 'true',
      },
    })

    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('heading', { name: 'Register Your Child' })).toBeInTheDocument()
    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Khelgram Foundation empowers children through sports, confidence building, and community-driven events.',
      ),
    ).toBeInTheDocument()
  })

  it('uses default submit label when setting is missing', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        register_visible: 'true',
        register_title: 'Register Your Child',
        event_status: 'registration_open',
      },
    })

    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: 'Submit Registration' })).toBeInTheDocument()
  })

  it('shows loading skeleton while games load', () => {
    mockUseGames.mockReturnValue({ games: [], isLoading: true })

    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByLabelText('Register Your Child loading')).toBeInTheDocument()
  })

  it('shows pre-registration banner on register page', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        register_visible: 'true',
        register_title: 'Register Your Child',
        event_status: 'pre_registration',
        register_pre_message: "Pre-registration open — we'll confirm dates by email",
      },
    })

    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByRole('status')).toHaveTextContent(
      "Pre-registration open — we'll confirm dates by email",
    )
  })

  it('submits registration from the dedicated page', async () => {
    const mutate = vi.fn()
    mockUseCreateRegistration.mockReturnValue({ mutate, isPending: false })
    const user = userEvent.setup()

    render(<RegisterPage />, { wrapper: createWrapper() })

    await user.type(screen.getByLabelText('Child Name'), 'Aarav')
    await user.type(screen.getByLabelText('Age'), '9')
    await user.type(screen.getByLabelText('Parent Name'), 'Neha')
    await user.type(screen.getByLabelText('Email'), 'neha@example.com')
    await user.type(screen.getByLabelText('Phone'), '9999999999')
    await user.click(screen.getByLabelText('Sack Race'))
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))

    expect(mutate).toHaveBeenCalledWith({
      childName: 'Aarav',
      age: '9',
      parentName: 'Neha',
      email: 'neha@example.com',
      phone: '9999999999',
      selectedEvents: ['Sack Race'],
    })
  })

  it('shows unavailable message when registration section is hidden', () => {
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        register_visible: 'false',
      },
    })

    render(<RegisterPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Registration unavailable')).toBeInTheDocument()
    expect(screen.queryByLabelText('Child Name')).not.toBeInTheDocument()
  })
})
