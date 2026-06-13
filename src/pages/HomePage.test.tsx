import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aboutContent, contactContent, footerContent } from '@/fixtures/homePageFixtures'
import { HomePage } from './HomePage'

const mockUseImpactStats = vi.fn()
const mockUseTeam = vi.fn()
const mockUseContributors = vi.fn()
const mockUseSponsors = vi.fn()
const mockUseTestimonials = vi.fn()
const mockUseAllSettings = vi.fn()
const mockUsePrograms = vi.fn()
const mockUseSuccessStories = vi.fn()

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

vi.mock('@/hooks/useSiteSettings', () => ({
  useAllSettings: () => mockUseAllSettings(),
}))

vi.mock('@/hooks/usePrograms', () => ({
  usePrograms: () => mockUsePrograms(),
}))

vi.mock('@/hooks/useSuccessStories', () => ({
  useSuccessStories: () => mockUseSuccessStories(),
}))

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

function setDefaultHookMocks() {
  mockUseImpactStats.mockReturnValue({
    impactStats: [{ id: 'org-villages', value: '120+', label: 'Villages Reached', sortOrder: 0 }],
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
  mockUseAllSettings.mockReturnValue({
    settingsMap: {
      site_name: 'Khelgram Foundation',
      org_hero_title: 'Building sporting futures in rural India',
      org_hero_subtitle: 'Grassroots sports NGO copy',
      org_hero_primary_cta: 'Our impact',
      org_hero_secondary_cta: 'Khel 2026',
      org_about_title: 'About Khelgram Foundation',
      org_impact_title: 'Impact',
      team_title: 'Our Team',
      contributors_title: 'Contributors',
      sponsors_title: 'Sponsors',
      testimonials_title: 'Testimonials',
      contact_title: 'Contact',
      footer_description: 'Footer description',
      footer_copyright: 'Footer copyright',
    },
    aboutContent,
  })
  mockUsePrograms.mockReturnValue({
    programs: [
      {
        id: 'program-1',
        title: 'Grassroots Discovery',
        description: 'Scouting program',
        pillar: 'grassroots_discovery',
        published: true,
        sortOrder: 0,
      },
    ],
    isLoading: false,
  })
  mockUseSuccessStories.mockReturnValue({
    stories: [
      {
        id: 'story-1',
        title: 'From village field to district finals',
        summary: 'Grassroots scouting',
        story: 'Full story',
        published: true,
        sortOrder: 1,
      },
    ],
    isLoading: false,
  })
}

describe('HomePage', () => {
  beforeEach(() => {
    mockUseImpactStats.mockReset()
    mockUseTeam.mockReset()
    mockUseContributors.mockReset()
    mockUseSponsors.mockReset()
    mockUseTestimonials.mockReset()
    mockUseAllSettings.mockReset()
    mockUsePrograms.mockReset()
    mockUseSuccessStories.mockReset()
  })

  it('renders NGO homepage sections without festival blocks', () => {
    setDefaultHookMocks()
    renderHomePage()

    expect(screen.getByText('Building sporting futures in rural India')).toBeInTheDocument()
    expect(screen.getByText('About Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our Programs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Impact' })).toBeInTheDocument()
    expect(screen.queryByText('Countdown to Festival Day')).not.toBeInTheDocument()
    expect(screen.queryByText('Festival Events')).not.toBeInTheDocument()
    expect(screen.queryByText('Register Your Child')).not.toBeInTheDocument()
  })

  it('uses CMS org hero image when configured', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
        org_hero_image: 'https://cms.example/custom-hero.jpg',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByRole('img', { name: /Children celebrating/ })).toHaveAttribute(
      'src',
      'https://cms.example/custom-hero.jpg',
    )
  })

  it('shows Khel2026 nav link and secondary hero CTA', () => {
    setDefaultHookMocks()
    renderHomePage()

    expect(screen.getByRole('link', { name: 'Khel2026' })).toHaveAttribute('href', '/khel2026')
    expect(screen.getAllByRole('link', { name: 'Khel 2026' }).length).toBeGreaterThan(0)
  })

  it('shows section skeletons while credibility data is loading', () => {
    setDefaultHookMocks()
    mockUsePrograms.mockReturnValue({ programs: [], isLoading: true })
    mockUseImpactStats.mockReturnValue({ impactStats: [], isLoading: true })
    mockUseTeam.mockReturnValue({ members: [], isLoading: true })
    mockUseContributors.mockReturnValue({ contributors: [], isLoading: true })
    mockUseSponsors.mockReturnValue({ sponsors: [], isLoading: true })
    mockUseTestimonials.mockReturnValue({ testimonials: [], isLoading: true })

    renderHomePage()

    expect(screen.getByLabelText('Impact loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Our Team loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Our Programs loading')).toBeInTheDocument()
  })

  it('uses default org hero copy when settings are missing', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: { site_name: 'Khelgram Foundation' },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByText('Building sporting futures in rural India')).toBeInTheDocument()
    expect(
      screen.getByText(/discovers and nurtures grassroots talent in villages/i),
    ).toBeInTheDocument()
  })

  it('scrolls to impact when org hero primary CTA is clicked', async () => {
    setDefaultHookMocks()
    const scrollIntoView = vi.fn()
    const element = document.createElement('div')
    element.id = 'impact'
    element.scrollIntoView = scrollIntoView
    document.body.appendChild(element)

    const user = userEvent.setup()
    renderHomePage()
    await user.click(screen.getByRole('button', { name: 'Our impact' }))

    expect(scrollIntoView).toHaveBeenCalled()
    element.remove()
  })

  it('does nothing when impact anchor is missing', () => {
    setDefaultHookMocks()
    renderHomePage()
    screen.getByRole('button', { name: 'Our impact' }).click()
  })

  it('hides sections when visibility settings are false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        org_hero_visible: 'false',
        programs_visible: 'false',
        team_visible: 'false',
        footer_visible: 'false',
        about_title: 'About Khelgram Foundation',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByText('Building sporting futures in rural India')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Our Programs' })).not.toBeInTheDocument()
    expect(screen.queryByText('Our Team')).not.toBeInTheDocument()
    expect(screen.queryByText('Footer copyright')).not.toBeInTheDocument()
    expect(screen.getByText('About Khelgram Foundation')).toBeInTheDocument()
  })

  it('hides about section when about visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        about_visible: 'false',
        about_title: 'About Khelgram Foundation',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByText('About Khelgram Foundation')).not.toBeInTheDocument()
  })

  it('hides impact section when impact visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        impact_visible: 'false',
        org_impact_title: 'Impact',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByRole('heading', { name: 'Impact' })).not.toBeInTheDocument()
  })

  it('hides programs section when programs visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        programs_visible: 'false',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByRole('heading', { name: 'Our Programs' })).not.toBeInTheDocument()
  })

  it('hides success stories section when visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        success_stories_visible: 'false',
        success_stories_title: 'Success Stories',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByRole('heading', { name: 'Success Stories' })).not.toBeInTheDocument()
  })

  it('shows success stories skeleton while loading', () => {
    setDefaultHookMocks()
    mockUseSuccessStories.mockReturnValue({ stories: [], isLoading: true })

    renderHomePage()

    expect(screen.getByLabelText('Success Stories loading')).toBeInTheDocument()
  })

  it('renders get involved section with register and contact CTAs', () => {
    setDefaultHookMocks()
    renderHomePage()

    expect(screen.getByRole('heading', { name: 'Get Involved' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register your child' })).toHaveAttribute(
      'href',
      '/register',
    )
    expect(screen.getByRole('link', { name: 'View all ways to help' })).toHaveAttribute(
      'href',
      '/get-involved',
    )
  })

  it('hides get involved section when visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        get_involved_visible: 'false',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByRole('heading', { name: 'Get Involved' })).not.toBeInTheDocument()
  })

  it('renders custom impact title from settings', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        org_impact_title: 'Community Impact',
        org_impact_subtitle: 'Grassroots sports outcomes.',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByRole('heading', { name: 'Community Impact' })).toBeInTheDocument()
    expect(screen.getByText('Grassroots sports outcomes.')).toBeInTheDocument()
  })

  it('shows credibility section skeletons while loading', () => {
    setDefaultHookMocks()
    mockUseContributors.mockReturnValue({ contributors: [], isLoading: true })
    mockUseSponsors.mockReturnValue({ sponsors: [], isLoading: true })
    mockUseTestimonials.mockReturnValue({ testimonials: [], isLoading: true })

    renderHomePage()

    expect(screen.getByLabelText('Contributors loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Sponsors loading')).toBeInTheDocument()
    expect(screen.getByLabelText('Testimonials loading')).toBeInTheDocument()
  })

  it('uses contact and footer fallbacks from fixtures', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        site_name: 'Khelgram Foundation',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByText(contactContent.address)).toBeInTheDocument()
    expect(screen.getByText(footerContent.copyright)).toBeInTheDocument()
  })

  it('uses custom contact fields from settings', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        contact_address: 'Village Road, Rajasthan',
        contact_phone: '9876543210',
        contact_email: 'hello@khelgram.org',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByText('Village Road, Rajasthan')).toBeInTheDocument()
    expect(screen.getByText('9876543210')).toBeInTheDocument()
    const contactSection = document.getElementById('contact')
    expect(contactSection).not.toBeNull()
    expect(within(contactSection!).getByText('hello@khelgram.org')).toBeInTheDocument()
  })

  it('renders custom section titles from settings map', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        org_about_title: 'Custom About',
        team_title: 'Custom Team',
        contributors_title: 'Custom Contributors',
        sponsors_title: 'Custom Sponsors',
        testimonials_title: 'Custom Testimonials',
        contact_title: 'Custom Contact',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByText('Custom About')).toBeInTheDocument()
    expect(screen.getByText('Custom Team')).toBeInTheDocument()
    expect(screen.getByText('Custom Contributors')).toBeInTheDocument()
    expect(screen.getByText('Custom Sponsors')).toBeInTheDocument()
    expect(screen.getByText('Custom Testimonials')).toBeInTheDocument()
    expect(screen.getByText('Custom Contact')).toBeInTheDocument()
  })

  it('hides credibility and contact sections when visibility is false', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        contributors_visible: 'false',
        sponsors_visible: 'false',
        testimonials_visible: 'false',
        contact_visible: 'false',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.queryByText('Contributors')).not.toBeInTheDocument()
    expect(screen.queryByText('Sponsors')).not.toBeInTheDocument()
    expect(screen.queryByText('Testimonials')).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).queryByRole('heading', { name: 'Contact' }),
    ).not.toBeInTheDocument()
  })

  it('renders support and reach sections when visible', () => {
    setDefaultHookMocks()
    mockUseAllSettings.mockReturnValue({
      settingsMap: {
        support_visible: 'true',
        reach_visible: 'true',
        support_title: 'Support Our Mission',
        reach_title: 'Where We Work',
      },
      aboutContent,
    })

    renderHomePage()

    expect(screen.getByRole('heading', { name: 'Support Our Mission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Where We Work' })).toBeInTheDocument()
    expect(screen.getByText('Uttar Pradesh')).toBeInTheDocument()
  })
})
