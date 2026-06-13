import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { OrgHeroSection } from './OrgHeroSection'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'hero.primaryCta' ? 'Our impact' : 'Khel 2026'),
  }),
}))

describe('OrgHeroSection', () => {
  it('renders split hero with image, eyebrow, and CTAs', async () => {
    const onPrimaryClick = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <OrgHeroSection
          title="Building sporting futures"
          subtitle="Grassroots NGO mission"
          primaryCta="Our impact"
          secondaryCta="Khel 2026"
          onPrimaryClick={onPrimaryClick}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Building sporting futures' })).toBeInTheDocument()
    expect(screen.getByText('120+ villages reached')).toBeInTheDocument()
    expect(screen.getByText('Grassroots NGO mission')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Children celebrating/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Our impact' }))
    expect(onPrimaryClick).toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Khel 2026' })).toHaveAttribute('href', '/khel2026')
  })

  it('supports custom hero imagery and eyebrow', () => {
    render(
      <MemoryRouter>
        <OrgHeroSection
          title="Custom hero"
          subtitle="Custom subtitle"
          eyebrow="Custom eyebrow"
          imageUrl="https://example.com/hero.jpg"
          imageAlt="Custom alt"
          onPrimaryClick={() => undefined}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Custom eyebrow')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Custom alt' })).toHaveAttribute(
      'src',
      'https://example.com/hero.jpg',
    )
  })
})
