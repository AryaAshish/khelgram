import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders the site name and nav links', () => {
    render(
      <MemoryRouter>
        <SiteHeader siteName="Khelgram Foundation" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '#events')
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: 'Admin sign in' })).toHaveAttribute('href', '/admin')
  })
})
