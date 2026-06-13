import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders the site name and NGO nav links', () => {
    render(
      <MemoryRouter>
        <SiteHeader siteName="Khelgram Foundation" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
    expect(screen.getByRole('link', { name: 'Programs' })).toHaveAttribute('href', '/#programs')
    expect(screen.getByRole('link', { name: 'Impact' })).toHaveAttribute('href', '/#impact')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact')
    expect(screen.getByRole('link', { name: 'Get Involved' })).toHaveAttribute(
      'href',
      '/get-involved',
    )
    expect(screen.getByRole('link', { name: 'Khel2026' })).toHaveAttribute('href', '/khel2026')
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('button', { name: 'Khel2026' })).toBeInTheDocument()
  })

  it('links logo to homepage', () => {
    render(
      <MemoryRouter>
        <SiteHeader siteName="Khelgram Foundation" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Khelgram Foundation' })).toHaveAttribute('href', '/')
  })

  it('toggles mobile navigation', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SiteHeader siteName="Khelgram Foundation" />
      </MemoryRouter>,
    )

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(document.getElementById('primary-navigation')).not.toHaveClass('site-nav--open')

    await user.click(toggle)
    expect(document.getElementById('primary-navigation')).toHaveClass('site-nav--open')
  })
})
