import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('renders footer content', () => {
    render(<SiteFooter description="Footer description" copyright="© 2026 Khelgram" />)

    expect(screen.getByText('Footer description')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Khelgram')).toBeInTheDocument()
  })
})
