import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent, countdownTarget } from '@/fixtures/homePageFixtures'
import { EventLandingSections } from './EventLandingSections'

const mockUseGames = vi.fn()
const mockUseGallery = vi.fn()
const mockUseFaq = vi.fn()
const mockUseAllSettings = vi.fn()
const mockUseRegistrationCount = vi.fn()
const mockUseCreateRegistration = vi.fn()

vi.mock('@/hooks/useGames', () => ({
  useGames: () => mockUseGames(),
}))

vi.mock('@/hooks/useGallery', () => ({
  useGallery: () => mockUseGallery(),
}))

vi.mock('@/hooks/useFaq', () => ({
  useFaq: () => mockUseFaq(),
}))

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: () => mockUseAllSettings(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useRegistrationCount: () => mockUseRegistrationCount(),
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

function renderEventLanding() {
  return render(<EventLandingSections />, { wrapper: createWrapper() })
}

function setDefaultHookMocks() {
  mockUseGames.mockReturnValue({
    games: [
      {
        id: 'sack-race',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: '6-10',
        startTime: '10:00',
      },
    ],
    isLoading: false,
  })
  mockUseGallery.mockReturnValue({
    images: [{ id: 'gallery-1', url: 'https://example.com/1.jpg', alt: 'Gallery image' }],
    isLoading: false,
  })
  mockUseFaq.mockReturnValue({
    items: [{ id: 'faq-1', question: 'What to bring?', answer: 'Water bottle', sortOrder: 0 }],
    isLoading: false,
  })
  mockUseRegistrationCount.mockReturnValue({ data: 12 })
  mockUseCreateRegistration.mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  })
  mockUseAllSettings.mockReturnValue({
    settingsMap: {
      event_status: 'registration_open',
      event_date: '2026-04-22',
      hero_title: "Khelgram Foundation Children's Sports Festival 2026",
      khel2026_hero_title: "Khelgram Foundation Children's Sports Festival 2026",
      khel2026_hero_subtitle: 'Subtitle',
      khel2026_hero_primary_cta: 'Register Now',
      khel2026_hero_secondary_cta: 'Explore Events',
      khel2026_hero_event_date_label: 'Festival Date',
      khel2026_hero_event_date: 'March 20, 2026',
      khel2026_countdown_title: 'Countdown to Festival Day',
      khel2026_events_title: 'Festival Events',
      khel2026_gallery_title: 'Gallery',
      khel2026_register_title: 'Register Your Child',
      khel2026_register_submit_label: 'Register Now',
      khel2026_faq_title: 'FAQ',
      khel2026_hero_visible: 'true',
      khel2026_countdown_visible: 'true',
      khel2026_events_visible: 'true',
      khel2026_gallery_visible: 'true',
      khel2026_register_cta_visible: 'true',
      khel2026_faq_visible: 'true',
    },
    countdownTarget,
  })
}

