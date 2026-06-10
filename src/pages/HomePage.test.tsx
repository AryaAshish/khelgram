import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

const mockUseGames = vi.fn()
const mockUseGallery = vi.fn()
const mockUseImpactStats = vi.fn()
const mockUseAllSettings = vi.fn()
const mockUseRegistrationCount = vi.fn()
const mockUseCreateRegistration = vi.fn()

vi.mock('@/hooks/useGames', () => ({
  useGames: () => mockUseGames(),
}))

vi.mock('@/hooks/useGallery', () => ({
  useGallery: () => mockUseGallery(),
}))

vi.mock('@/hooks/useImpactStats', () => ({
  useImpactStats: () => mockUseImpactStats(),
}))

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: () => mockUseAllSettings(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useRegistrationCount: () => mockUseRegistrationCount(),
  useCreateRegistration: () => mockUseCreateRegistration(),
}))

function setDefaultHookMocks() {
  mockUseGames.mockReturnValue({
    games: [
      {
        id: 'sack-race',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
      },
    ],
    isLoading: false,
  })
  mockUseGallery.mockReturnValue({
    images: [
      {
        id: 'gallery-1',
        url: 'https://example.com/1.jpg',
        alt: 'Gallery image',
      },
    ],
    isLoading: false,
  })
  mockUseImpactStats.mockReturnValue({
    impactStats: [{ id: 'children', value: '500+', label: 'Children Participating' }],
    isLoading: false,
  })
  mockUseRegistrationCount.mockReturnValue({ data: 12 })
  mockUseCreateRegistration.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  })
  mockUseAllSettings.mockReturnValue({
    settingsMap: {
      site_name: 'Khelgram Foundation',
      event_status: 'registration_open',
      event_date: '2026-04-22',
      hero_title: "Khelgram Foundation Children's Sports Festival 2026",
      hero_subtitle: 'Subtitle',
      hero_primary_cta: 'Register Now',
      hero_secondary_cta: 'Explore Events',
      hero_event_date_label: 'Festival Date',
      hero_event_date: 'March 20, 2026',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    },
  })
}

describe('HomePage', () => {
  beforeEach(() => {
    mockUseGames.mockReset()
    mockUseGallery.mockReset()
    mockUseImpactStats.mockReset()
    mockUseAllSettings.mockReset()
    mockUseRegistrationCount.mockReset()
    mockUseCreateRegistration.mockReset()
  })

  it('shows section skeletons while data is loading', () => {
    setDefaultHookMocks()
    mockUseGames.mockReturnValue({
      games: [],
      isLoading: true,
    })
    mockUseGallery.mockReturnValue({
      images: [],
      isLoading: true,
    })
    mockUseImpactStats.mockReturnValue({
      impactStats: [],
      isLoading: true,
    })

    render(<HomePage />)

    expect(screen.getByLabelText('Festival Events loading')).toBeInTheDocument()
    expect(screen.getByLabelText('About Khelgram Foundation loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Gallery loading')).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    setDefaultHookMocks()
    render(<HomePage />)

    expect(
      screen.getByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(screen.getByText('Countdown to Festival Day')).toBeInTheDocument()
    expect(screen.getByText('About Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByText('Festival Events')).toBeInTheDocument()
    expect(screen.getByText('Register Your Child')).toBeInTheDocument()
  })

  it('contains CTA buttons', async () => {
    setDefaultHookMocks()
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByRole('button', { name: 'Register Now' }))
    await user.click(screen.getByRole('button', { name: 'Explore Events' }))

    expect(screen.getByRole('button', { name: 'Register Now' })).toBeInTheDocument()
  })

  it('scrolls to section when register anchor exists', () => {
    setDefaultHookMocks()
    const scrollIntoView = vi.fn()
    const element = document.createElement('div')
    element.id = 'register'
    element.scrollIntoView = scrollIntoView
    document.body.appendChild(element)

    render(<HomePage />)
    screen.getByRole('button', { name: 'Register Now' }).click()

    expect(scrollIntoView).toHaveBeenCalled()
    element.remove()
  })

  it('uses fixture fallback settings when map values are missing', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({ settingsMap: {} })

    render(<HomePage />)

    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(
      screen.getByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Khelgram Foundation empowers children through sports, confidence building, and community-driven events.',
      ),
    ).toBeInTheDocument()
  })

  it('shows pre-registration messaging when event status is pre_registration', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'pre_registration',
      },
    })

    render(<HomePage />)

    expect(screen.getByText('To Be Announced')).toBeInTheDocument()
    expect(
      screen.getByText("Pre-registration open — we'll confirm dates by email"),
    ).toBeInTheDocument()
  })

  it('submits registration through create mutation', async () => {
    const mutate = vi.fn()
    setDefaultHookMocks()
    mockUseCreateRegistration.mockReturnValue({
      mutate,
      isPending: false,
    })

    const user = userEvent.setup()
    render(<HomePage />)

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

  it('shows registration counter in hero', () => {
    setDefaultHookMocks()
    render(<HomePage />)

    expect(screen.getByText('12 children registered so far')).toBeInTheDocument()
  })

  it('does nothing when target section is missing', async () => {
    setDefaultHookMocks()
    const user = userEvent.setup()
    render(<HomePage />)

    await expect(user.click(screen.getByRole('button', { name: 'Explore Events' }))).resolves.toBe(
      undefined,
    )
  })
})
