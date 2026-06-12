import { render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Programs' })).toHaveAttribute('href', '#programs')
    expect(screen.getByRole('link', { name: 'Impact' })).toHaveAttribute('href', '#impact')
    expect(screen.getByRole('link', { name: 'Khel2026' })).toHaveAttribute('href', '/khel2026')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'Admin sign in' })).toHaveAttribute('href', '/admin')
  })

  it('links logo to homepage', () => {
    render(
      <MemoryRouter>
        <SiteHeader siteName="Khelgram Foundation" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Khelgram Foundation' })).toHaveAttribute('href', '/')
  })
})
