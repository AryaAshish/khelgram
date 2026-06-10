import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('renders the site name', () => {
    render(<SiteHeader siteName="Khelgram Foundation" />)
    expect(screen.getByText('Khelgram Foundation')).toBeInTheDocument()
  })
})
