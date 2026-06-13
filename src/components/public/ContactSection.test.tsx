import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContactSection } from './ContactSection'

describe('ContactSection', () => {
  it('renders contact details in a warm section shell', () => {
    render(
      <ContactSection
        title="Contact"
        address="Jaipur"
        phone="+91 98765 43210"
        email="hello@khelgram.org"
      />,
    )

    expect(document.getElementById('contact')).toHaveAttribute('data-variant', 'warm')
    expect(screen.getByRole('link', { name: '+91 98765 43210' })).toHaveAttribute(
      'href',
      'tel:+919876543210',
    )
    expect(screen.getByRole('link', { name: 'hello@khelgram.org' })).toHaveAttribute(
      'href',
      'mailto:hello@khelgram.org',
    )
  })
})
