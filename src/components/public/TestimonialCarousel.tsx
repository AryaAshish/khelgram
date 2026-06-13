import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { Testimonial } from '@/types/app.types'

export type TestimonialCarouselProps = {
  title: string
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ title, testimonials }: TestimonialCarouselProps) {
  return (
    <SectionShell id="testimonials" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.id} className="testimonial-card">
              <p style={{ margin: '0 0 0.75rem', fontStyle: 'italic' }}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer style={{ color: 'var(--color-text-subtle)', fontWeight: 600 }}>
                {testimonial.author}
                {testimonial.relation ? ` — ${testimonial.relation}` : ''}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
