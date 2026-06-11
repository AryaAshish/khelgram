import type { Testimonial } from '@/types/app.types'

export type TestimonialCarouselProps = {
  title: string
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ title, testimonials }: TestimonialCarouselProps) {
  return (
    <section className="testimonials-section" id="testimonials" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.id}
              style={{
                margin: 0,
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}
            >
              <p style={{ margin: '0 0 0.75rem', fontStyle: 'italic' }}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer style={{ color: '#374151', fontWeight: 600 }}>
                {testimonial.author}
                {testimonial.relation ? ` — ${testimonial.relation}` : ''}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
