import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TestimonialCarousel } from './TestimonialCarousel'

describe('TestimonialCarousel', () => {
  it('renders testimonial quotes and attribution', () => {
    render(
      <TestimonialCarousel
        title="Testimonials"
        testimonials={[
          {
            id: 'testimonial-1',
            quote: 'My daughter gained confidence.',
            author: 'Anita Mehta',
            relation: 'Parent',
            sortOrder: 0,
          },
          {
            id: 'testimonial-2',
            quote: 'Well organized event.',
            author: 'Coach Ravi',
            relation: '',
            sortOrder: 1,
          },
        ]}
      />,
    )

    expect(screen.getByText('Testimonials')).toBeInTheDocument()
    expect(screen.getByText(/My daughter gained confidence/)).toBeInTheDocument()
    expect(screen.getByText('Anita Mehta — Parent')).toBeInTheDocument()
    expect(screen.getByText('Coach Ravi')).toBeInTheDocument()
  })
})
