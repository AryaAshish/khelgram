import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TestimonialCarousel } from './TestimonialCarousel'

const testimonials = [
  {
    id: 't1',
    quote: 'Great program',
    author: 'Anita',
    relation: 'Parent',
    sortOrder: 0,
  },
  {
    id: 't2',
    quote: 'Life changing',
    author: 'Ravi',
    relation: 'Coach',
    sortOrder: 1,
  },
]

describe('TestimonialCarousel', () => {
  it('renders testimonial carousel controls for multiple entries', async () => {
    const user = userEvent.setup()

    render(<TestimonialCarousel title="Testimonials" testimonials={testimonials} />)

    expect(screen.getByText(/Great program/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(/Life changing/)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Show testimonial 1' }))
    expect(screen.getByText(/Great program/)).toBeInTheDocument()
    expect(document.getElementById('testimonials')).toHaveAttribute('data-variant', 'default')
  })

  it('returns null when testimonials are empty', () => {
    const { container } = render(<TestimonialCarousel title="Voices" testimonials={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
