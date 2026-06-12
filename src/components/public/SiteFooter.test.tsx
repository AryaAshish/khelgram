import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders footer content', () => {
    render(
      <MemoryRouter>
        <SiteFooter description="Footer description" copyright="© 2026 Khelgram" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Footer description')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Khelgram')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Admin sign in' })).toHaveAttribute('href', '/admin')
  })
})
