import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SupportSection } from './SupportSection'

const sampleContent = {
  title: 'Support Our Mission',
  description: 'Your contribution helps grassroots sports.',
  donateUrl: 'https://khelgram.org/donate',
  fundsUsage: ['Equipment', 'Coaching'],
}

describe('SupportSection', () => {
  it('renders support copy and donate link', () => {
    render(<SupportSection content={sampleContent} />)

    expect(screen.getByRole('heading', { name: 'Support Our Mission' })).toBeInTheDocument()
    expect(screen.getByText('Your contribution helps grassroots sports.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Donate now' })).toHaveAttribute(
      'href',
      'https://khelgram.org/donate',
    )
    expect(screen.getByText('Equipment')).toBeInTheDocument()
  })

  it('renders QR image when provided', () => {
    render(
      <SupportSection
        content={{
          ...sampleContent,
          donateQrImage: 'https://example.org/qr.png',
        }}
      />,
    )

    expect(screen.getByRole('img', { name: 'Donation QR code' })).toHaveAttribute(
      'src',
      'https://example.org/qr.png',
    )
  })
})
