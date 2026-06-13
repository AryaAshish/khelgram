import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { StickyMobileCta } from './StickyMobileCta'

describe('StickyMobileCta', () => {
  it('renders nothing before scroll threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    const { container } = render(
      <MemoryRouter>
        <StickyMobileCta />
      </MemoryRouter>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders quick actions after scroll', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })

    render(
      <MemoryRouter>
        <StickyMobileCta donateHref="https://donate.example" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Quick actions' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Our Programs' })).toHaveAttribute('href', '#programs')
    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute(
      'href',
      'https://donate.example',
    )
    expect(screen.getByRole('link', { name: 'Khel 2026' })).toHaveAttribute('href', '/khel2026')
  })

  it('uses internal route for donate page', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })

    render(
      <MemoryRouter>
        <StickyMobileCta donateHref="/donate" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '/donate')
  })

  it('uses hash donate link for internal paths', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })

    render(
      <MemoryRouter>
        <StickyMobileCta donateHref="#support" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '#support')
  })
})