describe('EventLandingSections', () => {
  beforeEach(() => {
    mockUseGames.mockReset()
    mockUseGallery.mockReset()
    mockUseFaq.mockReset()
    mockUseAllSettings.mockReset()
    mockUseRegistrationCount.mockReset()
    mockUseCreateRegistration.mockReset()
  })

  it('renders festival sections on the event landing page', () => {
    setDefaultHookMocks()
    renderEventLanding()

    expect(
      screen.getByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(screen.getByText('Countdown to Festival Day')).toBeInTheDocument()
    expect(screen.getByText('Festival Events')).toBeInTheDocument()
    expect(screen.getByText('Register Your Child')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('scrolls to register form when hero primary CTA is clicked', async () => {
    setDefaultHookMocks()
    const scrollIntoView = vi.fn()
    const element = document.createElement('div')
    element.id = 'register-form'
    element.scrollIntoView = scrollIntoView
    document.body.appendChild(element)

    const user = userEvent.setup()
    renderEventLanding()

    await user.click(screen.getAllByRole('button', { name: 'Register Now' })[0]!)
    expect(scrollIntoView).toHaveBeenCalled()
    element.remove()
  })

  it('renders embedded registration form on the event landing page', () => {
    setDefaultHookMocks()
    renderEventLanding()

    const form = screen.getByRole('form', { name: 'Registration form' })
    expect(form).toBeInTheDocument()
    expect(form.querySelector('button[type="submit"]')).toHaveTextContent('Register Now')
  })

  it('shows pre-registration banner when event status is pre_registration', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'pre_registration',
        khel2026_register_pre_message: "Pre-registration open — we'll confirm dates by email",
        khel2026_hero_visible: 'true',
        khel2026_register_cta_visible: 'true',
        khel2026_hero_title: "Khelgram Foundation Children's Sports Festival 2026",
        khel2026_hero_subtitle: 'Subtitle',
        khel2026_hero_primary_cta: 'Register Now',
        khel2026_hero_secondary_cta: 'Explore Events',
      },
      countdownTarget: null,
    })

    renderEventLanding()

    expect(
      screen.getAllByText("Pre-registration open — we'll confirm dates by email").length,
    ).toBeGreaterThan(0)
  })

  it('hides sections when khel2026 visibility settings are false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        khel2026_hero_title: "Khelgram Foundation Children's Sports Festival 2026",
        khel2026_events_title: 'Festival Events',
        khel2026_register_title: 'Register Your Child',
        khel2026_hero_visible: 'false',
        khel2026_countdown_visible: 'false',
        khel2026_countdown_title: 'Countdown to Festival Day',
        khel2026_events_visible: 'true',
        khel2026_register_cta_visible: 'true',
      },
      aboutContent,
      countdownTarget,
    })

    renderEventLanding()

    expect(
      screen.queryByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Countdown to Festival Day')).not.toBeInTheDocument()
    expect(screen.getByText('Festival Events')).toBeInTheDocument()
  })

  it('shows loading skeletons while event data loads', () => {
    setDefaultHookMocks()
    mockUseGames.mockReturnValue({ games: [], isLoading: true })
    mockUseGallery.mockReturnValue({ images: [], isLoading: true })
    mockUseFaq.mockReturnValue({ items: [], isLoading: true })

    renderEventLanding()

    expect(screen.getByLabelText('Festival Events loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Gallery loading')).toBeInTheDocument()
    expect(screen.getByLabelText('FAQ loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Register Your Child loading')).toBeInTheDocument()
  })

  it('scrolls to events when hero secondary CTA is clicked', async () => {
    setDefaultHookMocks()
    const scrollIntoView = vi.fn()
    const element = document.createElement('div')
    element.id = 'events'
    element.scrollIntoView = scrollIntoView
    document.body.appendChild(element)

    const user = userEvent.setup()
    renderEventLanding()
    await user.click(screen.getByRole('button', { name: 'Explore Events' }))

    expect(scrollIntoView).toHaveBeenCalled()
    element.remove()
  })

  it('does nothing when events anchor is missing', async () => {
    setDefaultHookMocks()
    const user = userEvent.setup()
    renderEventLanding()

    await expect(user.click(screen.getByRole('button', { name: 'Explore Events' }))).resolves.toBe(
      undefined,
    )
  })

  it('renders configured khel2026 hero copy', () => {
    setDefaultHookMocks()
    renderEventLanding()

    expect(
      screen.getByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Register Now' }).length).toBeGreaterThan(0)
  })

  it('hides gallery and FAQ when visibility settings are false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        hero_title: "Khelgram Foundation Children's Sports Festival 2026",
        events_title: 'Festival Events',
        register_title: 'Register Your Child',
        faq_title: 'FAQ',
        gallery_title: 'Gallery',
        khel2026_hero_visible: 'true',
        khel2026_events_visible: 'true',
        khel2026_register_cta_visible: 'true',
        khel2026_gallery_visible: 'false',
        khel2026_faq_visible: 'false',
      },
      countdownTarget,
    })

    renderEventLanding()

    expect(screen.queryByRole('heading', { name: 'Gallery' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'FAQ' })).not.toBeInTheDocument()
  })

  it('hides register CTA when visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        hero_title: "Khelgram Foundation Children's Sports Festival 2026",
        events_title: 'Festival Events',
        register_title: 'Register Your Child',
        khel2026_hero_visible: 'true',
        khel2026_events_visible: 'true',
        khel2026_register_cta_visible: 'false',
      },
      countdownTarget,
    })

    renderEventLanding()

    expect(screen.queryByRole('heading', { name: 'Register Your Child' })).not.toBeInTheDocument()
  })

  it('does not show countdown when hidden during pre-registration', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'pre_registration',
        khel2026_countdown_visible: 'false',
        khel2026_hero_visible: 'true',
      },
      countdownTarget: null,
    })

    renderEventLanding()

    expect(
      screen.queryByRole('heading', { name: 'Countdown to Festival Day' }),
    ).not.toBeInTheDocument()
  })

  it('does nothing when events anchor lacks scrollIntoView', async () => {
    setDefaultHookMocks()
    const element = document.createElement('div')
    element.id = 'events'
    document.body.appendChild(element)

    const user = userEvent.setup()
    renderEventLanding()
    await expect(user.click(screen.getByRole('button', { name: 'Explore Events' }))).resolves.toBe(
      undefined,
    )

    element.remove()
  })

  it('shows pre-registration copy on register CTA section', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'pre_registration',
        khel2026_register_pre_message: "Pre-registration open — we'll confirm dates by email",
        khel2026_register_cta_visible: 'true',
        khel2026_hero_visible: 'false',
        khel2026_countdown_visible: 'false',
        khel2026_events_visible: 'false',
        khel2026_gallery_visible: 'false',
        khel2026_faq_visible: 'false',
        khel2026_register_title: 'Register Your Child',
        khel2026_register_submit_label: 'Register Now',
      },
      countdownTarget: null,
    })

    renderEventLanding()

    expect(
      screen.getAllByText("Pre-registration open — we'll confirm dates by email").length,
    ).toBeGreaterThan(0)
  })

  it('uses event_date when hero_event_date is missing', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'registration_open',
        event_date: 'April 22, 2026',
        khel2026_hero_visible: 'true',
        khel2026_countdown_visible: 'false',
        khel2026_events_visible: 'false',
        khel2026_gallery_visible: 'false',
        khel2026_register_cta_visible: 'false',
        khel2026_faq_visible: 'false',
      },
      countdownTarget,
    })

    renderEventLanding()

    expect(screen.getByText(/April 22, 2026/)).toBeInTheDocument()
  })

  it('uses configured register submit label on CTA section', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        khel2026_register_title: 'Sign Up',
        khel2026_register_submit_label: 'Register Now',
        khel2026_register_pre_message: 'Sign up for Khel 2026',
        khel2026_register_cta_visible: 'true',
        khel2026_hero_visible: 'false',
        khel2026_countdown_visible: 'false',
        khel2026_events_visible: 'false',
        khel2026_gallery_visible: 'false',
        khel2026_faq_visible: 'false',
      },
      countdownTarget,
    })

    renderEventLanding()

    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register Now' })).toBeInTheDocument()
  })

  it('shows custom FAQ title on loading skeleton', () => {
    setDefaultHookMocks()
    mockUseFaq.mockReturnValue({ items: [], isLoading: true })
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        khel2026_faq_title: 'Event FAQ',
        khel2026_faq_visible: 'true',
        khel2026_hero_visible: 'false',
        khel2026_countdown_visible: 'false',
        khel2026_events_visible: 'false',
        khel2026_gallery_visible: 'false',
        khel2026_register_cta_visible: 'false',
      },
      countdownTarget,
    })

    renderEventLanding()

    expect(screen.getByLabelText('Event FAQ loading')).toBeInTheDocument()
  })

  it('shows success banner after registration mutation succeeds', async () => {
    setDefaultHookMocks()
    const mutate = vi.fn((_input: unknown, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.()
    })
    mockUseCreateRegistration.mockReturnValue({ mutate, isPending: false })

    const user = userEvent.setup()
    renderEventLanding()

    await user.type(screen.getByLabelText('Child Name'), 'Aarav')
    await user.type(screen.getByLabelText('Age'), '8')
    await user.type(screen.getByLabelText('Parent Name'), 'Neha')
    await user.type(screen.getByLabelText('Email'), 'neha@example.com')
    await user.type(screen.getByLabelText('Phone'), '9999999999')
    await user.click(screen.getByLabelText('Sack Race'))
    const form = screen.getByRole('form', { name: 'Registration form' })
    await user.click(within(form).getByRole('button', { name: 'Register Now' }))

    expect(mutate).toHaveBeenCalled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows link back to NGO homepage', () => {
    setDefaultHookMocks()
    renderEventLanding()

    expect(
      screen.getByRole('link', { name: /Back to Khelgram Foundation homepage/i }),
    ).toHaveAttribute('href', '/')
  })
})
