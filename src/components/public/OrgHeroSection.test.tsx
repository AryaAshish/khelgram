import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { OrgHeroSection } from './OrgHeroSection'

describe('OrgHeroSection', () => {
  it('renders NGO hero copy and CTAs', async () => {
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
    expect(screen.getByText('Grassroots NGO mission')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Our impact' }))
    expect(onPrimaryClick).toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Khel 2026' })).toHaveAttribute('href', '/khel2026')
  })
})
