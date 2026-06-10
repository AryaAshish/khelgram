import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContactSection } from './ContactSection'

describe('ContactSection', () => {
  it('renders contact details', () => {
    render(
      <ContactSection
        title="Contact"
        address="Address"
        phone="+91 12345 67890"
        email="hello@example.com"
      />,
    )

    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('+91 12345 67890')).toBeInTheDocument()
    expect(screen.getByText('hello@example.com')).toBeInTheDocument()
  })
})
