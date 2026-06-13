import { useEffect, useState } from 'react'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { Testimonial } from '@/types/app.types'

export type TestimonialCarouselProps = {
  title: string
  testimonials: Testimonial[]
}

const AUTO_ADVANCE_MS = 6000

export function TestimonialCarousel({ title, testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const current = testimonials[index]

  useEffect(() => {
    if (testimonials.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % testimonials.length)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(timer)
  }, [testimonials.length])

  if (!current) {
    return null
  }

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + testimonials.length) % testimonials.length)
  }

  return (
    <SectionShell id="testimonials" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div className="testimonial-carousel">
          <blockquote className="testimonial-card testimonial-carousel__slide">
            <p className="testimonial-carousel__quote">&ldquo;{current.quote}&rdquo;</p>
            <footer className="testimonial-carousel__author">
              {current.author}
              {current.relation ? ` — ${current.relation}` : ''}
            </footer>
          </blockquote>
          {testimonials.length > 1 ? (
            <div className="testimonial-carousel__controls">
              <button
                type="button"
                className="testimonial-carousel__nav"
                onClick={() => goTo(index - 1)}
              >
                Previous
              </button>
              <div
                className="testimonial-carousel__dots"
                role="tablist"
                aria-label="Testimonial slides"
              >
                {testimonials.map((testimonial, dotIndex) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    role="tab"
                    aria-selected={dotIndex === index}
                    aria-label={`Show testimonial ${dotIndex + 1}`}
                    className={`testimonial-carousel__dot ${dotIndex === index ? 'testimonial-carousel__dot--active' : ''}`}
                    onClick={() => goTo(dotIndex)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="testimonial-carousel__nav"
                onClick={() => goTo(index + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  )
}
