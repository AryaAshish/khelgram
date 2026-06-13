import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TestimonialCarousel } from './TestimonialCarousel'

describe('TestimonialCarousel', () => {
  it('renders testimonial cards with accent styling', () => {
    render(
      <TestimonialCarousel
        title="Testimonials"
        testimonials={[
          {
            id: 't1',
            quote: 'Great program',
            author: 'Anita',
            relation: 'Parent',
            sortOrder: 0,
          },
        ]}
      />,
    )

    expect(screen.getByText(/Great program/)).toBeInTheDocument()
    expect(screen.getByText(/Anita/)).toBeInTheDocument()
    expect(document.getElementById('testimonials')).toHaveAttribute('data-variant', 'default')
  })

  it('omits relation when not provided', () => {
    render(
      <TestimonialCarousel
        title="Voices"
        testimonials={[
          {
            id: 't2',
            quote: 'Life changing',
            author: 'Ravi',
            relation: '',
            sortOrder: 1,
          },
        ]}
      />,
    )

    expect(screen.getByText('Ravi')).toBeInTheDocument()
    expect(screen.queryByText(/—/)).not.toBeInTheDocument()
  })
})
