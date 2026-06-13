import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SupportSection } from './SupportSection'

const sampleContent = {
  title: 'Support Our Mission',
  description: 'Your contribution helps grassroots sports.',
  donateUrl: '/donate',
  fundsUsage: ['Equipment', 'Coaching'],
}

describe('SupportSection', () => {
  it('renders support copy and donate link', () => {
    render(
      <MemoryRouter>
        <SupportSection content={sampleContent} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Support Our Mission' })).toBeInTheDocument()
    expect(screen.getByText('Your contribution helps grassroots sports.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute('href', '/donate')
    expect(screen.getByText('Equipment')).toBeInTheDocument()
  })

  it('renders QR image when provided', () => {
    render(
      <MemoryRouter>
        <SupportSection
          content={{
            ...sampleContent,
            donateQrImage: 'https://example.org/qr.png',
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('img', { name: 'Donation QR code' })).toHaveAttribute(
      'src',
      'https://example.org/qr.png',
    )
  })

  it('opens external donate links in a new tab', () => {
    render(
      <MemoryRouter>
        <SupportSection
          content={{
            ...sampleContent,
            donateUrl: 'https://example.org/give',
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute(
      'href',
      'https://example.org/give',
    )
    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute('target', '_blank')
  })

  it('uses hash donate link for in-page anchors', () => {
    render(
      <MemoryRouter>
        <SupportSection
          content={{
            ...sampleContent,
            donateUrl: '#support',
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute('href', '#support')
  })
})
