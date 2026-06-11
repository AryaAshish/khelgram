import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent, countdownTarget } from '@/fixtures/homePageFixtures'
import { HomePage } from './HomePage'

const mockUseGames = vi.fn()
const mockUseGallery = vi.fn()
const mockUseImpactStats = vi.fn()
const mockUseTeam = vi.fn()
const mockUseContributors = vi.fn()
const mockUseSponsors = vi.fn()
const mockUseTestimonials = vi.fn()
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

vi.mock('@/hooks/useImpactStats', () => ({
  useImpactStats: () => mockUseImpactStats(),
}))

vi.mock('@/hooks/useTeam', () => ({
  useTeam: () => mockUseTeam(),
}))

vi.mock('@/hooks/useContributors', () => ({
  useContributors: () => mockUseContributors(),
}))

vi.mock('@/hooks/useSponsors', () => ({
  useSponsors: () => mockUseSponsors(),
}))

vi.mock('@/hooks/useTestimonials', () => ({
  useTestimonials: () => mockUseTestimonials(),
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
  mockUseTeam.mockReturnValue({
    members: [
      { id: 'team-1', name: 'Priya Sharma', role: 'Director', published: true, sortOrder: 0 },
    ],
    isLoading: false,
  })
  mockUseContributors.mockReturnValue({
    contributors: [
      { id: 'contributor-1', name: 'Local Schools', contribution: 'Support', sortOrder: 0 },
    ],
    isLoading: false,
  })
  mockUseSponsors.mockReturnValue({
    sponsors: [{ id: 'sponsor-1', name: 'Greenfield Sports', tier: 'platinum', sortOrder: 0 }],
    isLoading: false,
  })
  mockUseTestimonials.mockReturnValue({
    testimonials: [
      {
        id: 'testimonial-1',
        quote: 'Great event',
        author: 'Anita',
        relation: 'Parent',
        sortOrder: 0,
      },
    ],
    isLoading: false,
  })
  mockUseFaq.mockReturnValue({
    items: [
      {
        id: 'faq-1',
        question: 'What to bring?',
        answer: 'Water bottle',
        sortOrder: 0,
      },
    ],
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
      countdown_title: 'Countdown to Festival Day',
      about_title: 'About Khelgram Foundation',
      events_title: 'Festival Events',
      gallery_title: 'Gallery',
      register_title: 'Register Your Child',
      register_submit_label: 'Submit Registration',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    },
    aboutContent,
    countdownTarget,
  })
}

describe('HomePage', () => {
  beforeEach(() => {
    mockUseGames.mockReset()
    mockUseGallery.mockReset()
    mockUseImpactStats.mockReset()
    mockUseTeam.mockReset()
    mockUseContributors.mockReset()
    mockUseSponsors.mockReset()
    mockUseTestimonials.mockReset()
    mockUseFaq.mockReset()
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
    mockUseTeam.mockReturnValue({ members: [], isLoading: true })
    mockUseContributors.mockReturnValue({ contributors: [], isLoading: true })
    mockUseSponsors.mockReturnValue({ sponsors: [], isLoading: true })
    mockUseTestimonials.mockReturnValue({ testimonials: [], isLoading: true })
    mockUseFaq.mockReturnValue({ items: [], isLoading: true })

    render(<HomePage />)

    expect(screen.getByLabelText('Festival Events loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Impact loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Gallery loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Our Team loading')).toBeInTheDocument()
    expect(screen.getByLabelText('FAQ loading')).toBeInTheDocument()
  })

  it('uses default section titles when settings are missing', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {},
      aboutContent,
      countdownTarget,
    })
    mockUseGames.mockReturnValue({ games: [], isLoading: true })
    mockUseGallery.mockReturnValue({ images: [], isLoading: true })

    render(<HomePage />)

    expect(screen.getByLabelText('Festival Events loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Gallery loading')).toBeInTheDocument()
  })

  it('uses custom section titles on loading skeletons', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        about_title: 'Custom About',
        events_title: 'Custom Events',
        gallery_title: 'Custom Gallery',
        team_title: 'Custom Team',
        contributors_title: 'Custom Contributors',
        sponsors_title: 'Custom Sponsors',
        testimonials_title: 'Custom Testimonials',
        faq_title: 'Custom FAQ',
      },
      aboutContent,
      countdownTarget,
    })
    mockUseGames.mockReturnValue({ games: [], isLoading: true })
    mockUseGallery.mockReturnValue({ images: [], isLoading: true })
    mockUseImpactStats.mockReturnValue({ impactStats: [], isLoading: true })
    mockUseTeam.mockReturnValue({ members: [], isLoading: true })
    mockUseContributors.mockReturnValue({ contributors: [], isLoading: true })
    mockUseSponsors.mockReturnValue({ sponsors: [], isLoading: true })
    mockUseTestimonials.mockReturnValue({ testimonials: [], isLoading: true })
    mockUseFaq.mockReturnValue({ items: [], isLoading: true })

    render(<HomePage />)

    expect(screen.getByLabelText('Custom Events loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Gallery loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Team loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Contributors loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Sponsors loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom Testimonials loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom FAQ loading')).toBeInTheDocument()
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
    mockUseAllSettings.mockReturnValue({
      settingsMap: {},
      aboutContent,
      countdownTarget,
    })

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
        countdown_tba_text: 'To Be Announced',
        register_pre_message: "Pre-registration open — we'll confirm dates by email",
      },
      aboutContent,
      countdownTarget,
    })

    render(<HomePage />)

    expect(screen.getByText('To Be Announced')).toBeInTheDocument()
    expect(
      screen.getByText("Pre-registration open — we'll confirm dates by email"),
    ).toBeInTheDocument()
  })

  it('falls back to default TBA text during pre-registration', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        event_status: 'pre_registration',
      },
      aboutContent,
      countdownTarget: null,
    })

    render(<HomePage />)

    expect(screen.getAllByText('To Be Announced').length).toBeGreaterThan(0)
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

  it('renders custom section titles from settings map', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        hero_title: 'Custom Hero',
        countdown_title: 'Custom Countdown',
        about_title: 'Custom About',
        events_title: 'Custom Events',
        gallery_title: 'Custom Gallery',
        register_title: 'Custom Register',
        contact_title: 'Custom Contact',
        hero_primary_cta: 'Join',
        hero_secondary_cta: 'Learn',
        hero_event_date_label: 'Date',
        hero_event_date: 'Soon',
        event_status: 'registration_open',
        event_date: '2026-04-22',
        register_submit_label: 'Send',
        footer_description: 'Custom footer',
        footer_copyright: 'Custom copyright',
      },
      aboutContent,
      countdownTarget,
    })

    render(<HomePage />)

    expect(screen.getByText('Custom Countdown')).toBeInTheDocument()
    expect(screen.getByText('Custom About')).toBeInTheDocument()
    expect(screen.getByText('Custom Events')).toBeInTheDocument()
    expect(screen.getByText('Custom Gallery')).toBeInTheDocument()
    expect(screen.getByText('Custom Register')).toBeInTheDocument()
    expect(screen.getByText('Custom Contact')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
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
