import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders the site name and nav links', () => {
    render(<SiteHeader siteName="Khelgram Foundation" />)
    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '#events')
  })
})
